// Utility to convert Kaggle dataset (CSV/JSON) to our format
// This file helps transform your Kaggle dataset into the expected format

import { type Fragrance } from "./types"

/**
 * Convert CSV row or JSON object from Kaggle dataset to Fragrance format
 * Mapped to your specific CSV headers:
 * url, Perfume, Brand, Country, Gender, Rating Value, Rating Count, Year, 
 * Top, Middle, Base, Perfumer1, Perfumer2, mainaccord1-5
 */
export function convertKaggleRowToFragrance(row: any): Fragrance {
  // Build accords from mainaccord1-5 fields
  const accords: Record<string, number> = {}
  for (let i = 1; i <= 5; i++) {
    const accordKey = `mainaccord${i}`
    if (row[accordKey] && row[accordKey].trim()) {
      // Assign a default value (you can adjust this based on your data)
      accords[row[accordKey].trim()] = 100 - (i - 1) * 20 // 100, 80, 60, 40, 20
    }
  }

  return {
    id: row.url ? new URL(row.url).pathname.split('/').pop()?.replace(/\.[^/.]+$/, "") : 
        row.Perfume?.toLowerCase().replace(/\s+/g, "-"),
    name: row.Perfume || row.name || row.Name || row.fragrance_name || "",
    brand: row.Brand || row.brand || row.brand_name,
    year: parseYear(row.Year || row.year),
    country: row.Country || row.country,
    top: parseNotes(row.Top || row.top || row.top_notes || row.topNotes),
    middle: parseNotes(row.Middle || row.middle || row.middle_notes || row.middleNotes),
    base: parseNotes(row.Base || row.base || row.base_notes || row.baseNotes),
    rating: parseRating(row["Rating Value"] || row.rating || row.Rating || row.user_rating),
    image: row.url || row.image || row.Image || row.image_url || row.imageUrl || row["Image URL"],
    description: row.description || row.Description,
    gender: row.Gender || row.gender,
    accords: Object.keys(accords).length > 0 ? accords : undefined,
    // Store additional fields that might be useful
    // ratingCount: parseYear(row["Rating Count"] || row.rating_count),
    // perfumer1: row.Perfumer1,
    // perfumer2: row.Perfumer2,
  }
}

function parseYear(year: any): number | undefined {
  if (typeof year === "number") return Math.floor(year)
  if (typeof year === "string") {
    // Handle "2024.0" format by removing decimal part
    const cleaned = year.replace(/\.0+$/, "").trim()
    const parsed = parseInt(cleaned)
    return isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function parseNotes(notes: any): string[] | undefined {
  if (Array.isArray(notes)) {
    return notes.map((n) => String(n))
  }
  if (typeof notes === "string") {
    // Handle comma-separated strings
    return notes.split(",").map((n) => n.trim()).filter((n) => n.length > 0)
  }
  return undefined
}

function parseRating(rating: any): number | undefined {
  if (typeof rating === "number") return rating
  if (typeof rating === "string") {
    // Handle European decimal format (comma instead of period)
    const normalized = rating.replace(',', '.')
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function parsePrice(price: any): number | undefined {
  if (typeof price === "number") return price
  if (typeof price === "string") {
    // Remove currency symbols and parse
    const cleaned = price.replace(/[^0-9.]/g, "")
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function parseAccords(accords: any): Record<string, number> | undefined {
  if (!accords) return undefined

  // If it's already an object with numbers
  if (typeof accords === "object" && !Array.isArray(accords)) {
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(accords)) {
      if (typeof value === "number") {
        result[key] = value
      } else if (typeof value === "string") {
        // Convert "Dominant", "Prominent", "Moderate" to numbers
        const numValue =
          value === "Dominant" ? 100 :
          value === "Prominent" ? 75 :
          value === "Moderate" ? 50 : 25
        result[key] = numValue
      }
    }
    return Object.keys(result).length > 0 ? result : undefined
  }

  return undefined
}

/**
 * Load and convert Kaggle dataset
 * Place your dataset file in /public/data/fragrances.json or /data/fragrances.json
 */
export async function loadKaggleDataset(): Promise<Fragrance[]> {
  try {
    // Try loading from public directory (client-side)
    const response = await fetch("/data/fragrances.json")
    if (!response.ok) {
      throw new Error("Dataset not found in /public/data/fragrances.json")
    }
    const data = await response.json()
    
    // If data is an array, convert each item
    if (Array.isArray(data)) {
      return data.map(convertKaggleRowToFragrance)
    }
    
    // If data is an object with a fragrances array
    if (data.fragrances && Array.isArray(data.fragrances)) {
      return data.fragrances.map(convertKaggleRowToFragrance)
    }

    throw new Error("Invalid dataset format")
  } catch (error) {
    console.error("Error loading Kaggle dataset:", error)
    return []
  }
}

