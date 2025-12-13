// Fragrance data type matching the dataset structure
export interface Fragrance {
  id?: string
  name: string
  brand?: string
  year?: number
  country?: string
  top?: string[]
  middle?: string[]
  base?: string[]
  accords?: Record<string, number>
  sillage?: string
  longevity?: string
  rating?: number
  price?: number
  image?: string
  description?: string
  gender?: string
  oilType?: string
  // Internal search score (not part of actual data)
  _searchScore?: number
}

export interface FragranceSearchResponse {
  fragrances: Fragrance[]
  total?: number
}

