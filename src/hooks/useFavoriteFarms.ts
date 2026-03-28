'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FarmCategory } from '@/types/farm'
import { useAuth } from '@/hooks/useAuth'
import { getSupabaseClientSingleton } from '@/lib/supabase'
import {
  fetchRemoteFavorites,
  upsertRemoteFavorite,
  deleteRemoteFavorite,
  syncLocalToRemote,
  mergeFavorites,
} from '@/lib/syncFavorites'

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
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteFarmEntry[]>([])

  // Hydrate: localStorage on mount, then sync with remote if logged in
  useEffect(() => {
    const local = readStorage()
    setFavorites(local)

    if (!user) return
    const supabase = getSupabaseClientSingleton()
    if (!supabase) return

    // Sync local → remote, then load merged result
    syncLocalToRemote(supabase, user.id, local).then(() =>
      fetchRemoteFavorites(supabase, user.id).then((remote) => {
        const merged = mergeFavorites(local, remote)
        writeStorage(merged)
        setFavorites(merged)
      }),
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

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

        // Mirror to Supabase in background
        const supabase = getSupabaseClientSingleton()
        if (supabase && user) {
          if (exists) {
            deleteRemoteFavorite(supabase, user.id, entry.slug)
          } else {
            upsertRemoteFavorite(supabase, user.id, { ...entry, savedAt: Date.now() })
          }
        }

        return next
      })
    },
    [user],
  )

  const clearFavorites = useCallback(() => {
    writeStorage([])
    setFavorites([])

    const supabase = getSupabaseClientSingleton()
    if (supabase && user) {
      supabase.from('user_favorites').delete().eq('user_id', user.id)
    }
  }, [user])

  return { favorites, isFavorite, toggleFavorite, clearFavorites }
}
