/**
 * VIBE ENGINE
 * Computes vibe scores for fragrances and matches them to user queries
 */

import { type Fragrance } from "@/lib/data/types"
import { VIBE_TAXONOMY, CONTEXT_MAPPINGS, type VibeType } from "./vibe-taxonomy"

export interface VibeScore {
  vibe: VibeType
  score: number // 0-1 normalized score
}

export interface VibeMatch {
  fragrance: Fragrance
  similarity: number // 0-1 similarity score
  explanation: string
  vibeScores: VibeScore[]
}

/**
 * Pre-computed note-to-vibe mapping for faster lookups
 */
const NOTE_TO_VIBES_MAP = new Map<string, Array<{ vibe: VibeType; weight: number }>>()

// Build the mapping once
function buildNoteToVibesMap() {
  if (NOTE_TO_VIBES_MAP.size > 0) return // Already built

  for (const [vibeType, mapping] of Object.entries(VIBE_TAXONOMY)) {
    const vibe = vibeType as VibeType
    for (const note of mapping.notes) {
      const noteLower = note.toLowerCase()
      if (!NOTE_TO_VIBES_MAP.has(noteLower)) {
        NOTE_TO_VIBES_MAP.set(noteLower, [])
      }
      NOTE_TO_VIBES_MAP.get(noteLower)!.push({ vibe, weight: mapping.weight })
    }
  }
}

// Build on first import
buildNoteToVibesMap()

/**
 * Compute normalized vibe scores for a fragrance based on its notes and accords (optimized)
 */
export function computeVibeScores(fragrance: Fragrance): VibeScore[] {
  const vibeWeights: Record<VibeType, number> = {} as Record<VibeType, number>

  // Initialize all vibes to 0
  Object.keys(VIBE_TAXONOMY).forEach((vibe) => {
    vibeWeights[vibe as VibeType] = 0
  })

  // Collect all notes (optimized)
  const allNotes = [
    ...(fragrance.top || []),
    ...(fragrance.middle || []),
    ...(fragrance.base || []),
  ]
    .filter((n) => n && typeof n === "string")
    .map((n) => n.toLowerCase())

  // Match notes to vibes using pre-computed map (much faster)
  for (const note of allNotes) {
    // Check exact matches first
    const exactMatch = NOTE_TO_VIBES_MAP.get(note)
    if (exactMatch) {
      for (const { vibe, weight } of exactMatch) {
        vibeWeights[vibe] += weight
      }
    } else {
      // Fallback to substring matching (slower, but less common)
      for (const [vibeType, mapping] of Object.entries(VIBE_TAXONOMY)) {
        const vibe = vibeType as VibeType
        for (const vibeNote of mapping.notes) {
          const vibeNoteLower = vibeNote.toLowerCase()
          if (note.includes(vibeNoteLower) || vibeNoteLower.includes(note)) {
            vibeWeights[vibe] += mapping.weight * 0.5 // Lower weight for partial matches
          }
        }
      }
    }
  }

  // Check accord matches (optimized)
  if (fragrance.accords) {
    const accordNames = Object.keys(fragrance.accords).map((a) => a.toLowerCase())
    
    for (const [vibeType, mapping] of Object.entries(VIBE_TAXONOMY)) {
      const vibe = vibeType as VibeType
      for (const accordName of accordNames) {
        for (const vibeAccord of mapping.accords) {
          const vibeAccordLower = vibeAccord.toLowerCase()
          if (accordName.includes(vibeAccordLower) || vibeAccordLower.includes(accordName)) {
            const accordValue = fragrance.accords![Object.keys(fragrance.accords).find(k => k.toLowerCase() === accordName)!]
            const intensity = Math.min(accordValue / 100, 1)
            vibeWeights[vibe] += mapping.weight * intensity
          }
        }
      }
    }
  }

  // Normalize scores (0-1 range)
  const maxWeight = Math.max(...Object.values(vibeWeights), 1)
  const scores: VibeScore[] = Object.entries(vibeWeights)
    .map(([vibe, weight]) => ({
      vibe: vibe as VibeType,
      score: Math.min(weight / maxWeight, 1),
    }))
    .filter((v) => v.score > 0)
    .sort((a, b) => b.score - a.score)

  return scores
}

