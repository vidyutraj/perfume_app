"use client"

import { CollectionDisplay } from "@/components/locker/CollectionDisplay"
import { Package, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLocker } from "@/lib/hooks/useLocker"

export default function Home() {
  const { collection } = useLocker()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Perfume Locker</h1>
          <p className="text-muted-foreground mt-2">
            Your personal fragrance collection
          </p>
        </div>
        <Link href="/discover">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Fragrance
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      {collection.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{collection.length}</p>
                <p className="text-sm text-muted-foreground">Total Fragrances</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(collection.map(f => f.brand).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Unique Brands</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {collection.filter(f => f.rating).length > 0 
                    ? (collection.filter(f => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) / collection.filter(f => f.rating).length).toFixed(1)
                    : "—"}
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Collection</h2>
          {collection.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {collection.length} item{collection.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <CollectionDisplay />
      </div>
    </div>
  )
}

