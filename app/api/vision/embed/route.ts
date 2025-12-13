import { NextRequest, NextResponse } from "next/server"

// Hugging Face Inference API endpoint for CLIP
const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/clip-ViT-B-32"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert File to FormData for Hugging Face API
    const hfFormData = new FormData()
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })
    hfFormData.append("file", blob, file.name)

    // Call Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      body: hfFormData,
    })

    if (response.status === 503) {
      // Model is loading, return retry info
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

