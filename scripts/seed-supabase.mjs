/**
 * MAPA FAREM — Supabase Batch Seeder
 *
 * Inserts all farms from scripts/output/farms-imported.json into Supabase
 * in batches of 100, using the service role key to bypass RLS.
 *
 * Usage:
 *   npm run seed-supabase
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing env vars. Add to .env.local:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=eyJ...')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
})

const importedPath = resolve(__dirname, 'output/farms-imported.json')
const existingPath = resolve(ROOT, 'src/data/farms.json')

const source = existsSync(importedPath) ? importedPath : existingPath
console.log(`Reading farms from: ${source}`)

const farms = JSON.parse(readFileSync(source, 'utf-8'))

// Map from Farm shape → FarmRow (flat, snake_case for Supabase)
const rows = farms.map((f) => ({
  slug: f.slug,
  name: f.name,
  description: f.description,
  categories: f.categories,
  lat: f.location?.lat ?? f.lat,
  lng: f.location?.lng ?? f.lng,
  address: f.location?.address ?? f.address ?? '',
  city: f.location?.city ?? f.city ?? '',
  kraj: f.location?.kraj ?? f.kraj ?? '',
  zip: f.location?.zip ?? f.zip ?? '',
  contact: f.contact ?? {},
  opening_hours: f.openingHours ?? f.opening_hours ?? null,
  images: f.images ?? [],
  verified: f.verified ?? false,
  created_at: f.createdAt ?? f.created_at ?? new Date().toISOString(),
}))

const BATCH = 100
let inserted = 0
let skipped = 0
let failed = 0

console.log(`\nInserting ${rows.length} farms in batches of ${BATCH}...\n`)

for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH)
  const batchNum = Math.floor(i / BATCH) + 1
  const totalBatches = Math.ceil(rows.length / BATCH)

  const { error } = await supabase
    .from('farms')
    .upsert(batch, { onConflict: 'slug', ignoreDuplicates: true })

  if (error) {
    console.error(`  [${batchNum}/${totalBatches}] FAILED: ${error.message}`)
    failed += batch.length
  } else {
    inserted += batch.length
    process.stdout.write(`  [${batchNum}/${totalBatches}] +${batch.length} farms (total inserted: ${inserted})\r`)
  }
}

console.log(`\n\nDone.`)
console.log(`  Inserted: ${inserted}`)
console.log(`  Failed:   ${failed}`)
console.log(`  Total:    ${rows.length}`)
