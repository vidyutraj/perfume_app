"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { type FragranceFilters, DEFAULT_FILTERS, countActiveFilters } from "@/lib/filters/types"
import { type Fragrance } from "@/lib/data/types"
import { getAllFragrances } from "@/lib/data/dataset"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: FragranceFilters
  onFiltersChange: (filters: FragranceFilters) => void
  onApply: () => void
}

export function FilterPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onApply,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FragranceFilters>(filters)
  const [brandSearch, setBrandSearch] = useState("")
  const [accordSearch, setAccordSearch] = useState("")
  const [noteIncludeSearch, setNoteIncludeSearch] = useState("")
  const [noteExcludeSearch, setNoteExcludeSearch] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  // Get available data from dataset
  const { availableBrands, availableAccords, availableNotes, availableCountries, currentYear } = useMemo(() => {
    try {
      const allFragrances = getAllFragrances()
      const brands = new Set<string>()
      const accords = new Set<string>()
      const notes = new Set<string>()
      const countries = new Set<string>()

      allFragrances.forEach((f) => {
        if (f.brand) brands.add(f.brand)
        if (f.accords) {
          Object.keys(f.accords).forEach((accord) => accords.add(accord))
        }
        if (f.top) f.top.forEach((note) => notes.add(note))
        if (f.middle) f.middle.forEach((note) => notes.add(note))
        if (f.base) f.base.forEach((note) => notes.add(note))
        if (f.country) countries.add(f.country)
      })

      return {
        availableBrands: Array.from(brands).sort(),
        availableAccords: Array.from(accords).sort(),
        availableNotes: Array.from(notes).sort(),
        availableCountries: Array.from(countries).sort(),
        currentYear: new Date().getFullYear(),
      }
    } catch {
      return {
        availableBrands: [],
        availableAccords: [],
        availableNotes: [],
        availableCountries: [],
        currentYear: new Date().getFullYear(),
      }
    }
  }, [])

  // Sync local filters when filters prop changes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Initialize year range max to current year if not set
  useEffect(() => {
    if (localFilters.yearRange.max === 0) {
      setLocalFilters((prev) => ({
        ...prev,
        yearRange: { ...prev.yearRange, max: currentYear },
      }))
    }
  }, [currentYear])

  const handleReset = () => {
    const resetFilters = { ...DEFAULT_FILTERS, yearRange: { min: 0, max: currentYear } }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const handleApply = async () => {
    setIsApplying(true)
    // Small delay for loading shimmer effect
    await new Promise((resolve) => setTimeout(resolve, 300))
    onFiltersChange(localFilters)
    onApply()
    setIsApplying(false)
    onOpenChange(false)
  }

  const toggleBrand = (brand: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }))
  }

  const toggleAccord = (accord: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      accords: prev.accords.includes(accord)
        ? prev.accords.filter((a) => a !== accord)
        : [...prev.accords, accord],
    }))
  }

  const toggleWearContext = (context: "day" | "night" | "office" | "date") => {
    setLocalFilters((prev) => ({
      ...prev,
      wearContext: prev.wearContext.includes(context)
        ? prev.wearContext.filter((c) => c !== context)
        : [...prev.wearContext, context],
    }))
  }

  const toggleConcentration = (conc: "EDT" | "EDP" | "Parfum") => {
    setLocalFilters((prev) => ({
      ...prev,
      concentration: prev.concentration.includes(conc)
        ? prev.concentration.filter((c) => c !== conc)
        : [...prev.concentration, conc],
    }))
  }

  const toggleNoteInclude = (note: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      notesInclude: prev.notesInclude.includes(note)
        ? prev.notesInclude.filter((n) => n !== note)
        : [...prev.notesInclude, note],
    }))
  }

  const toggleNoteExclude = (note: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      notesExclude: prev.notesExclude.includes(note)
        ? prev.notesExclude.filter((n) => n !== note)
        : [...prev.notesExclude, note],
    }))
  }

  const toggleHouseType = (type: "Designer" | "Niche" | "Indie") => {
    setLocalFilters((prev) => ({
      ...prev,
      houseType: prev.houseType.includes(type)
        ? prev.houseType.filter((t) => t !== type)
        : [...prev.houseType, type],
    }))
  }

  const toggleBrandOrigin = (country: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      brandOrigin: prev.brandOrigin.includes(country)
        ? prev.brandOrigin.filter((c) => c !== country)
        : [...prev.brandOrigin, country],
    }))
  }

  const filteredBrands = availableBrands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const filteredAccords = availableAccords.filter((accord) =>
    accord.toLowerCase().includes(accordSearch.toLowerCase())
  )

  const filteredNotesInclude = availableNotes.filter((note) =>
    note.toLowerCase().includes(noteIncludeSearch.toLowerCase())
  )

  const filteredNotesExclude = availableNotes.filter((note) =>
    note.toLowerCase().includes(noteExcludeSearch.toLowerCase())
  )

  const activeFilterCount = countActiveFilters(localFilters)
  const hasActiveFilters = activeFilterCount > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground font-semibold">
                {activeFilterCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Filters */}
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Basic Filters</h3>
            </div>

            {/* Price Range */}
            <div className={cn("space-y-3 transition-colors", localFilters.priceRange.min > DEFAULT_FILTERS.priceRange.min || localFilters.priceRange.max < DEFAULT_FILTERS.priceRange.max ? "bg-muted/30 p-3 rounded-lg" : "")}>
              <label className="text-sm font-semibold">Price Range</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={localFilters.priceRange.min || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          min: Number(e.target.value) || 0,
                        },
                      }))
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={localFilters.priceRange.max || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          max: Number(e.target.value) || 10000,
                        },
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className={cn("space-y-3 transition-colors", localFilters.brands.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
              <label className="text-sm font-semibold">Brands</label>
              <Input
                type="text"
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredBrands.slice(0, 50).map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200",
                      localFilters.brands.includes(brand)
                        ? "bg-primary text-primary-foreground scale-[1.02]"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Accords Filter */}
            <div className={cn("space-y-3 transition-colors", localFilters.accords.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
              <label className="text-sm font-semibold">Accords</label>
              <Input
                type="text"
                placeholder="Search accords..."
                value={accordSearch}
                onChange={(e) => setAccordSearch(e.target.value)}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {filteredAccords.slice(0, 50).map((accord) => (
                  <button
                    key={accord}
                    type="button"
                    onClick={() => toggleAccord(accord)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                      localFilters.accords.includes(accord)
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {accord}
                  </button>
                ))}
              </div>
            </div>

            {/* Wear Context */}
            <div className={cn("space-y-3 transition-colors", localFilters.wearContext.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
              <label className="text-sm font-semibold">Wear Context</label>
              <div className="flex flex-wrap gap-2">
                {(["day", "night", "office", "date"] as const).map((context) => (
                  <button
                    key={context}
                    type="button"
                    onClick={() => toggleWearContext(context)}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize",
                      localFilters.wearContext.includes(context)
                        ? "bg-primary text-primary-foreground scale-[1.02]"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {context}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className={cn("space-y-3 transition-colors", localFilters.minRating > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
              <label className="text-sm font-semibold">
                Minimum Rating: {localFilters.minRating.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={localFilters.minRating}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    minRating: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="pt-4 border-t">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold hover:text-foreground transition-colors"
            >
              <span>Advanced Filters</span>
              {advancedOpen ? (
                <ChevronUp className="h-4 w-4 transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform" />
              )}
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                advancedOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="space-y-6 pt-4">
                <p className="text-xs text-muted-foreground italic">
                  Advanced filters may significantly narrow results.
                </p>

                {/* Concentration */}
                <div className={cn("space-y-3 transition-colors", localFilters.concentration.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">Concentration</label>
                  <div className="flex flex-wrap gap-2">
                    {(["EDT", "EDP", "Parfum"] as const).map((conc) => (
                      <button
                        key={conc}
                        type="button"
                        onClick={() => toggleConcentration(conc)}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          localFilters.concentration.includes(conc)
                            ? "bg-primary text-primary-foreground scale-[1.02]"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {conc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Include */}
                <div className={cn("space-y-3 transition-colors", localFilters.notesInclude.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">
                    Must Include Notes (AND)
                  </label>
                  <Input
                    type="text"
                    placeholder="Search notes to include..."
                    value={noteIncludeSearch}
                    onChange={(e) => setNoteIncludeSearch(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredNotesInclude.slice(0, 30).map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => toggleNoteInclude(note)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                          localFilters.notesInclude.includes(note)
                            ? "bg-primary text-primary-foreground scale-110"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Exclude */}
                <div className={cn("space-y-3 transition-colors", localFilters.notesExclude.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">Exclude Notes</label>
                  <Input
                    type="text"
                    placeholder="Search notes to exclude..."
                    value={noteExcludeSearch}
                    onChange={(e) => setNoteExcludeSearch(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredNotesExclude.slice(0, 30).map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => toggleNoteExclude(note)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                          localFilters.notesExclude.includes(note)
                            ? "bg-destructive/20 text-destructive border border-destructive/50 scale-110"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* House Type */}
                <div className={cn("space-y-3 transition-colors", localFilters.houseType.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">House Type</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Designer", "Niche", "Indie"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleHouseType(type)}
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          localFilters.houseType.includes(type)
                            ? "bg-primary text-primary-foreground scale-[1.02]"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Origin */}
                <div className={cn("space-y-3 transition-colors", localFilters.brandOrigin.length > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">Brand Origin</label>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {availableCountries.slice(0, 50).map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => toggleBrandOrigin(country)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200",
                          localFilters.brandOrigin.includes(country)
                            ? "bg-primary text-primary-foreground scale-[1.02]"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div className={cn("space-y-3 transition-colors", localFilters.yearRange.min > DEFAULT_FILTERS.yearRange.min || localFilters.yearRange.max < currentYear ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">Release Year</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min Year"
                        value={localFilters.yearRange.min || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            yearRange: {
                              ...prev.yearRange,
                              min: Number(e.target.value) || 0,
                            },
                          }))
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Max Year"
                        value={localFilters.yearRange.max || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            yearRange: {
                              ...prev.yearRange,
                              max: Number(e.target.value) || currentYear,
                            },
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Review Count */}
                <div className={cn("space-y-3 transition-colors", localFilters.minReviewCount !== undefined && localFilters.minReviewCount > 0 ? "bg-muted/30 p-3 rounded-lg" : "")}>
                  <label className="text-sm font-semibold">
                    Minimum Review Count
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter minimum reviews..."
                    value={localFilters.minReviewCount || ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minReviewCount:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 gap-2 sticky bottom-0 bg-background pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex-1"
            disabled={isApplying}
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isApplying}
          >
            {isApplying ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </span>
            ) : (
              "Apply Filters"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
