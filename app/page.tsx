"use client"

import { FragranceSearch } from "@/components/search/FragranceSearch"
import { VisualSearch } from "@/components/camera/VisualSearch"
import { Sparkles, Search, Camera } from "lucide-react"
import { useLocker } from "@/lib/hooks/useLocker"

export default function Home() {
  const { collection } = useLocker()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Discover Your Signature Scent
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Perfume Locker
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Build your personal fragrance collection. Discover, organize, and explore the world of perfumes.
        </p>
        {collection.length > 0 && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              You have <span className="font-semibold text-foreground">{collection.length}</span> fragrance{collection.length !== 1 ? "s" : ""} in your locker
            </p>
          </div>
        )}
      </div>

      {/* Search Options */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Visual Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Visual Search</h2>
              <p className="text-sm text-muted-foreground">Scan a perfume bottle with your camera</p>
            </div>
          </div>
          <VisualSearch />
        </div>

        {/* Text Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Search by Name</h2>
              <p className="text-sm text-muted-foreground">Find fragrances in our database</p>
            </div>
          </div>
          <FragranceSearch />
        </div>
      </div>
    </div>
  )
}

