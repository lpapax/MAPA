'use client'

import { useState, useEffect, useCallback } from 'react'

const KEY = 'mf_recent_searches'
const MAX = 5

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) setSearches(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const addSearch = useCallback((query: string) => {
    const q = query.trim()
    if (!q) return
    setSearches((prev) => {
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, MAX)
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s !== query)
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  return { searches, addSearch, removeSearch }
}
