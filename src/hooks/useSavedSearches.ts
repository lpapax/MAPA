'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabaseRaw } from '@/lib/supabase'
import type { SavedSearchRow } from '@/types/database'
import type { FarmFilters } from '@/types/farm'

export interface SavedSearch {
  id: string
  name: string
  filters: FarmFilters
  createdAt: string
}

function rowToSearch(row: SavedSearchRow): SavedSearch {
  return {
    id: row.id,
    name: row.name,
    filters: row.filters as unknown as FarmFilters,
    createdAt: row.created_at,
  }
}

export function useSavedSearches() {
  const { user } = useAuth()
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setSearches([]); return }
    const supabase = getSupabaseRaw()
    if (!supabase) return

    setLoading(true)
    supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => {
        setSearches(((data as SavedSearchRow[]) ?? []).map(rowToSearch))
        setLoading(false)
      })
  }, [user])

  const saveSearch = useCallback(async (name: string, filters: FarmFilters): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Nejste přihlášeni.' }
    const supabase = getSupabaseRaw()
    if (!supabase) return { error: 'Supabase není dostupný.' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('saved_searches')
      .insert({ user_id: user.id, name: name.trim(), filters })
      .select()
      .single()

    if (error) return { error: (error as { message: string }).message }
    if (data) setSearches((prev) => [rowToSearch(data as SavedSearchRow), ...prev])
    return { error: null }
  }, [user])

  const deleteSearch = useCallback(async (id: string): Promise<void> => {
    const supabase = getSupabaseRaw()
    if (!supabase) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('saved_searches').delete().eq('id', id)
    setSearches((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { searches, loading, saveSearch, deleteSearch }
}
