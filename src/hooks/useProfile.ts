'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabaseRaw } from '@/lib/supabase'
import type { UserProfileRow } from '@/types/database'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfileRow | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { setProfile(null); return }
    const supabase = getSupabaseRaw()
    if (!supabase) return

    setLoading(true)
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => {
        setProfile((data as UserProfileRow) ?? null)
        setLoading(false)
      })
  }, [user])

  const updateDisplayName = useCallback(async (name: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Nejste přihlášeni.' }
    const supabase = getSupabaseRaw()
    if (!supabase) return { error: 'Supabase není dostupný.' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('user_profiles')
      .upsert({ id: user.id, display_name: name.trim(), updated_at: new Date().toISOString() })

    if (!error) {
      setProfile((prev) => prev ? { ...prev, display_name: name.trim() } : null)
    }
    return { error: error ? error.message : null }
  }, [user])

  return { profile, loading, updateDisplayName }
}
