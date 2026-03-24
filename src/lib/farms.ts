import farmsData from '@/data/farms.json'
import { getSupabaseClient } from './supabase'
import type { FarmRow } from '@/types/database'
import type { Farm, FarmCategory, FarmFilters, FarmMapMarker, FarmContact, OpeningHours } from '@/types/farm'

// ── Row mapper ────────────────────────────────────────────────

function rowToFarm(row: FarmRow): Farm {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    categories: row.categories as FarmCategory[],
    location: {
      lat: row.lat,
      lng: row.lng,
      address: row.address,
      city: row.city,
      kraj: row.kraj,
      zip: row.zip,
    },
    contact: row.contact as FarmContact,
    openingHours: (row.opening_hours as OpeningHours) ?? undefined,
    images: row.images,
    verified: row.verified,
    createdAt: row.created_at,
  }
}

// ── Seed fallback ─────────────────────────────────────────────

const seedFarms: Farm[] = farmsData as Farm[]

// ── Data access layer (async) ─────────────────────────────────

/**
 * Fetch all farms.
 * Uses Supabase when env vars are set, falls back to local JSON seed data.
 */
export async function getAllFarms(): Promise<Farm[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    // No Supabase configured — use JSON seed
    return seedFarms
  }

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[farms] Supabase error, falling back to seed:', error.message)
    return seedFarms
  }

  return (data ?? []).map(rowToFarm)
}

/**
 * Fetch a single farm by slug.
 */
export async function getFarmBySlug(slug: string): Promise<Farm | undefined> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return seedFarms.find((f) => f.slug === slug)
  }

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`[farms] Supabase error for slug "${slug}", falling back:`, error.message)
    return seedFarms.find((f) => f.slug === slug)
  }

  return data ? rowToFarm(data) : undefined
}

/**
 * Return all slugs — used by generateStaticParams.
 * Falls back to seed when Supabase is unavailable (build time).
 */
export async function getAllSlugs(): Promise<string[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return seedFarms.map((f) => f.slug)
  }

  const { data, error } = await supabase.from('farms').select('slug')

  if (error) {
    console.error('[farms] getAllSlugs fallback:', error.message)
    return seedFarms.map((f) => f.slug)
  }

  return (data ?? []).map((r) => (r as { slug: string }).slug)
}

/**
 * Returns lightweight marker objects for the map.
 */
export async function getFarmMapMarkers(): Promise<FarmMapMarker[]> {
  const farms = await getAllFarms()
  return farms.map((farm) => ({
    id: farm.id,
    slug: farm.slug,
    name: farm.name,
    lat: farm.location.lat,
    lng: farm.location.lng,
    categories: farm.categories,
    verified: farm.verified,
  }))
}

// ── Client-side filtering (pure / synchronous) ────────────────

export function filterFarms(farms: Farm[], filters: FarmFilters): Farm[] {
  return farms.filter((farm) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.some((cat: FarmCategory) => farm.categories.includes(cat))
    )
      return false

    if (filters.kraj && farm.location.kraj !== filters.kraj) return false

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      if (
        !farm.name.toLowerCase().includes(q) &&
        !farm.location.city.toLowerCase().includes(q) &&
        !farm.description.toLowerCase().includes(q)
      )
        return false
    }

    if (filters.openNow && !isFarmOpenNow(farm)) return false

    return true
  })
}

export function isFarmOpenNow(farm: Farm): boolean {
  if (!farm.openingHours) return false

  const now = new Date()
  const days: Record<number, string> = {
    1: 'po', 2: 'út', 3: 'st', 4: 'čt', 5: 'pá', 6: 'so', 0: 'ne',
  }
  const dayKey = days[now.getDay()] as keyof typeof farm.openingHours
  const todayHours = farm.openingHours[dayKey]

  if (!todayHours) return false

  const [openH, openM] = todayHours.open.split(':').map(Number)
  const [closeH, closeM] = todayHours.close.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()

  return current >= openH * 60 + openM && current < closeH * 60 + closeM
}

export const CATEGORY_LABELS: Record<FarmCategory, string> = {
  zelenina: 'Zelenina',
  ovoce: 'Ovoce',
  maso: 'Maso',
  mléko: 'Mléko',
  vejce: 'Vejce',
  med: 'Med',
  chléb: 'Chléb & pečivo',
  sýry: 'Sýry',
  víno: 'Víno',
  byliny: 'Bylinky',
  ryby: 'Ryby',
  ostatní: 'Ostatní',
}
