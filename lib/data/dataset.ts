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
export function searchFragrances(query: string, limit: number = 20): Fragrance[] {
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

  for (const fragrance of fragranceDataset) {
    let score = 0

    // Get name (handle both converted and raw formats)
    const name = fragrance.name || (fragrance as any).Perfume || ""
    
    // Get brand (handle both converted and raw formats)
    const brand = fragrance.brand || (fragrance as any).Brand || ""

    // Exact name match (highest priority)
    if (name.toLowerCase().includes(searchTerm)) {
      score += 100
    }

    // Brand match
    if (brand.toLowerCase().includes(searchTerm)) {
      score += 50
    }

    // Notes match
    const allNotes = [
      ...(fragrance.top || []),
      ...(fragrance.middle || []),
      ...(fragrance.base || []),
    ]
    const noteMatches = allNotes.filter((note) =>
      note.toLowerCase().includes(searchTerm)
    ).length
    if (noteMatches > 0) {
      score += noteMatches * 10
    }

    // Description match
    if (fragrance.description?.toLowerCase().includes(searchTerm)) {
      score += 5
    }

    if (score > 0) {
      results.push({ ...fragrance, _searchScore: score })
    }
  }

  // Sort by score and limit results
  return results
    .sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0))
    .slice(0, limit)
    .map(({ _searchScore, ...fragrance }) => fragrance)
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

