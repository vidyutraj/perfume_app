import { type Fragrance } from "./types"

// This will be populated from your Kaggle dataset
// Place your dataset JSON/CSV file in /public/data/ or /data/ directory
let fragranceDataset: Fragrance[] = []

// Load dataset from JSON file
export async function loadDataset(): Promise<Fragrance[]> {
  if (fragranceDataset.length > 0) {
    return fragranceDataset
  }

  try {
    // Try to load from public/data directory
    const response = await fetch("/data/fragrances.json")
    if (!response.ok) {
      throw new Error("Dataset file not found at /data/fragrances.json. Please add your Kaggle dataset file there.")
    }
    const data = await response.json()
    
    // Convert Kaggle format if needed
    const { convertKaggleRowToFragrance } = await import("./loader")
    
    let rawData: any[] = []
    if (Array.isArray(data)) {
      rawData = data
    } else if (data.fragrances && Array.isArray(data.fragrances)) {
      rawData = data.fragrances
    } else {
      console.error("Invalid dataset format")
      return []
    }
    
    // Convert all rows
    fragranceDataset = rawData.map(convertKaggleRowToFragrance).filter(f => f.name) // Filter out invalid entries
    
    console.log(`✅ Loaded ${fragranceDataset.length} fragrances from dataset`)
    
    return fragranceDataset
  } catch (error) {
    console.error("Error loading dataset:", error)
    console.error("Please ensure your dataset is at /public/data/fragrances.json")
    // Return empty array if dataset not found
    return []
  }
}

// Initialize dataset on module load (for server-side)
export function initializeDataset(data: Fragrance[]) {
  fragranceDataset = data
}

// Get all fragrances
export function getAllFragrances(): Fragrance[] {
  return fragranceDataset
}

// Search fragrances by name, brand, or notes
export async function searchFragrances(
  query: string,
  limit: number = 20,
  filters?: import("../filters/types").FragranceFilters
): Promise<Fragrance[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  // Ensure dataset is loaded
  if (fragranceDataset.length === 0) {
    console.warn("Dataset not loaded yet. Call loadDataset() first.")
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  const results: Fragrance[] = []
  const searchTermWords = searchTerm.split(/\s+/).filter(w => w.length > 0)

  // Early exit for very short queries
  if (searchTerm.length < 2) {
    return []
  }

  // Limit dataset size for performance (process max 5000 items)
  const datasetToSearch = fragranceDataset.slice(0, 5000)
  
  for (const fragrance of datasetToSearch) {
    let score = 0

    // Get name (handle both converted and raw formats)
    const name = fragrance.name || (fragrance as any).Perfume || ""
    const nameLower = name.toLowerCase()
    
    // Get brand (handle both converted and raw formats)
    const brand = fragrance.brand || (fragrance as any).Brand || ""
    const brandLower = brand.toLowerCase()

    // Exact name match (highest priority) - check first for early exit
    if (nameLower.includes(searchTerm)) {
      score += 100
      // For exact matches, add immediately and continue
      results.push({ ...fragrance, _searchScore: score })
      if (results.length >= limit * 3) break // Early exit if we have enough high-score results
      continue
    }

    // Brand match
    if (brandLower.includes(searchTerm)) {
      score += 50
    }

    // Notes match - only check if we haven't found a high score match
    if (score < 100) {
      const allNotes = [
        ...(fragrance.top || []),
        ...(fragrance.middle || []),
        ...(fragrance.base || []),
      ]
      
      // Optimize: check if search term appears in any note
      let noteMatches = 0
      for (const note of allNotes) {
        if (note.toLowerCase().includes(searchTerm)) {
          noteMatches++
        }
      }
      if (noteMatches > 0) {
        score += noteMatches * 10
      }
    }

    // Description match - only if we have a description
    if (fragrance.description && score < 50) {
      if (fragrance.description.toLowerCase().includes(searchTerm)) {
        score += 5
      }
    }

    if (score > 0) {
      results.push({ ...fragrance, _searchScore: score })
    }
  }

  // Sort by score (only top candidates)
  const sortedResults = results
    .sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0))
    .slice(0, limit * 2) // Only keep top candidates before filtering
    .map(({ _searchScore, ...fragrance }) => fragrance)

  // Apply filters if provided (on smaller set)
  let filteredResults = sortedResults
  if (filters) {
    const { applyFilters } = await import("../filters/apply-filters")
    filteredResults = applyFilters(sortedResults, filters)
  }

  return filteredResults.slice(0, limit)
}

// Search fragrances by vibe (returns results with vibe match info)
export async function searchFragrancesByVibe(
  query: string,
  limit: number = 5,
  filters?: import("../filters/types").FragranceFilters
): Promise<Array<Fragrance & { _vibeExplanation?: string; _vibeSimilarity?: number }>> {
  if (!query || query.trim().length === 0) {
    return []
  }

  // Ensure dataset is loaded
  if (fragranceDataset.length === 0) {
    console.warn("Dataset not loaded yet. Call loadDataset() first.")
    return []
  }

  // Apply filters first if provided (on smaller subset for performance)
  let datasetToSearch = fragranceDataset
  if (filters) {
    const { applyFilters } = await import("../filters/apply-filters")
    // Limit dataset size for performance - filter on first 2000 items
    const limitedDataset = fragranceDataset.slice(0, 2000)
    datasetToSearch = applyFilters(limitedDataset, filters)
  } else {
    // Even without filters, limit dataset size for vibe search performance
    datasetToSearch = fragranceDataset.slice(0, 2000)
  }

  const { searchByVibe } = await import("../vibes/vibe-engine")
  const matches = searchByVibe(datasetToSearch, query, limit)

  return matches.map((match) => ({
    ...match.fragrance,
    _vibeExplanation: match.explanation,
    _vibeSimilarity: match.similarity,
  }))
}

// Get fragrance by exact name and brand
export function getFragranceByName(name: string, brand?: string): Fragrance | null {
  return (
    fragranceDataset.find(
      (f) =>
        f.name.toLowerCase() === name.toLowerCase() &&
        (!brand || f.brand?.toLowerCase() === brand.toLowerCase())
    ) || null
  )
}

// Get fragrances with images
export function getFragrancesWithImages(): Fragrance[] {
  return fragranceDataset.filter((f) => f.image)
}

// Get fragrances by brand
export function getFragrancesByBrand(brand: string, limit: number = 20): Fragrance[] {
  return fragranceDataset
    .filter((f) => f.brand?.toLowerCase().includes(brand.toLowerCase()))
    .slice(0, limit)
}

