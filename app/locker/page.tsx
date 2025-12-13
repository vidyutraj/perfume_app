"use client"

import { FragranceSearch } from "@/components/search/FragranceSearch"
import { VisualSearch } from "@/components/camera/VisualSearch"
import { CollectionDisplay } from "@/components/locker/CollectionDisplay"

export default function LockerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Your Perfume Locker</h1>
        <p className="text-muted-foreground mt-2">
          A visual collection of the fragrances you own.
        </p>
      </div>

      {/* Visual Search Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Scan Perfume Bottle</h2>
        <VisualSearch />
      </div>

      {/* Text Search Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Search by Name</h2>
        <FragranceSearch />
      </div>

      {/* Collection Display */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Collection</h2>
        <CollectionDisplay />
      </div>
    </div>
  )
}

