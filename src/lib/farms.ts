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
      address: row.address ?? '',
      city: row.city,
      kraj: row.kraj,
      zip: row.zip ?? '',
    },
    contact: (row.contact ?? {}) as FarmContact,
    openingHours: (row.opening_hours as OpeningHours) ?? undefined,
    images: row.images,
    verified: row.verified,
    viewCount: row.view_count ?? 0,
    createdAt: row.created_at ?? '',
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

  const allRows: FarmRow[] = []
  const pageSize = 1000
  let from = 0

  // Select only columns needed for map/sidebar — skips contact, address, zip, created_at
  const COLS = 'id,slug,name,description,categories,lat,lng,city,kraj,opening_hours,images,verified,view_count'

  while (true) {
    const { data, error } = await supabase
      .from('farms')
      .select(COLS)
      .order('name', { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) {
      console.error('[farms] Supabase error, falling back to seed:', error.message)
      return seedFarms
    }

    allRows.push(...(data ?? []))
    if (!data || data.length < pageSize) break
    from += pageSize
  }

  return allRows.map(rowToFarm)
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
 * Fetch a small number of farms for the homepage — efficient, does not load all 3 960.
 * Prefers verified farms; falls back to any farms if fewer than `limit` are verified.
 */
export async function getHomepageFarms(limit = 6): Promise<Farm[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    // From seed: pick one farm per kraj to get geographic variety
    const seen = new Set<string>()
    const result: Farm[] = []
    for (const farm of seedFarms) {
      if (!seen.has(farm.location.kraj) && result.length < limit) {
        seen.add(farm.location.kraj)
        result.push(farm)
      }
    }
    return result.length >= limit ? result : seedFarms.slice(0, limit)
  }

  // Try verified farms first
  const { data: verified } = await supabase
    .from('farms')
    .select('*')
    .eq('verified', true)
    .limit(limit)

  if (verified && verified.length >= limit) return verified.map(rowToFarm)

  // Not enough verified — fill from all farms
  const { data: any, error } = await supabase
    .from('farms')
    .select('*')
    .order('name', { ascending: true })
    .limit(limit)

  if (error) return seedFarms.slice(0, limit)
  return (any ?? []).map(rowToFarm)
}

/**
 * Fetch farms from the same kraj, excluding the given slug.
 * Used for the "similar farms" sidebar on farm detail pages.
 */
export async function getSimilarFarms(slug: string, kraj: string, limit = 3): Promise<Farm[]> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    return seedFarms
      .filter((f) => f.location.kraj === kraj && f.slug !== slug)
      .slice(0, limit)
  }

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .eq('kraj', kraj)
    .neq('slug', slug)
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) {
    return seedFarms
      .filter((f) => f.location.kraj === kraj && f.slug !== slug)
      .slice(0, limit)
  }

  return (data ?? []).map(rowToFarm)
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

/**
 * Fetch a small set of farms by their IDs — used by /porovnat.
 * Much cheaper than getAllFarms() when only 2-3 farms are needed.
 */
export async function getFarmsByIds(ids: string[]): Promise<Farm[]> {
  if (ids.length === 0) return []
  const supabase = getSupabaseClient()

  if (!supabase) {
    return seedFarms.filter((f) => ids.includes(f.id))
  }

  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .in('id', ids)
    .limit(10)

  if (error) return seedFarms.filter((f) => ids.includes(f.id))
  return (data ?? []).map(rowToFarm)
}

/**
 * Count farms grouped by kraj — used by /kraje.
 * Much cheaper than getAllFarms() since it only fetches the kraj column.
 */
export async function getFarmCountByKraj(): Promise<Record<string, number>> {
  const supabase = getSupabaseClient()

  if (!supabase) {
    const counts: Record<string, number> = {}
    for (const farm of seedFarms) {
      const k = farm.location.kraj
      counts[k] = (counts[k] ?? 0) + 1
    }
    return counts
  }

  const counts: Record<string, number> = {}
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from('farms')
      .select('kraj')
      .range(from, from + pageSize - 1)

    if (error) break
    for (const row of data ?? []) {
      const k = (row as { kraj: string }).kraj
      counts[k] = (counts[k] ?? 0) + 1
    }
    if (!data || data.length < pageSize) break
    from += pageSize
  }

  return counts
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

export const CATEGORY_META: Record<FarmCategory, { label: string; emoji: string; color: string }> = {
  zelenina: { label: 'Zelenina',     emoji: '🥕', color: '#4a8c3f' },
  ovoce:    { label: 'Ovoce',        emoji: '🍎', color: '#e05a6e' },
  maso:     { label: 'Maso',         emoji: '🥩', color: '#bf5b3d' },
  mléko:    { label: 'Mléko',        emoji: '🥛', color: '#4a90c4' },
  vejce:    { label: 'Vejce',        emoji: '🥚', color: '#c8963e' },
  med:      { label: 'Med',          emoji: '🍯', color: '#c8a23e' },
  chléb:    { label: 'Chléb',        emoji: '🍞', color: '#a07850' },
  sýry:     { label: 'Sýry',         emoji: '🧀', color: '#d4a855' },
  víno:     { label: 'Víno',         emoji: '🍷', color: '#7b3d8c' },
  byliny:   { label: 'Bylinky',      emoji: '🌿', color: '#6ba832' },
  ryby:     { label: 'Ryby',         emoji: '🐟', color: '#3d7fa0' },
  ostatní:  { label: 'Ostatní',      emoji: '🏪', color: '#6b7280' },
}
