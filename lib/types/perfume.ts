/**
 * Normalized Perfume type for the application
 */
export interface Perfume {
  id: string
  name: string
  brand: string
  year?: number
  country?: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  accords: { name: string; intensity: number }[]
  rating?: number
  imageUrl?: string
  gender?: string
  perfumer1?: string
  perfumer2?: string
  ratingCount?: number
}

/**
 * User's personal notes for a perfume in their locker
 */
export interface PerfumePersonalNotes {
  perfumeId: string
  notes: string
  dateAdded: string
  rating?: number
}

/**
 * Seasonality mapping
 */
export type Season = "spring" | "summer" | "fall" | "winter" | "all-season"

/**
 * Vibe categories
 */
export type Vibe =
  | "fresh"
  | "clean"
  | "sweet"
  | "dark"
  | "warm"
  | "cool"
  | "floral"
  | "woody"
  | "spicy"
  | "citrus"
  | "gourmand"
  | "aquatic"
  | "oriental"
  | "green"
  | "powdery"

export interface PerfumeWithMetadata extends Perfume {
  seasons: Season[]
  vibes: Vibe[]
  personalNotes?: PerfumePersonalNotes
}

