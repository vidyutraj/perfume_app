"use client"

import { useState } from "react"
import { Camera, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CameraCapture } from "./CameraCapture"
import { searchFragrances, loadDataset, getFragrancesWithImages } from "@/lib/data/dataset"
import { type Fragrance } from "@/lib/data/types"
import { findMatchingFragrance } from "@/lib/api/vision"
import { useLocker } from "@/lib/hooks/useLocker"

export function VisualSearch() {
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [matchedFragrance, setMatchedFragrance] = useState<Fragrance | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)
  const { addToLocker, isInLocker } = useLocker()

  const handleCapture = async (imageFile: File) => {
    setShowCamera(false)
    setIsProcessing(true)
    setError(null)
    setMatchedFragrance(null)
    setSimilarity(null)

    try {
      // Load dataset first
      await loadDataset()
      
      // Get all fragrances with images from the dataset
      const fragrancesWithImages = getFragrancesWithImages()
        .map((f) => ({ url: f.image!, fragrance: f }))

      if (fragrancesWithImages.length === 0) {
        throw new Error("No fragrances with images found to compare. Please try again.")
      }

      // Find best match
      const match = await findMatchingFragrance(imageFile, fragrancesWithImages)

      if (match) {
        setMatchedFragrance(match.fragrance)
        setSimilarity(match.similarity)
        
        // Auto-add to locker if not already there
        if (!isInLocker(match.fragrance)) {
          addToLocker(match.fragrance)
        }
      } else {
        setError("No matching fragrance found. Try taking a clearer photo or ensure the perfume bottle is visible.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recognize fragrance")
      console.error("Visual search error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddToLocker = () => {
    if (matchedFragrance) {
      addToLocker(matchedFragrance)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Visual Search</CardTitle>
          <CardDescription>
            Take a photo of a perfume bottle to automatically identify and add it to your locker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCamera && !isProcessing && !matchedFragrance && (
            <Button onClick={() => setShowCamera(true)} className="w-full" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Open Camera
            </Button>
          )}

          {showCamera && (
            <CameraCapture
              onCapture={handleCapture}
              onClose={() => setShowCamera(false)}
            />
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-center">
                Analyzing image and searching for matches...
              </p>
              <p className="text-xs text-muted-foreground text-center">
                This may take 10-30 seconds on first use while the AI model loads
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {matchedFragrance && (
            <Card className="border-green-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>Match Found!</CardTitle>
                </div>
                {similarity && (
                  <CardDescription>
                    Confidence: {(similarity * 100).toFixed(1)}%
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {matchedFragrance.image && (
                    <img
                      src={matchedFragrance.image}
                      alt={matchedFragrance.name}
                      className="w-24 h-24 object-contain rounded-lg border"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{matchedFragrance.name}</h3>
                    {matchedFragrance.brand && (
                      <p className="text-muted-foreground">{matchedFragrance.brand}</p>
                    )}
                  </div>
                </div>
                
                {isInLocker(matchedFragrance) ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Already in your locker</span>
                  </div>
                ) : (
                  <Button onClick={handleAddToLocker} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Add to Locker
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setMatchedFragrance(null)
                    setError(null)
                    setSimilarity(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Search Again
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

