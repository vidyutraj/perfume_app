"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchFragrances } from "@/lib/data/dataset"
import { type Fragrance } from "@/lib/data/types"
import { FragranceResults } from "./FragranceResults"

export function FragranceSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Fragrance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Load dataset if needed, then search
      const { loadDataset } = await import("@/lib/data/dataset")
      await loadDataset()
      const results = searchFragrances(searchQuery.trim(), 20)
      setResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search fragrances")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search as user types
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(query)
      }, 300) // Wait 300ms after user stops typing
    } else {
      setResults([])
      setIsLoading(false)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, performSearch])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search and add fragrances to your locker..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {query.trim().length >= 2 && (
        <FragranceResults results={results} query={query} />
      )}
    </div>
  )
}

