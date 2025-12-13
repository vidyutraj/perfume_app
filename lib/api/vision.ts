// CLIP-based image comparison using Next.js API routes

// Get image embedding using CLIP via our API route
export async function getImageEmbedding(imageFile: File): Promise<number[]> {
  try {
    const formData = new FormData()
    formData.append("file", imageFile)

    const response = await fetch("/api/vision/embed", {
      method: "POST",
      body: formData,
    })

    if (response.status === 503) {
      // Model is loading, wait and retry
      const data = await response.json()
      const waitTime = parseInt(data.retryAfter || "10") * 1000
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      return getImageEmbedding(imageFile)
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Vision API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error("Unexpected response format from vision API")
    }

    return data.embedding
  } catch (error) {
    console.error("Error getting image embedding:", error)
    throw error
  }
}

// Get embedding for an image URL
export async function getImageEmbeddingFromUrl(imageUrl: string): Promise<number[]> {
  try {
    const response = await fetch("/api/vision/embed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (response.status === 503) {
      // Model is loading, wait and retry
      const data = await response.json()
      const waitTime = parseInt(data.retryAfter || "10") * 1000
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      return getImageEmbeddingFromUrl(imageUrl)
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Vision API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error("Unexpected response format from vision API")
    }

    return data.embedding
  } catch (error) {
    console.error("Error getting embedding from URL:", error)
    throw error
  }
}

// Calculate cosine similarity between two embeddings
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error("Embeddings must have the same length")
  }

  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    norm1 += embedding1[i] * embedding1[i]
    norm2 += embedding2[i] * embedding2[i]
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2)
  if (denominator === 0) return 0

  return dotProduct / denominator
}

// Find best matching fragrance by comparing images
export async function findMatchingFragrance(
  capturedImageFile: File,
  fragranceImages: Array<{ url: string; fragrance: any }>
): Promise<{ fragrance: any; similarity: number } | null> {
  try {
    // Get embedding for captured image
    const capturedEmbedding = await getImageEmbedding(capturedImageFile)

    // Compare with each fragrance image
    const comparisons = await Promise.all(
      fragranceImages.map(async ({ url, fragrance }) => {
        try {
          const fragranceEmbedding = await getImageEmbeddingFromUrl(url)
          const similarity = cosineSimilarity(capturedEmbedding, fragranceEmbedding)
          return { fragrance, similarity }
        } catch (error) {
          console.error(`Error comparing with ${fragrance.name}:`, error)
          return { fragrance, similarity: 0 }
        }
      })
    )

    // Sort by similarity and return best match
    comparisons.sort((a, b) => b.similarity - a.similarity)
    const bestMatch = comparisons[0]

    // Only return if similarity is above threshold (0.7 = 70% similar)
    if (bestMatch && bestMatch.similarity > 0.7) {
      return bestMatch
    }

    return null
  } catch (error) {
    console.error("Error finding matching fragrance:", error)
    throw error
  }
}

