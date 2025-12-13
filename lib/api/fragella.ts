const API_BASE_URL = process.env.NEXT_PUBLIC_FRAGELLA_API_BASE_URL || 'https://api.fragella.com/api/v1'
const API_KEY = process.env.NEXT_PUBLIC_FRAGELLA_API_KEY || 'e5590c3bd769b2394387aa30e4a32e45e775a79cd8cfd451dd9a9f63226f2ec4'

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
}

export interface FragranceSearchResponse {
  fragrances: Fragrance[]
  total?: number
}

// API response type (what we actually get from the API)
interface ApiFragranceResponse {
  Name: string
  Brand?: string
  Year?: string | number
  Country?: string
  "Image URL"?: string
  Longevity?: string
  Sillage?: string
  rating?: string | number
  Price?: string | number
  Notes?: {
    Top?: Array<{ name: string; imageUrl?: string }>
    Middle?: Array<{ name: string; imageUrl?: string }>
    Base?: Array<{ name: string; imageUrl?: string }>
  }
  "Main Accords Percentage"?: Record<string, string>
  [key: string]: any
}

function transformApiResponse(apiFragrance: ApiFragranceResponse): Fragrance {
  return {
    name: apiFragrance.Name || '',
    brand: apiFragrance.Brand,
    year: typeof apiFragrance.Year === 'string' ? parseInt(apiFragrance.Year) : apiFragrance.Year,
    country: apiFragrance.Country,
    image: apiFragrance["Image URL"],
    longevity: apiFragrance.Longevity,
    sillage: apiFragrance.Sillage,
    rating: typeof apiFragrance.rating === 'string' ? parseFloat(apiFragrance.rating) : apiFragrance.rating,
    price: typeof apiFragrance.Price === 'string' ? parseFloat(apiFragrance.Price) : apiFragrance.Price,
    top: apiFragrance.Notes?.Top?.map(note => note.name),
    middle: apiFragrance.Notes?.Middle?.map(note => note.name),
    base: apiFragrance.Notes?.Base?.map(note => note.name),
    accords: apiFragrance["Main Accords Percentage"] ? 
      Object.fromEntries(
        Object.entries(apiFragrance["Main Accords Percentage"]).map(([key, value]) => {
          // Convert "Dominant", "Prominent", "Moderate" to numbers
          const accordValue = value === "Dominant" ? 100 : value === "Prominent" ? 75 : value === "Moderate" ? 50 : 25
          return [key, accordValue]
        })
      ) : undefined,
  }
}

export async function searchFragrances(query: string, limit: number = 10): Promise<FragranceSearchResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/fragrances?search=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: ApiFragranceResponse[] = await response.json()
    
    // Transform API response to our format
    const fragrances = Array.isArray(data) 
      ? data.map(transformApiResponse)
      : []
    
    return {
      fragrances,
      total: fragrances.length
    }
  } catch (error) {
    console.error('Error searching fragrances:', error)
    throw error
  }
}

export async function getSimilarFragrances(name: string, limit: number = 5): Promise<FragranceSearchResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/fragrances/similar?name=${encodeURIComponent(name)}&limit=${limit}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: ApiFragranceResponse[] = await response.json()
    
    // Transform API response to our format
    const fragrances = Array.isArray(data) 
      ? data.map(transformApiResponse)
      : []
    
    return {
      fragrances,
      total: fragrances.length
    }
  } catch (error) {
    console.error('Error getting similar fragrances:', error)
    throw error
  }
}

export async function matchFragrances(params: {
  accords?: Record<string, number>
  top?: string[]
  middle?: string[]
  base?: string[]
  limit?: number
}): Promise<FragranceSearchResponse> {
  try {
    const { accords, top, middle, base, limit = 10 } = params
    
    const queryParams = new URLSearchParams()
    if (accords) {
      const accordString = Object.entries(accords)
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
      queryParams.append('accords', accordString)
    }
    if (top) queryParams.append('top', top.join(','))
    if (middle) queryParams.append('middle', middle.join(','))
    if (base) queryParams.append('base', base.join(','))
    queryParams.append('limit', limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/fragrances/match?${queryParams.toString()}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: ApiFragranceResponse[] = await response.json()
    
    // Transform API response to our format
    const fragrances = Array.isArray(data) 
      ? data.map(transformApiResponse)
      : []
    
    return {
      fragrances,
      total: fragrances.length
    }
  } catch (error) {
    console.error('Error matching fragrances:', error)
    throw error
  }
}