/**
 * Parse user query into vibe weights
 */
export function parseVibeQuery(query: string): Record<VibeType, number> {
  const queryLower = query.toLowerCase().trim()
  const words = queryLower.split(/\s+/)
  const vibeWeights: Record<VibeType, number> = {} as Record<VibeType, number>

  // Initialize all vibes to 0
  Object.keys(VIBE_TAXONOMY).forEach((vibe) => {
    vibeWeights[vibe as VibeType] = 0
  })

  // Check for direct vibe matches
  for (const [vibeType, mapping] of Object.entries(VIBE_TAXONOMY)) {
    const vibe = vibeType as VibeType
    if (queryLower.includes(vibe)) {
      vibeWeights[vibe] += 1.0
    }
  }

  // Check for context word mappings
  for (const [contextWord, vibes] of Object.entries(CONTEXT_MAPPINGS)) {
    if (queryLower.includes(contextWord)) {
      const weight = 0.8 / vibes.length // Distribute weight across mapped vibes
      for (const vibe of vibes) {
        vibeWeights[vibe] += weight
      }
    }
  }

  // Check for note mentions that imply vibes
  for (const [vibeType, mapping] of Object.entries(VIBE_TAXONOMY)) {
    const vibe = vibeType as VibeType
    for (const note of mapping.notes) {
      if (queryLower.includes(note)) {
        vibeWeights[vibe] += 0.5
      }
    }
  }

  // Normalize weights (sum to 1)
  const totalWeight = Object.values(vibeWeights).reduce((sum, w) => sum + w, 0)
  if (totalWeight > 0) {
    for (const vibe of Object.keys(vibeWeights) as VibeType[]) {
      vibeWeights[vibe] = vibeWeights[vibe] / totalWeight
    }
  }

  return vibeWeights
}


/**
 * Optimized similarity computation with pre-computed query magnitude
 */
function computeSimilarityOptimized(
  queryVibes: Record<VibeType, number>,
  fragranceScores: VibeScore[],
  queryMagnitudeSqrt: number
): number {
  // Convert fragrance scores to a vector
  const fragranceVector: Record<VibeType, number> = {} as Record<VibeType, number>
  let fragranceMagnitude = 0
  let dotProduct = 0

  for (const { vibe, score } of fragranceScores) {
    fragranceVector[vibe] = score
    fragranceMagnitude += score * score
    
    const q = queryVibes[vibe] || 0
    if (q > 0) {
      dotProduct += q * score
    }
  }

  // Cosine similarity
  const fragranceMagnitudeSqrt = Math.sqrt(fragranceMagnitude)
  if (fragranceMagnitudeSqrt === 0 || queryMagnitudeSqrt === 0) return 0
  return dotProduct / (queryMagnitudeSqrt * fragranceMagnitudeSqrt)
}

/**
 * Generate human-readable explanation for a vibe match
 */
function generateExplanation(
  queryVibes: Record<VibeType, number>,
  fragranceScores: VibeScore[],
  similarity: number
): string {
  // Get top query vibes
  const topQueryVibes = Object.entries(queryVibes)
    .filter(([_, weight]) => weight > 0.1)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([vibe]) => vibe as VibeType)

  // Get top fragrance vibes
  const topFragranceVibes = fragranceScores
    .filter((v) => v.score > 0.1)
    .slice(0, 3)
    .map((v) => v.vibe)

  // Find matching vibes
  const matchingVibes = topQueryVibes.filter((v) =>
    topFragranceVibes.includes(v)
  )

  if (matchingVibes.length > 0) {
    const vibeNames = matchingVibes
      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
      .join(", ")
    return `Matches your ${vibeNames} vibe${matchingVibes.length > 1 ? "s" : ""}`
  }

  if (similarity > 0.7) {
    return "Strong vibe match with complementary notes"
  } else if (similarity > 0.5) {
    return "Good vibe alignment with similar character"
  } else {
    return "Partial vibe match"
  }
}

