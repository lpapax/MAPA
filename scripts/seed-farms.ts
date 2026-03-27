/**
 * Seed script — inserts all farms from src/data/farms.json into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed-farms.ts
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Uses ON CONFLICT DO NOTHING so it's safe to run multiple times.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('Make sure .env.local is present and run: npx dotenv -e .env.local -- npx tsx scripts/seed-farms.ts')
  process.exit(1)
}

const supabase = createClient(url, key)

const farmsPath = resolve(process.cwd(), 'src/data/farms.json')
const farms = JSON.parse(readFileSync(farmsPath, 'utf-8'))

const rows = farms.map((f: {
  slug: string
  name: string
  description: string
  categories: string[]
  location: { lat: number; lng: number; address: string; city: string; kraj: string; zip: string }
  contact: unknown
  openingHours?: unknown
  images: string[]
  verified: boolean
  createdAt: string
}) => ({
  slug: f.slug,
  name: f.name,
  description: f.description,
  categories: f.categories,
  lat: f.location.lat,
  lng: f.location.lng,
  address: f.location.address,
  city: f.location.city,
  kraj: f.location.kraj,
  zip: f.location.zip,
  contact: f.contact,
  opening_hours: f.openingHours ?? null,
  images: f.images,
  verified: f.verified,
  created_at: f.createdAt,
}))

async function main() {
  const { error } = await supabase
    .from('farms')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
    .select('slug')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Seeded ${rows.length} farms:`)
  rows.forEach((r: { slug: string }) => console.log(' -', r.slug))
}

main()
