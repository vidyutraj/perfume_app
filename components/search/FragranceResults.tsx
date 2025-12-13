"use client"

import { useState } from "react"
import { type Fragrance } from "@/lib/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, Check } from "lucide-react"
import { useLocker } from "@/lib/hooks/useLocker"

interface FragranceResultsProps {
  results: Fragrance[]
  query: string
}

function FragranceCard({ fragrance, index }: { fragrance: Fragrance; index: number }) {
  const [imageError, setImageError] = useState(false)
  const { addToLocker, isInLocker } = useLocker()
  const [justAdded, setJustAdded] = useState(false)
  const inLocker = isInLocker(fragrance)

  const handleAddToLocker = () => {
    const added = addToLocker(fragrance)
    if (added) {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      {fragrance.image && !imageError ? (
        <div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
          <img
            src={fragrance.image}
            alt={fragrance.name}
            className="w-full h-full object-contain p-4"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{fragrance.name}</CardTitle>
        {fragrance.brand && (
          <CardDescription>{fragrance.brand}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {fragrance.year && (
          <p className="text-sm text-muted-foreground">
            Year: {fragrance.year}
          </p>
        )}
        
        {fragrance.country && (
          <p className="text-sm text-muted-foreground">
            Country: {fragrance.country}
          </p>
        )}

        {fragrance.top && fragrance.top.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Top Notes:</p>
            <p className="text-sm">{fragrance.top.join(", ")}</p>
          </div>
        )}

        {fragrance.middle && fragrance.middle.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Middle Notes:</p>
            <p className="text-sm">{fragrance.middle.join(", ")}</p>
          </div>
        )}

        {fragrance.base && fragrance.base.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Base Notes:</p>
            <p className="text-sm">{fragrance.base.join(", ")}</p>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          {fragrance.sillage && (
            <div>
              <span className="text-muted-foreground">Sillage: </span>
              <span className="font-medium">{fragrance.sillage}</span>
            </div>
          )}
          {fragrance.longevity && (
            <div>
              <span className="text-muted-foreground">Longevity: </span>
              <span className="font-medium">{fragrance.longevity}</span>
            </div>
          )}
        </div>

        {fragrance.rating && (
          <p className="text-sm">
            <span className="text-muted-foreground">Rating: </span>
            <span className="font-medium">{fragrance.rating}/5</span>
          </p>
        )}

        {fragrance.accords && Object.keys(fragrance.accords).length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Accords:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(fragrance.accords)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([accord, value]) => (
                  <span
                    key={accord}
                    className="text-xs px-2 py-1 rounded-full bg-muted"
                  >
                    {accord} ({value}%)
                  </span>
                ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddToLocker}
          disabled={inLocker || justAdded}
          className="w-full"
          variant={inLocker || justAdded ? "secondary" : "default"}
        >
          {justAdded ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added!
            </>
          ) : inLocker ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              In Locker
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Locker
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function FragranceResults({ results, query }: FragranceResultsProps) {
  if (results.length === 0 && query.trim().length >= 2) {
    return (
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          No fragrances found for &quot;{query}&quot;
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try a different search term
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((fragrance, index) => (
          <FragranceCard key={fragrance.id || index} fragrance={fragrance} index={index} />
        ))}
      </div>
    </div>
  )
}

