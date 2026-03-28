// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

import type { UserFavoriteRow } from '@/types/database'
import type { FavoriteFarmEntry } from '@/hooks/useFavoriteFarms'

export async function fetchRemoteFavorites(supabase: AnySupabase, userId: string): Promise<FavoriteFarmEntry[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error || !data) return []
  return (data as UserFavoriteRow[]).map(rowToEntry)
}

export async function upsertRemoteFavorite(supabase: AnySupabase, userId: string, entry: FavoriteFarmEntry): Promise<void> {
  await supabase.from('user_favorites').upsert({
    user_id: userId,
    farm_slug: entry.slug,
    farm_name: entry.name,
    categories: entry.categories,
    kraj: entry.kraj,
    saved_at: new Date(entry.savedAt).toISOString(),
  }, { onConflict: 'user_id,farm_slug' })
}

export async function deleteRemoteFavorite(supabase: AnySupabase, userId: string, slug: string): Promise<void> {
  await supabase.from('user_favorites').delete().eq('user_id', userId).eq('farm_slug', slug)
}

export async function syncLocalToRemote(supabase: AnySupabase, userId: string, localEntries: FavoriteFarmEntry[]): Promise<void> {
  if (localEntries.length === 0) return
  const rows = localEntries.map((e) => ({
    user_id: userId,
    farm_slug: e.slug,
    farm_name: e.name,
    categories: e.categories,
    kraj: e.kraj,
    saved_at: new Date(e.savedAt).toISOString(),
  }))
  await supabase.from('user_favorites').upsert(rows, { onConflict: 'user_id,farm_slug', ignoreDuplicates: true })
}

export function mergeFavorites(local: FavoriteFarmEntry[], remote: FavoriteFarmEntry[]): FavoriteFarmEntry[] {
  const bySlug = new Map<string, FavoriteFarmEntry>()
  for (const r of remote) bySlug.set(r.slug, r)
  for (const l of local) {
    const existing = bySlug.get(l.slug)
    if (!existing || l.savedAt > existing.savedAt) bySlug.set(l.slug, l)
  }
  return Array.from(bySlug.values()).sort((a, b) => b.savedAt - a.savedAt)
}

function rowToEntry(row: UserFavoriteRow): FavoriteFarmEntry {
  return {
    slug: row.farm_slug,
    name: row.farm_name,
    categories: row.categories as FavoriteFarmEntry['categories'],
    kraj: row.kraj,
    savedAt: new Date(row.saved_at).getTime(),
  }
}
