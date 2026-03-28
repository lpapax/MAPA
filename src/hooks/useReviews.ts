'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabaseRaw } from '@/lib/supabase'
import type { ReviewRow } from '@/types/database'

export interface ReviewEntry {
  id: string
  name: string
  city: string
  rating: number
  text: string
  date: string
  source: 'remote' | 'local'
}

interface LocalStoredReview {
  name: string
  city: string
  rating: number
  text: string
  date: string
}

function readLocalReviews(farmSlug: string): ReviewEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`mf_reviews_${farmSlug}`)
    if (!raw) return []
    const stored = JSON.parse(raw) as LocalStoredReview[]
    if (!Array.isArray(stored)) return []
    return stored.map((r, i) => ({ ...r, id: `local-${i}`, source: 'local' as const }))
  } catch {
    return []
  }
}

function writeLocalReview(farmSlug: string, review: LocalStoredReview): void {
  try {
    const key = `mf_reviews_${farmSlug}`
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as LocalStoredReview[]
    localStorage.setItem(key, JSON.stringify([...existing, review]))
  } catch {
    // ignore
  }
}

export interface NewReviewData {
  name: string
  city: string
  rating: number
  text: string
}

export function useReviews(farmSlug: string) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const local = readLocalReviews(farmSlug)
    const supabase = getSupabaseRaw()

    if (!supabase) {
      setReviews(local)
      return
    }

    setLoading(true)
    supabase
      .from('reviews')
      .select('*')
      .eq('farm_slug', farmSlug)
      .order('created_at', { ascending: false })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => {
        const remote: ReviewEntry[] = ((data as ReviewRow[]) ?? []).map((r) => ({
          id: r.id,
          name: r.display_name,
          city: r.city,
          rating: r.rating,
          text: r.text,
          date: new Date(r.created_at).toLocaleDateString('cs-CZ'),
          source: 'remote' as const,
        }))

        // Merge: remote + local-only (no duplicates by matching name+date)
        const remoteDates = new Set(remote.map((r) => `${r.name}-${r.date}`))
        const localOnly = local.filter((l) => !remoteDates.has(`${l.name}-${l.date}`))
        setReviews([...remote, ...localOnly])
        setLoading(false)
      })
  }, [farmSlug])

  const submitReview = useCallback(async (data: NewReviewData): Promise<{ error: string | null }> => {
    const dateStr = new Date().toLocaleDateString('cs-CZ')
    const localReview: LocalStoredReview = { ...data, date: dateStr }

    if (user) {
      const supabase = getSupabaseRaw()
      if (supabase) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('reviews').insert({
          user_id: user.id,
          farm_slug: farmSlug,
          display_name: data.name,
          city: data.city,
          rating: data.rating,
          text: data.text,
        })
        if (error) return { error: (error as { message: string }).message }

        setReviews((prev) => [{
          id: `new-${Date.now()}`,
          name: data.name,
          city: data.city,
          rating: data.rating,
          text: data.text,
          date: dateStr,
          source: 'remote',
        }, ...prev])
      }
    }

    // Always write to localStorage as backup
    writeLocalReview(farmSlug, localReview)

    if (!user) {
      setReviews((prev) => [{
        id: `local-${Date.now()}`,
        name: data.name,
        city: data.city,
        rating: data.rating,
        text: data.text,
        date: dateStr,
        source: 'local',
      }, ...prev])
    }

    return { error: null }
  }, [user, farmSlug])

  return { reviews, loading, submitReview }
}
