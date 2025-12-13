import { type Perfume, type Season, type Vibe } from "@/lib/types/perfume"

/**
 * Convert raw Kaggle dataset row to normalized Perfume object
 */
export function convertToPerfume(row: any): Perfume {
  // Parse notes
  const parseNotes = (notesStr: string | undefined): string[] => {
    if (!notesStr) return []
    if (Array.isArray(notesStr)) return notesStr.map(String)
    return notesStr
      .split(",")
      .map((n: string) => n.trim())
      .filter((n: string) => n.length > 0)
  }

  // Parse accords from mainaccord1-5
  const accords: { name: string; intensity: number }[] = []
  for (let i = 1; i <= 5; i++) {
    const accordKey = `mainaccord${i}`
    if (row[accordKey] && row[accordKey].trim()) {
      const intensity = 100 - (i - 1) * 20 // 100, 80, 60, 40, 20
      accords.push({
        name: row[accordKey].trim(),
        intensity,
      })
    }
  }

  // Parse rating (handle European format)
  const parseRating = (ratingStr: string | undefined): number | undefined => {
    if (!ratingStr) return undefined
    const normalized = String(ratingStr).replace(",", ".")
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? undefined : parsed
  }

  // Parse year
  const parseYear = (yearStr: string | undefined): number | undefined => {
    if (!yearStr) return undefined
    const cleaned = String(yearStr).replace(/\.0+$/, "").trim()
    const parsed = parseInt(cleaned)
    return isNaN(parsed) ? undefined : parsed
  }

  // Generate ID from URL or name
  const generateId = (): string => {
    if (row.url) {
      const urlParts = row.url.split("/")
      const lastPart = urlParts[urlParts.length - 1]
      return lastPart.replace(".html", "") || `${row.Brand}-${row.Perfume}`.toLowerCase().replace(/\s+/g, "-")
    }
    return `${row.Brand || "unknown"}-${row.Perfume || "unknown"}`.toLowerCase().replace(/\s+/g, "-")
  }

  return {
    id: generateId(),
    name: row.Perfume || row.name || "",
    brand: row.Brand || row.brand || "",
    year: parseYear(row.Year || row.year),
    country: row.Country || row.country,
    notes: {
      top: parseNotes(row.Top || row.top),
      middle: parseNotes(row.Middle || row.middle),
      base: parseNotes(row.Base || row.base),
    },
    accords,
    rating: parseRating(row["Rating Value"] || row.rating),
    imageUrl: row.url || row.image || row.imageUrl,
    gender: row.Gender || row.gender,
    perfumer1: row.Perfumer1,
    perfumer2: row.Perfumer2,
    ratingCount: parseYear(row["Rating Count"] || row.ratingCount),
  }
}

/**
 * Infer seasonality from perfume notes and accords
 */
export function inferSeasons(perfume: Perfume): Season[] {
  const seasons: Season[] = []
  const allNotes = [
    ...perfume.notes.top,
    ...perfume.notes.middle,
    ...perfume.notes.base,
  ].map((n) => n.toLowerCase())
  const accordNames = perfume.accords.map((a) => a.name.toLowerCase())

  // Spring indicators
  const springKeywords = ["floral", "green", "citrus", "fresh", "light", "jasmine", "rose", "lily"]
  if (springKeywords.some((kw) => allNotes.some((n) => n.includes(kw)) || accordNames.some((a) => a.includes(kw)))) {
    seasons.push("spring")
  }

  // Summer indicators
  const summerKeywords = ["aquatic", "fresh", "citrus", "light", "cool", "mint", "bergamot", "lemon"]
  if (summerKeywords.some((kw) => allNotes.some((n) => n.includes(kw)) || accordNames.some((a) => a.includes(kw)))) {
    seasons.push("summer")
  }

  // Fall indicators
  const fallKeywords = ["spicy", "warm", "woody", "amber", "cinnamon", "nutmeg", "vanilla", "patchouli"]
  if (fallKeywords.some((kw) => allNotes.some((n) => n.includes(kw)) || accordNames.some((a) => a.includes(kw)))) {
    seasons.push("fall")
  }

  // Winter indicators
  const winterKeywords = ["warm", "spicy", "oriental", "amber", "oud", "incense", "heavy", "rich"]
  if (winterKeywords.some((kw) => allNotes.some((n) => n.includes(kw)) || accordNames.some((a) => a.includes(kw)))) {
    seasons.push("winter")
  }

  // If no specific season, mark as all-season
  if (seasons.length === 0) {
    seasons.push("all-season")
  }

  return seasons
}

