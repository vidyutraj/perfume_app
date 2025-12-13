"use client"

import { useState } from "react"
import { type Fragrance } from "@/lib/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, X } from "lucide-react"
import { useLocker } from "@/lib/hooks/useLocker"

function CollectionCard({ fragrance }: { fragrance: Fragrance }) {
  const [imageError, setImageError] = useState(false)
  const { removeFromLocker } = useLocker()

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
      <CardContent className="space-y-2">
        {fragrance.year && (
          <p className="text-sm text-muted-foreground">
            Year: {fragrance.year}
          </p>
        )}
        
        {fragrance.top && fragrance.top.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Top Notes:</p>
            <p className="text-sm line-clamp-2">{fragrance.top.slice(0, 3).join(", ")}</p>
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
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => removeFromLocker(fragrance)}
          variant="outline"
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CollectionDisplay() {
  const { collection } = useLocker()

  if (collection.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Your locker is empty
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Search and add fragrances to build your collection
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collection.map((fragrance, index) => (
        <CollectionCard key={`${fragrance.name}-${fragrance.brand}-${index}`} fragrance={fragrance} />
      ))}
    </div>
  )
}

