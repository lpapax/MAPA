'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Farm, FarmCategory } from '@/types/farm'

const STORAGE_KEY = 'mf_recent_farms'
const MAX_ENTRIES = 6

export interface RecentFarmEntry {
  slug: string
  name: string
  categories: FarmCategory[]
  kraj: string
  visitedAt: number // Unix timestamp ms
}

function readStorage(): RecentFarmEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RecentFarmEntry[]) : []
  } catch {
    return []
  }
}

function writeStorage(entries: RecentFarmEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Silently ignore storage quota errors
  }
}

export function useRecentFarms() {
  const [recentFarms, setRecentFarms] = useState<RecentFarmEntry[]>([])

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setRecentFarms(readStorage())
  }, [])

  const addRecentFarm = useCallback((farm: Farm) => {
    setRecentFarms((prev) => {
      // Remove any existing entry for this slug, then prepend
      const filtered = prev.filter((e) => e.slug !== farm.slug)
      const next: RecentFarmEntry[] = [
        {
          slug: farm.slug,
          name: farm.name,
          categories: farm.categories,
          kraj: farm.location.kraj,
          visitedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_ENTRIES)
      writeStorage(next)
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    writeStorage([])
    setRecentFarms([])
  }, [])

  return { recentFarms, addRecentFarm, clearRecent }
}
