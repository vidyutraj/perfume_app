"use client"

import { useState } from "react"
import { type Fragrance } from "@/lib/data/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, X, Star } from "lucide-react"
import { useLocker } from "@/lib/hooks/useLocker"
import Link from "next/link"

function CollectionCard({ fragrance }: { fragrance: Fragrance }) {
  const [imageError, setImageError] = useState(false)
  const { removeFromLocker } = useLocker()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 animate-fade-in overflow-hidden">
      <div className="relative overflow-hidden">
        {fragrance.image && !imageError ? (
          <div className="relative w-full h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            <img
              src={fragrance.image}
              alt={fragrance.name}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        {fragrance.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm border">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{fragrance.rating}</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{fragrance.name}</CardTitle>
        {fragrance.brand && (
          <CardDescription className="line-clamp-1">{fragrance.brand}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        {fragrance.year && (
          <p className="text-xs text-muted-foreground">
            {fragrance.year}
          </p>
        )}
        
        {fragrance.top && fragrance.top.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Top Notes</p>
            <p className="text-xs line-clamp-2 text-foreground/80">{fragrance.top.slice(0, 3).join(", ")}</p>
          </div>
        )}

        <div className="flex gap-3 text-xs pt-1">
          {fragrance.sillage && (
            <div className="px-2 py-1 rounded-md bg-muted/50">
              <span className="text-muted-foreground">Sillage: </span>
              <span className="font-medium">{fragrance.sillage}</span>
            </div>
          )}
          {fragrance.longevity && (
            <div className="px-2 py-1 rounded-md bg-muted/50">
              <span className="text-muted-foreground">Longevity: </span>
              <span className="font-medium">{fragrance.longevity}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => removeFromLocker(fragrance)}
          variant="outline"
          className="w-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-16 text-center bg-gradient-to-br from-muted/30 to-transparent">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Your locker is empty</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start building your collection by searching for fragrances or scanning a perfume bottle
        </p>
        <Link href="/discover">
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Discover Fragrances
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collection.map((fragrance, index) => (
        <CollectionCard 
          key={`${fragrance.name}-${fragrance.brand}-${index}`} 
          fragrance={fragrance} 
        />
      ))}
    </div>
  )
}