/**
 * Infer vibes from perfume notes and accords
 */
export function inferVibes(perfume: Perfume): Vibe[] {
  const vibes: Vibe[] = []
  const allNotes = [
    ...perfume.notes.top,
    ...perfume.notes.middle,
    ...perfume.notes.base,
  ].map((n) => n.toLowerCase())
  const accordNames = perfume.accords.map((a) => a.name.toLowerCase())

  // Fresh
  if (allNotes.some((n) => n.includes("citrus") || n.includes("fresh") || n.includes("mint")) ||
      accordNames.some((a) => a.includes("fresh") || a.includes("citrus"))) {
    vibes.push("fresh")
  }

  // Clean
  if (allNotes.some((n) => n.includes("clean") || n.includes("white") || n.includes("cotton")) ||
      accordNames.some((a) => a.includes("clean"))) {
    vibes.push("clean")
  }

  // Sweet
  if (allNotes.some((n) => n.includes("sweet") || n.includes("vanilla") || n.includes("honey") || n.includes("sugar")) ||
      accordNames.some((a) => a.includes("sweet") || a.includes("gourmand"))) {
    vibes.push("sweet")
  }

  // Dark
  if (allNotes.some((n) => n.includes("dark") || n.includes("oud") || n.includes("leather") || n.includes("smoke")) ||
      accordNames.some((a) => a.includes("dark") || a.includes("leather"))) {
    vibes.push("dark")
  }

  // Warm
  if (allNotes.some((n) => n.includes("warm") || n.includes("amber") || n.includes("spice") || n.includes("cinnamon")) ||
      accordNames.some((a) => a.includes("warm") || a.includes("spicy"))) {
    vibes.push("warm")
  }

  // Cool
  if (allNotes.some((n) => n.includes("cool") || n.includes("mint") || n.includes("aquatic")) ||
      accordNames.some((a) => a.includes("cool") || a.includes("aquatic"))) {
    vibes.push("cool")
  }

  // Floral
  if (allNotes.some((n) => n.includes("rose") || n.includes("jasmine") || n.includes("lily") || n.includes("floral")) ||
      accordNames.some((a) => a.includes("floral"))) {
    vibes.push("floral")
  }

  // Woody
  if (allNotes.some((n) => n.includes("wood") || n.includes("cedar") || n.includes("sandalwood")) ||
      accordNames.some((a) => a.includes("woody"))) {
    vibes.push("woody")
  }

  // Spicy
  if (allNotes.some((n) => n.includes("spice") || n.includes("pepper") || n.includes("cinnamon") || n.includes("nutmeg")) ||
      accordNames.some((a) => a.includes("spicy"))) {
    vibes.push("spicy")
  }

  // Citrus
  if (allNotes.some((n) => n.includes("citrus") || n.includes("lemon") || n.includes("bergamot") || n.includes("orange")) ||
      accordNames.some((a) => a.includes("citrus"))) {
    vibes.push("citrus")
  }

  // Gourmand
  if (allNotes.some((n) => n.includes("gourmand") || n.includes("vanilla") || n.includes("chocolate") || n.includes("coffee")) ||
      accordNames.some((a) => a.includes("gourmand"))) {
    vibes.push("gourmand")
  }

  // Aquatic
  if (allNotes.some((n) => n.includes("aquatic") || n.includes("water") || n.includes("marine")) ||
      accordNames.some((a) => a.includes("aquatic"))) {
    vibes.push("aquatic")
  }

  // Oriental
  if (allNotes.some((n) => n.includes("oriental") || n.includes("amber") || n.includes("incense")) ||
      accordNames.some((a) => a.includes("oriental"))) {
    vibes.push("oriental")
  }

  // Green
  if (allNotes.some((n) => n.includes("green") || n.includes("grass") || n.includes("herb")) ||
      accordNames.some((a) => a.includes("green"))) {
    vibes.push("green")
  }

  // Powdery
  if (allNotes.some((n) => n.includes("powder") || n.includes("iris") || n.includes("violet")) ||
      accordNames.some((a) => a.includes("powdery"))) {
    vibes.push("powdery")
  }

  return vibes
}

