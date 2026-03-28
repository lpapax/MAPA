/**
 * MAPA FAREM — Supabase Photo Updater
 *
 * Updates images and descriptions for enriched farms in Supabase.
 * Uses the service role key to bypass RLS.
 *
 * Usage:
 *   node --env-file=.env.local scripts/update-photos-supabase.mjs
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient(url, key, { auth: { persistSession: false } })

const importedPath = resolve(__dirname, 'output/farms-imported.json')
if (!existsSync(importedPath)) {
  console.error('farms-imported.json not found. Run: npm run enrich-photos')
  process.exit(1)
}

const farms = JSON.parse(readFileSync(importedPath, 'utf-8'))
const enriched = farms.filter(
  (f) => f.images?.length > 0 && !f.images[0].includes('placeholder'),
)

console.log(`Farms with real photos to update: ${enriched.length}`)

const BATCH = 50
let updated = 0
let errors = 0

for (let i = 0; i < enriched.length; i += BATCH) {
  const batch = enriched.slice(i, i + BATCH)

  await Promise.allSettled(
    batch.map(async (farm) => {
      const { error } = await supabase
        .from('farms')
        .update({
          images: farm.images,
          description: farm.description,
        })
        .eq('slug', farm.slug)

      if (error) {
        errors++
      } else {
        updated++
      }
    }),
  )

  const pct = Math.round(((i + batch.length) / enriched.length) * 100)
  process.stdout.write(`\r[${pct}%] ${updated} updated, ${errors} errors`)
}

console.log(`\n\nDone! ${updated} farms updated in Supabase (${errors} errors).`)
