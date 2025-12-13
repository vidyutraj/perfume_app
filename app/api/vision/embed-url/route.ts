import { NextRequest, NextResponse } from "next/server"

// Hugging Face Inference API endpoint for CLIP
const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/clip-ViT-B-32"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 })
    }

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: 400 }
      )
    }

    const blob = await imageResponse.blob()

    // Convert to FormData for Hugging Face API
    const hfFormData = new FormData()
    hfFormData.append("file", blob, "image.jpg")

    // Call Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      body: hfFormData,
    })

    if (response.status === 503) {
      const retryAfter = response.headers.get("retry-after")
      return NextResponse.json(
        { error: "Model is loading", retryAfter: retryAfter || "10" },
        { status: 503 }
      )
    }

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `HF API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Handle different response formats
    let embedding: number[]
    if (Array.isArray(data)) {
      embedding = data
    } else if (data.embedding && Array.isArray(data.embedding)) {
      embedding = data.embedding
    } else {
      return NextResponse.json(
        { error: "Unexpected response format" },
        { status: 500 }
      )
    }

    return NextResponse.json({ embedding })
  } catch (error) {
    console.error("Vision API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

