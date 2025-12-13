"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocker } from "@/lib/hooks/useLocker"
import { Package, TrendingUp, Star, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const { collection } = useLocker()

  // Calculate stats
  const totalFragrances = collection.length
  const uniqueBrands = new Set(collection.map(f => f.brand).filter(Boolean)).size
  const ratedFragrances = collection.filter(f => f.rating)
  const avgRating = ratedFragrances.length > 0
    ? (ratedFragrances.reduce((sum, f) => sum + (f.rating || 0), 0) / ratedFragrances.length).toFixed(1)
    : null

  // Top notes analysis
  const topNotesCount: Record<string, number> = {}
  collection.forEach(f => {
    f.top?.forEach(note => {
      topNotesCount[note] = (topNotesCount[note] || 0) + 1
    })
  })
  const topNotes = Object.entries(topNotesCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Top brands
  const brandCount: Record<string, number> = {}
  collection.forEach(f => {
    if (f.brand) {
      brandCount[f.brand] = (brandCount[f.brand] || 0) + 1
    }
  })
  const topBrands = Object.entries(brandCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Accords analysis
  const accordCount: Record<string, number> = {}
  collection.forEach(f => {
    if (f.accords) {
      Object.keys(f.accords).forEach(accord => {
        accordCount[accord] = (accordCount[accord] || 0) + 1
      })
    }
  })
  const topAccords = Object.entries(accordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  if (totalFragrances === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Insights and analytics about your fragrance portfolio.
          </p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Your dashboard will show insights once you add fragrances to your locker
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Insights and analytics about your fragrance portfolio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Collection Stats */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <Package className="h-4 w-4 text-white" />
              </div>
              <CardTitle>Collection Stats</CardTitle>
            </div>
            <CardDescription>Overview of your perfume collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total fragrances:</span>
                <span className="text-lg font-semibold">{totalFragrances}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unique brands:</span>
                <span className="text-lg font-semibold">{uniqueBrands}</span>
              </div>
              {avgRating && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average rating:</span>
                  <span className="text-lg font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {avgRating}/5
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Notes */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <CardTitle>Top Notes</CardTitle>
            </div>
            <CardDescription>Most common notes in your collection</CardDescription>
          </CardHeader>
          <CardContent>
            {topNotes.length > 0 ? (
              <div className="space-y-2">
                {topNotes.map(([note, count]) => (
                  <div key={note} className="flex justify-between items-center">
                    <span className="text-sm">{note}</span>
                    <span className="text-sm font-medium text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Brands */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <CardTitle>Top Brands</CardTitle>
            </div>
            <CardDescription>Brands in your collection</CardDescription>
          </CardHeader>
          <CardContent>
            {topBrands.length > 0 ? (
              <div className="space-y-2">
                {topBrands.map(([brand, count]) => (
                  <div key={brand} className="flex justify-between items-center">
                    <span className="text-sm">{brand}</span>
                    <span className="text-sm font-medium text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No brand data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Accords */}
        {topAccords.length > 0 && (
          <Card className="border-2 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Accord Profile</CardTitle>
              <CardDescription>Most common accords in your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topAccords.map(([accord, count]) => (
                  <div
                    key={accord}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800"
                  >
                    <span className="text-sm font-medium">{accord}</span>
                    <span className="text-xs text-muted-foreground ml-2">({count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