// Cache for vibe scores to avoid recomputing
const vibeScoreCache = new Map<string, VibeScore[]>()

/**
 * Get cached or compute vibe scores for a fragrance
 */
function getVibeScores(fragrance: Fragrance): VibeScore[] {
  const cacheKey = `${fragrance.name}-${fragrance.brand || ""}`
  
  if (vibeScoreCache.has(cacheKey)) {
    return vibeScoreCache.get(cacheKey)!
  }
  
  const scores = computeVibeScores(fragrance)
  vibeScoreCache.set(cacheKey, scores)
  return scores
}

/**
 * Search fragrances by vibe query (optimized)
 */
export function searchByVibe(
  fragrances: Fragrance[],
  query: string,
  limit: number = 5
): VibeMatch[] {
  // Parse query into vibe weights
  const queryVibes = parseVibeQuery(query)

  // Check if query has any vibe content
  const hasVibeContent = Object.values(queryVibes).some((w) => w > 0)
  if (!hasVibeContent) {
    return []
  }

  // Pre-compute query magnitude for efficiency
  let queryMagnitude = 0
  for (const weight of Object.values(queryVibes)) {
    queryMagnitude += weight * weight
  }
  const queryMagnitudeSqrt = Math.sqrt(queryMagnitude)

  // Compute matches with early termination optimization
  const matches: VibeMatch[] = []
  const maxCandidates = Math.min(fragrances.length, limit * 15) // Check more candidates than needed

  for (let i = 0; i < Math.min(fragrances.length, maxCandidates); i++) {
    const fragrance = fragrances[i]
    const vibeScores = getVibeScores(fragrance)
    
    // Quick similarity check - skip if no matching vibes (fast path)
    let hasMatchingVibes = false
    for (const { vibe, score } of vibeScores) {
      if (score > 0 && queryVibes[vibe] > 0) {
        hasMatchingVibes = true
        break
      }
    }
    
    if (!hasMatchingVibes) continue

    const similarity = computeSimilarityOptimized(queryVibes, vibeScores, queryMagnitudeSqrt)

    if (similarity > 0.1) {
      matches.push({
        fragrance,
        similarity,
        explanation: generateExplanation(queryVibes, vibeScores, similarity),
        vibeScores: vibeScores.slice(0, 5), // Top 5 vibes
      })
      
      // Early termination if we have enough high-quality matches
      if (matches.length >= limit * 3 && matches[matches.length - 1].similarity < 0.3) {
        break
      }
    }
  }

  // Sort by similarity and return top results
  return matches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

/**
 * Check if a query is likely a vibe search (vs name search)
 */
export function isVibeQuery(query: string): boolean {
  const queryLower = query.toLowerCase().trim()
  
  // If it's a single word that's a known brand or common perfume name pattern, it's probably a name search
  const words = queryLower.split(/\s+/)
  
  // Vibe queries typically have:
  // - Multiple words
  // - Descriptive adjectives
  // - Context words (office, date, summer, etc.)
  // - Vibe words
  
  if (words.length === 1) {
    // Single word - check if it's a vibe word
    const isVibeWord = Object.keys(VIBE_TAXONOMY).some(vibe => vibe === queryLower) ||
                       Object.keys(CONTEXT_MAPPINGS).some(ctx => ctx === queryLower)
    return isVibeWord
  }

  // Multi-word queries are more likely to be vibe searches if they contain:
  // - Vibe words
  // - Context words
  // - Descriptive terms
  
  const hasVibeWord = Object.keys(VIBE_TAXONOMY).some(vibe => queryLower.includes(vibe))
  const hasContextWord = Object.keys(CONTEXT_MAPPINGS).some(ctx => queryLower.includes(ctx))
  const hasDescriptiveTerms = /(fresh|sweet|dark|woody|spicy|clean|warm|cool|light|strong|subtle|intense)/.test(queryLower)
  
  return hasVibeWord || hasContextWord || hasDescriptiveTerms || words.length >= 3
}
