'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FarmCategory } from '@/types/farm'

const STORAGE_KEY = 'mf_favorites'

export interface FavoriteFarmEntry {
  slug: string
  name: string
  categories: FarmCategory[]
  kraj: string
  savedAt: number
}

function readStorage(): FavoriteFarmEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoriteFarmEntry[]) : []
  } catch {
    return []
  }
}

function writeStorage(entries: FavoriteFarmEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore quota errors
  }
}

export function useFavoriteFarms() {
  const [favorites, setFavorites] = useState<FavoriteFarmEntry[]>([])

  useEffect(() => {
    setFavorites(readStorage())
  }, [])

  const isFavorite = useCallback(
    (slug: string) => favorites.some((f) => f.slug === slug),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (entry: FavoriteFarmEntry) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.slug === entry.slug)
        const next = exists
          ? prev.filter((f) => f.slug !== entry.slug)
          : [{ ...entry, savedAt: Date.now() }, ...prev]
        writeStorage(next)
        return next
      })
    },
    [],
  )

  const clearFavorites = useCallback(() => {
    writeStorage([])
    setFavorites([])
  }, [])

  return { favorites, isFavorite, toggleFavorite, clearFavorites }
}
