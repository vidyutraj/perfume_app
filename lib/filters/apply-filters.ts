/**
 * Apply filters to fragrance results
 */

import { type Fragrance } from "@/lib/data/types"
import { type FragranceFilters } from "./types"

/**
 * Map wear context to vibe characteristics for filtering
 */
const WEAR_CONTEXT_VIBES: Record<string, string[]> = {
  day: ["fresh", "clean", "citrus", "light"],
  night: ["dark", "warm", "oriental", "woody"],
  office: ["clean", "fresh", "subtle", "professional"],
  date: ["sweet", "warm", "floral", "gourmand"],
}

/**
 * Check if a fragrance matches the wear context filter
 */
function matchesWearContext(
  fragrance: Fragrance,
  contexts: ("day" | "night" | "office" | "date")[]
): boolean {
  if (contexts.length === 0) return true

  // Get all notes from the fragrance
  const allNotes = [
    ...(fragrance.top || []),
    ...(fragrance.middle || []),
    ...(fragrance.base || []),
  ].map((n) => n.toLowerCase())

  // Get all accords
  const accordNames = fragrance.accords
    ? Object.keys(fragrance.accords).map((a) => a.toLowerCase())
    : []

  // Check if fragrance matches any of the requested contexts
  return contexts.some((context) => {
    const requiredVibes = WEAR_CONTEXT_VIBES[context] || []
    return requiredVibes.some((vibe) => {
      // Check if any note or accord matches the vibe
      return (
        allNotes.some((note) => note.includes(vibe)) ||
        accordNames.some((accord) => accord.includes(vibe))
      )
    })
  })
}

/**
 * Apply filters to a list of fragrances (optimized)
 */
export function applyFilters(
  fragrances: Fragrance[],
  filters: FragranceFilters
): Fragrance[] {
  // Early exit if no filters are active
  const hasActiveFilters = 
    filters.brands.length > 0 ||
    filters.accords.length > 0 ||
    filters.wearContext.length > 0 ||
    filters.minRating > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 10000 ||
    filters.concentration.length > 0 ||
    filters.notesInclude.length > 0 ||
    filters.notesExclude.length > 0 ||
    filters.houseType.length > 0 ||
    filters.brandOrigin.length > 0 ||
    (filters.yearRange.min > 0 || filters.yearRange.max < new Date().getFullYear()) ||
    (filters.minReviewCount !== undefined && filters.minReviewCount > 0)
  
  if (!hasActiveFilters) {
    return fragrances
  }

  // Pre-compute filter sets for faster lookups
  const brandSet = new Set(filters.brands)
  const accordSet = new Set(filters.accords.map(a => a.toLowerCase()))
  const concentrationSet = new Set(filters.concentration.map(c => c.toUpperCase()))
  const houseTypeSet = new Set(filters.houseType)
  const brandOriginSet = new Set(filters.brandOrigin)
  const notesIncludeSet = new Set(filters.notesInclude.map(n => n.toLowerCase()))
  const notesExcludeSet = new Set(filters.notesExclude.map(n => n.toLowerCase()))

  return fragrances.filter((fragrance) => {
    // Price filter
    if (fragrance.price !== undefined) {
      if (
        fragrance.price < filters.priceRange.min ||
        fragrance.price > filters.priceRange.max
      ) {
        return false
      }
    }

    // Brand filter (optimized with Set lookup)
    if (filters.brands.length > 0) {
      if (!fragrance.brand || !brandSet.has(fragrance.brand)) {
        return false
      }
    }

    // Accord filter (optimized)
    if (filters.accords.length > 0) {
      if (!fragrance.accords) return false
      const fragranceAccords = Object.keys(fragrance.accords).map((a) =>
        a.toLowerCase()
      )
      const hasMatchingAccord = fragranceAccords.some((fragAccord) =>
        Array.from(accordSet).some((filterAccord) =>
          fragAccord.includes(filterAccord) || filterAccord.includes(fragAccord)
        )
      )
      if (!hasMatchingAccord) return false
    }

    // Wear context filter
    if (filters.wearContext.length > 0) {
      if (!matchesWearContext(fragrance, filters.wearContext)) {
        return false
      }
    }

    // Minimum rating filter
    if (filters.minRating > 0) {
      if (!fragrance.rating || fragrance.rating < filters.minRating) {
        return false
      }
    }

    // Concentration filter (optimized)
    if (filters.concentration.length > 0) {
      // Check oilType field for concentration info
      if (!fragrance.oilType) return false
      const oilTypeUpper = fragrance.oilType.toUpperCase()
      const hasMatchingConcentration = Array.from(concentrationSet).some((conc) =>
        oilTypeUpper.includes(conc)
      )
      if (!hasMatchingConcentration) return false
    }

    // Notes Include (AND logic - must have all) (optimized)
    if (filters.notesInclude.length > 0) {
      const allNotes = [
        ...(fragrance.top || []),
        ...(fragrance.middle || []),
        ...(fragrance.base || []),
      ].map((n) => n && typeof n === "string" ? n.toLowerCase() : "")
        .filter(n => n.length > 0)
      
      const allIncluded = Array.from(notesIncludeSet).every((requiredNote) =>
        allNotes.some((note) =>
          note.includes(requiredNote) || requiredNote.includes(note)
        )
      )
      if (!allIncluded) return false
    }

    // Notes Exclude (hard filter) (optimized)
    if (filters.notesExclude.length > 0) {
      const allNotes = [
        ...(fragrance.top || []),
        ...(fragrance.middle || []),
        ...(fragrance.base || []),
      ].map((n) => n && typeof n === "string" ? n.toLowerCase() : "")
        .filter(n => n.length > 0)
      
      const hasExcludedNote = allNotes.some((note) =>
        Array.from(notesExcludeSet).some((excludedNote) =>
          note.includes(excludedNote) || excludedNote.includes(note)
        )
      )
      if (hasExcludedNote) return false
    }

    // House type filter (heuristic based on brand characteristics)
    if (filters.houseType.length > 0) {
      // This is a simplified heuristic - in a real app, you'd have house type data
      // For now, we'll skip this filter as we don't have reliable house type data
      // You could extend this later with a brand-to-house-type mapping
    }

    // Brand origin filter (optimized with Set lookup)
    if (filters.brandOrigin.length > 0) {
      if (!fragrance.country) return false
      if (!brandOriginSet.has(fragrance.country)) return false
    }

    // Year range filter
    if (fragrance.year !== undefined) {
      if (
        fragrance.year < filters.yearRange.min ||
        fragrance.year > filters.yearRange.max
      ) {
        return false
      }
    }

    // Minimum review count (if ratingCount exists)
    if (filters.minReviewCount !== undefined && filters.minReviewCount > 0) {
      // Assuming ratingCount might be in the data - check if it exists
      const ratingCount = (fragrance as any).ratingCount
      if (ratingCount === undefined || ratingCount < filters.minReviewCount) {
        return false
      }
    }

    return true
  })
}
