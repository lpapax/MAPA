/**
 * import-markets.ts
 *
 * Discovers farmers markets across Czech Republic using Google Places API
 * and outputs SQL ready to insert into the markets table.
 *
 * Usage:
 *   npx tsx scripts/import-markets.ts
 *
 * Requires:
 *   GOOGLE_PLACES_API_KEY in .env.local
 *   SUPABASE_SERVICE_ROLE_KEY in .env.local  (for direct insert mode)
 *
 * Output:
 *   scripts/output/markets-imported.json   — raw discovered markets
 *   scripts/output/markets-import.sql      — SQL INSERT statements
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in .env.local')
  process.exit(1)
}

const OUTPUT_DIR = path.resolve(process.cwd(), 'scripts/output')
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const PROGRESS_FILE = path.join(OUTPUT_DIR, 'markets-imported.json')
const SQL_FILE      = path.join(OUTPUT_DIR, 'markets-import.sql')

// Czech city centres to search around (lat, lng, name)
const SEARCH_CENTRES = [
  { lat: 50.0755, lng: 14.4378, city: 'Praha',            region: 'Hlavní město Praha' },
  { lat: 49.1951, lng: 16.6068, city: 'Brno',             region: 'Jihomoravský kraj' },
  { lat: 49.7384, lng: 13.3736, city: 'Plzeň',            region: 'Plzeňský kraj' },
  { lat: 50.6607, lng: 14.0323, city: 'Ústí nad Labem',   region: 'Ústecký kraj' },
  { lat: 50.7663, lng: 15.0543, city: 'Liberec',          region: 'Liberecký kraj' },
  { lat: 50.2092, lng: 15.8328, city: 'Hradec Králové',   region: 'Královéhradecký kraj' },
  { lat: 50.0343, lng: 15.7812, city: 'Pardubice',        region: 'Pardubický kraj' },
  { lat: 49.5938, lng: 17.2509, city: 'Olomouc',          region: 'Olomoucký kraj' },
  { lat: 49.8209, lng: 18.2625, city: 'Ostrava',          region: 'Moravskoslezský kraj' },
  { lat: 49.2247, lng: 17.6671, city: 'Zlín',             region: 'Zlínský kraj' },
  { lat: 48.9745, lng: 14.4746, city: 'České Budějovice', region: 'Jihočeský kraj' },
  { lat: 49.3961, lng: 15.5910, city: 'Jihlava',          region: 'Kraj Vysočina' },
  { lat: 50.2314, lng: 12.8715, city: 'Karlovy Vary',     region: 'Karlovarský kraj' },
  { lat: 50.1435, lng: 14.1015, city: 'Kladno',           region: 'Středočeský kraj' },
  { lat: 49.9381, lng: 17.9027, city: 'Opava',            region: 'Moravskoslezský kraj' },
  { lat: 49.6063, lng: 15.5798, city: 'Havlíčkův Brod',  region: 'Kraj Vysočina' },
  { lat: 49.4459, lng: 17.9938, city: 'Přerov',           region: 'Olomoucký kraj' },
  { lat: 49.3407, lng: 16.1637, city: 'Žďár nad Sázavou', region: 'Kraj Vysočina' },
  { lat: 50.4115, lng: 15.9000, city: 'Jičín',            region: 'Královéhradecký kraj' },
  { lat: 49.0445, lng: 17.4658, city: 'Uherské Hradiště', region: 'Zlínský kraj' },
]

const SEARCH_QUERIES = [
  'farmářský trh',
  'farmers market',
  'bio trh',
  'tržiště',
]

interface PlaceResult {
  place_id: string
  name: string
  geometry: { location: { lat: number; lng: number } }
  vicinity?: string
  rating?: number
  user_ratings_total?: number
  types?: string[]
}

interface DiscoveredMarket {
  place_id: string
  name: string
  lat: number
  lng: number
  vicinity: string
  city: string
  region: string
  rating: number
  reviewCount: number
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function searchNearby(
  lat: number,
  lng: number,
  query: string,
): Promise<PlaceResult[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
  url.searchParams.set('location', `${lat},${lng}`)
  url.searchParams.set('radius', '30000') // 30 km
  url.searchParams.set('keyword', query)
  url.searchParams.set('language', 'cs')
  url.searchParams.set('key', API_KEY!)

  const res = await fetch(url.toString())
  const json = await res.json() as { results?: PlaceResult[]; status: string; error_message?: string }

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    console.warn(`  Places API error: ${json.status} — ${json.error_message ?? ''}`)
    return []
  }

  return json.results ?? []
}

async function main() {
  // Load existing progress
  const existing: Record<string, DiscoveredMarket> = {}
  if (fs.existsSync(PROGRESS_FILE)) {
    const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8')
    const arr = JSON.parse(raw) as DiscoveredMarket[]
    arr.forEach((m) => { existing[m.place_id] = m })
    console.log(`Loaded ${arr.length} existing markets from progress file`)
  }

  let newFound = 0

  for (const centre of SEARCH_CENTRES) {
    for (const query of SEARCH_QUERIES) {
      console.log(`Searching "${query}" near ${centre.city}…`)

      const results = await searchNearby(centre.lat, centre.lng, query)

      for (const r of results) {
        if (existing[r.place_id]) continue // already have it

        // Basic relevance filter — skip if name looks unrelated
        const nameLower = r.name.toLowerCase()
        const relevant = ['trh', 'market', 'tržiště', 'bio', 'farmář', 'zelenin'].some((kw) =>
          nameLower.includes(kw)
        )
        if (!relevant) continue

        existing[r.place_id] = {
          place_id: r.place_id,
          name: r.name,
          lat: r.geometry.location.lat,
          lng: r.geometry.location.lng,
          vicinity: r.vicinity ?? '',
          city: centre.city,
          region: centre.region,
          rating: r.rating ?? 0,
          reviewCount: r.user_ratings_total ?? 0,
        }
        newFound++
      }

      // Save progress after each query
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(Object.values(existing), null, 2), 'utf-8')

      await sleep(200) // be gentle with the API
    }
  }

  const all = Object.values(existing)
  console.log(`\nTotal: ${all.length} unique markets (${newFound} new)`)

  // Generate SQL
  const rows = all.map((m) => {
    const name     = m.name.replace(/'/g, "''")
    const city     = m.city.replace(/'/g, "''")
    const region   = m.region.replace(/'/g, "''")
    const vicinity = m.vicinity.replace(/'/g, "''")
    return `  ('${name}', '${city}', '${region}', ${m.lat}, ${m.lng}, 'Ověřte na místě', '', 0, ARRAY['Farmářský'], '', FALSE, 6, '${vicinity}', ${m.rating}, ${m.reviewCount})`
  })

  const sql = `-- Auto-discovered markets via Google Places API
-- Review before inserting! Many entries may need manual cleanup.
-- Columns: name, city, region, lat, lng, schedule, time, vendors, tags, photo, is_daily, dow
-- NOTE: vicinity/rating/reviewCount below are informational — remove from INSERT if not in schema

INSERT INTO markets (name, city, region, lat, lng, schedule, time, vendors, tags, photo, is_daily, dow) VALUES
${all.map((m) => {
  const name   = m.name.replace(/'/g, "''")
  const city   = m.city.replace(/'/g, "''")
  const region = m.region.replace(/'/g, "''")
  return `  ('${name}', '${city}', '${region}', ${m.lat}, ${m.lng}, 'Ověřte na místě', '', 0, ARRAY['Farmářský'], '', FALSE, 6)`
}).join(',\n')};
`

  fs.writeFileSync(SQL_FILE, sql, 'utf-8')
  console.log(`SQL written to ${SQL_FILE}`)
  console.log(`JSON written to ${PROGRESS_FILE}`)
  console.log('\nNext steps:')
  console.log('  1. Review scripts/output/markets-imported.json — remove irrelevant results')
  console.log('  2. Fill in schedule, time, vendors for each market manually')
  console.log('  3. Run the SQL in Supabase SQL Editor')
  void rows
}

main().catch(console.error)
