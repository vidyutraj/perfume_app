"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { type Fragrance } from "@/lib/data/types"

const STORAGE_KEY = "perfume-locker-collection"

interface LockerContextType {
  collection: Fragrance[]
  addToLocker: (fragrance: Fragrance) => boolean
  removeFromLocker: (fragrance: Fragrance) => void
  isInLocker: (fragrance: Fragrance) => boolean
}

const LockerContext = createContext<LockerContextType | undefined>(undefined)

export function LockerProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Fragrance[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setCollection(JSON.parse(stored))
        } catch (error) {
          console.error("Error loading collection from localStorage:", error)
        }
      }
    }
  }, [])

  // Save to localStorage whenever collection changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection))
    }
  }, [collection])

  const addToLocker = (fragrance: Fragrance) => {
    // Check if already in collection
    const exists = collection.some(
      (item) => item.name === fragrance.name && item.brand === fragrance.brand
    )
    
    if (!exists) {
      setCollection((prev) => [...prev, fragrance])
      return true
    }
    return false
  }

  const removeFromLocker = (fragrance: Fragrance) => {
    setCollection((prev) =>
      prev.filter(
        (item) => !(item.name === fragrance.name && item.brand === fragrance.brand)
      )
    )
  }

  const isInLocker = (fragrance: Fragrance) => {
    return collection.some(
      (item) => item.name === fragrance.name && item.brand === fragrance.brand
    )
  }

  return (
    <LockerContext.Provider
      value={{
        collection,
        addToLocker,
        removeFromLocker,
        isInLocker,
      }}
    >
      {children}
    </LockerContext.Provider>
  )
}

export function useLocker() {
  const context = useContext(LockerContext)
  if (context === undefined) {
    throw new Error("useLocker must be used within a LockerProvider")
  }
  return context
}
