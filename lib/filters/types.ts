/**
 * Filter types for fragrance search
 */

export interface FragranceFilters {
  // Basic filters
  priceRange: {
    min: number
    max: number
  }
  brands: string[]
  accords: string[]
  wearContext: ("day" | "night" | "office" | "date")[]
  minRating: number
  // Advanced filters
  concentration: ("EDT" | "EDP" | "Parfum")[]
  notesInclude: string[]
  notesExclude: string[]
  houseType: ("Designer" | "Niche" | "Indie")[]
  brandOrigin: string[]
  yearRange: {
    min: number
    max: number
  }
  minReviewCount?: number
}

export function getDefaultFilters(): FragranceFilters {
  return {
    priceRange: {
      min: 0,
      max: 10000,
    },
    brands: [],
    accords: [],
    wearContext: [],
    minRating: 0,
    concentration: [],
    notesInclude: [],
    notesExclude: [],
    houseType: [],
    brandOrigin: [],
    yearRange: {
      min: 0,
      max: new Date().getFullYear(),
    },
    minReviewCount: undefined,
  }
}

export const DEFAULT_FILTERS: FragranceFilters = getDefaultFilters()

/**
 * Count active filters
 */
export function countActiveFilters(filters: FragranceFilters): number {
  let count = 0
  if (filters.brands.length > 0) count++
  if (filters.accords.length > 0) count++
  if (filters.wearContext.length > 0) count++
  if (filters.minRating > 0) count++
  if (filters.priceRange.min > DEFAULT_FILTERS.priceRange.min) count++
  if (filters.priceRange.max < DEFAULT_FILTERS.priceRange.max) count++
  if (filters.concentration.length > 0) count++
  if (filters.notesInclude.length > 0) count++
  if (filters.notesExclude.length > 0) count++
  if (filters.houseType.length > 0) count++
  if (filters.brandOrigin.length > 0) count++
  if (filters.yearRange.min > DEFAULT_FILTERS.yearRange.min) count++
  if (filters.yearRange.max < DEFAULT_FILTERS.yearRange.max) count++
  if (filters.minReviewCount !== undefined && filters.minReviewCount > 0) count++
  return count
}
