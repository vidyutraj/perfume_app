"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Search, Loader2, Sparkles, Sliders } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchFragrances, searchFragrancesByVibe } from "@/lib/data/dataset"
import { type Fragrance } from "@/lib/data/types"
import { FragranceResults } from "./FragranceResults"
import { FilterPanel } from "./FilterPanel"
import { type FragranceFilters, DEFAULT_FILTERS, countActiveFilters } from "@/lib/filters/types"
import { cn } from "@/lib/utils"

type SearchMode = "name" | "vibe"

interface FragranceSearchProps {
  filters?: FragranceFilters
  onFiltersChange?: (filters: FragranceFilters) => void
}

export function FragranceSearch({ filters, onFiltersChange }: FragranceSearchProps = {} as FragranceSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Fragrance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<SearchMode>("name")
  const [filterOpen, setFilterOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FragranceFilters>(
    filters || DEFAULT_FILTERS
  )
  const [isFiltering, setIsFiltering] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Sync with external filters if provided
  useEffect(() => {
    if (filters) {
      setLocalFilters(filters)
    }
  }, [filters])

  const performSearch = useCallback(async (searchQuery: string, mode: SearchMode) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    // Cancel previous search if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      // Load dataset if needed
      const { loadDataset } = await import("@/lib/data/dataset")
      await loadDataset()

      // Check if aborted
      if (abortControllerRef.current?.signal.aborted) return

      let searchResults: Fragrance[] = []

      // Use active filters
      const activeFilters = localFilters

      // Use requestIdleCallback or setTimeout to yield to browser
      await new Promise((resolve) => setTimeout(resolve, 0))

      if (abortControllerRef.current?.signal.aborted) return

      if (mode === "vibe") {
        // Use vibe search (filters are applied inside the function)
        searchResults = await searchFragrancesByVibe(
          searchQuery.trim(),
          5,
          activeFilters
        )
      } else {
        // Use traditional name/brand/note search
        searchResults = await searchFragrances(
          searchQuery.trim(),
          20,
          activeFilters
        )
      }

      // Check if aborted before setting results
      if (abortControllerRef.current?.signal.aborted) return

      setResults(searchResults)
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return // Ignore abort errors
      }
      setError(err instanceof Error ? err.message : "Failed to search fragrances")
      setResults([])
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [localFilters])

  // Debounced search as user types
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Cancel any in-flight search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(query, searchMode)
      }, 400) // Increased debounce for better performance
    } else {
      setResults([])
      setIsLoading(false)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, searchMode, localFilters, performSearch])

  const handleFiltersChange = async (newFilters: FragranceFilters) => {
    setIsFiltering(true)
    setLocalFilters(newFilters)
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
    // Re-search with new filters
    if (query.trim().length >= 2) {
      await performSearch(query, searchMode)
    }
    // Small delay for smooth transition
    setTimeout(() => setIsFiltering(false), 200)
  }

  return (
    <div className="space-y-4">
      {/* Search Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-lg border bg-muted/30">
        <Button
          type="button"
          variant={searchMode === "name" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSearchMode("name")}
          className={cn(
            "flex-1 transition-all",
            searchMode === "name"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm"
              : "hover:bg-accent"
          )}
        >
          <Search className="mr-2 h-4 w-4" />
          Name Search
        </Button>
        <Button
          type="button"
          variant={searchMode === "vibe" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSearchMode("vibe")}
          className={cn(
            "flex-1 transition-all",
            searchMode === "vibe"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-sm"
              : "hover:bg-accent"
          )}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Vibe Search
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder={
              searchMode === "vibe"
                ? "Describe the vibe you want (e.g., 'fresh clean office' or 'dark smoky winter')..."
                : "Search by fragrance name, brand, or notes..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-primary/50 transition-colors"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary z-10" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setFilterOpen(true)}
          className={cn(
            "h-12 w-12 border-2 relative",
            countActiveFilters(localFilters) > 0
              ? "border-primary bg-primary/10"
              : ""
          )}
        >
          <Sliders className="h-4 w-4" />
          {countActiveFilters(localFilters) > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold border-2 border-background flex items-center justify-center">
              {countActiveFilters(localFilters) > 9 ? "9+" : countActiveFilters(localFilters)}
            </span>
          )}
        </Button>
      </div>

      {/* Search Mode Hint */}
      {searchMode === "vibe" && (
        <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-3">
          <p className="text-xs text-purple-700 dark:text-purple-300">
            <span className="font-semibold">💡 Tip:</span> Try describing the feeling you want, like "sweet gourmand date night" or "woody masculine everyday"
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {query.trim().length >= 2 && (
        <div className={cn("relative transition-opacity duration-200", isFiltering && "opacity-50")}>
          {isFiltering && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg animate-shimmer z-10 pointer-events-none" />
          )}
          <FragranceResults results={results} query={query} isVibeSearch={searchMode === "vibe"} />
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={localFilters}
        onFiltersChange={handleFiltersChange}
        onApply={() => {
          // Filters are already applied in handleFiltersChange
        }}
      />
    </div>
  )
}

