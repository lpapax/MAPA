/**
 * MAPA FAREM — Google Places Farm Importer
 *
 * SETUP:
 * 1. Go to https://console.cloud.google.com
 * 2. Create project or select existing
 * 3. Enable APIs:
 *    - Places API (New)   ← IMPORTANT: use the NEW version
 *    - Geocoding API (optional, for extra address detail)
 * 4. Go to Credentials → Create API Key
 * 5. Restrict the key: Application restrictions = None (server-side)
 *    API restrictions = restrict to: Places API
 * 6. Copy the key to .env.local:
 *    GOOGLE_PLACES_API_KEY=AIza...
 * 7. Run: node --env-file=.env.local scripts/import-farms-google.mjs
 *
 * COST ESTIMATE:
 * - Text Search: $0.032 per request × 10 queries × 3 pages = ~$0.96
 * - Place Details: $0.017 per request × ~100 results = ~$1.70
 * - Total estimated cost: ~$3-5 for full import
 * - Google gives $200 free credit per month → this run is FREE
 *
 * OUTPUT:
 * scripts/output/farms-imported.json → merge with src/data/farms.json
 * scripts/output/seed-imported.sql   → run in Supabase SQL Editor
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Config ───────────────────────────────────────────────────────────────────

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in environment')
  console.error('Add it to .env.local: GOOGLE_PLACES_API_KEY=AIza...')
  console.error('Run: node --env-file=.env.local scripts/import-farms-google.mjs')
  process.exit(1)
}

const SEARCH_QUERIES = [
  'farma přímý prodej Česká republika',
  'ekofarma zelenina Česká republika',
  'farmářský prodej mléko sýry Čechy',
  'včelařství med přímý prodej Morava',
  'rodinná farma vejce maso Čechy',
  'vinařství přímý prodej Morava',
  'pekařství kváskový chléb Česká republika',
  'bylinková farma Česká republika',
  'ovčí farma jehněčí Česká republika',
  'rybářství ryby přímý prodej Česká republika',
]

const TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'
const TEXT_SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.regularOpeningHours',
  'places.types',
  'places.addressComponents',
  'nextPageToken',
].join(',')

const RATE_LIMIT_MS = 200

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/á/g, 'a').replace(/č/g, 'c').replace(/ď/g, 'd').replace(/é/g, 'e')
    .replace(/ě/g, 'e').replace(/í/g, 'i').replace(/ň/g, 'n').replace(/ó/g, 'o')
    .replace(/ř/g, 'r').replace(/š/g, 's').replace(/ť/g, 't').replace(/ú/g, 'u')
    .replace(/ů/g, 'u').replace(/ý/g, 'y').replace(/ž/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function guessCategories(name, types) {
  const n = name.toLowerCase()
  const cats = []
  if (n.includes('zelen') || n.includes('salát') || n.includes('eco') || n.includes('eko')) cats.push('zelenina')
  if (n.includes('ovoce') || n.includes('sady') || n.includes('jahod')) cats.push('ovoce')
  if (n.includes('mas') || n.includes('řezn') || n.includes('jatky') || n.includes('ovce') || n.includes('prasata')) cats.push('maso')
  if (n.includes('mlék') || n.includes('dairy') || n.includes('kráv')) cats.push('mléko')
  if (n.includes('vejce') || n.includes('slepic') || n.includes('drůbež')) cats.push('vejce')
  if (n.includes('med') || n.includes('včel') || n.includes('beekeeper')) cats.push('med')
  if (n.includes('chléb') || n.includes('pekár') || n.includes('bake') || n.includes('pekař')) cats.push('chléb')
  if (n.includes('sýr') || n.includes('tvaroh')) cats.push('sýry')
  if (n.includes('vín') || n.includes('vinař') || n.includes('sklep')) cats.push('víno')
  if (n.includes('bylin') || n.includes('herb') || n.includes('lavend')) cats.push('byliny')
  if (n.includes('ryb') || n.includes('fish') || n.includes('kapr')) cats.push('ryby')
  if (cats.length === 0) cats.push('ostatní')
  return cats
}

function convertTime(t) {
  const [time, period] = t.trim().split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function mapOpeningHours(googleHours) {
  if (!googleHours?.weekdayDescriptions) return null
  const dayMap = {
    Monday: 'po', Tuesday: 'út', Wednesday: 'st',
    Thursday: 'čt', Friday: 'pá', Saturday: 'so', Sunday: 'ne',
  }
  const result = {}
  for (const desc of googleHours.weekdayDescriptions) {
    const colonIdx = desc.indexOf(': ')
    if (colonIdx === -1) continue
    const dayEn = desc.slice(0, colonIdx)
    const hours = desc.slice(colonIdx + 2)
    const dayCz = dayMap[dayEn]
    if (!dayCz || !hours || hours === 'Closed' || hours === 'Zavřeno') continue
    const parts = hours.split(' – ')
    if (parts.length !== 2) continue
    try {
      result[dayCz] = { open: convertTime(parts[0]), close: convertTime(parts[1]) }
    } catch {
      continue
    }
  }
  return Object.keys(result).length > 0 ? result : null
}

function generateDescription(place) {
  const name = place.displayName.text
  const cats = guessCategories(name, place.types || [])
  const catLabels = {
    zelenina: 'zeleniny', ovoce: 'ovoce', maso: 'masa', mléko: 'mléka',
    vejce: 'vajec', med: 'medu', chléb: 'pečiva', sýry: 'sýrů',
    víno: 'vína', byliny: 'bylin', ryby: 'ryb', ostatní: 'produktů',
  }
  const label = catLabels[cats[0]] || 'produktů'
  return `${name} nabízí přímý prodej ${label} z vlastní produkce. Nakupte čerstvé od farmáře bez prostředníků.`
}

const KRAJ_MAP = {
  'Jihočeský kraj': 'Jihočeský',
  'Jihomoravský kraj': 'Jihomoravský',
  'Karlovarský kraj': 'Karlovarský',
  'Královéhradecký kraj': 'Královéhradecký',
  'Liberecký kraj': 'Liberecký',
  'Moravskoslezský kraj': 'Moravskoslezský',
  'Olomoucký kraj': 'Olomoucký',
  'Pardubický kraj': 'Pardubický',
  'Plzeňský kraj': 'Plzeňský',
  'Praha': 'Praha',
  'Středočeský kraj': 'Středočeský',
  'Ústecký kraj': 'Ústecký',
  'Vysočina': 'Vysočina',
  'Zlínský kraj': 'Zlínský',
}

function mapPlaceToFarm(place) {
  const components = place.addressComponents || []
  const getComp = (type) =>
    components.find((c) => c.types?.includes(type))?.longText || ''

  const streetNumber = getComp('street_number')
  const route = getComp('route')
  const city =
    getComp('locality') ||
    getComp('postal_town') ||
    getComp('sublocality') ||
    getComp('administrative_area_level_2')
  const zip = getComp('postal_code').replace(/\s/g, ' ')
  const region = getComp('administrative_area_level_1')

  const categories = guessCategories(place.displayName.text, place.types || [])
  const openingHours = mapOpeningHours(place.regularOpeningHours)

  const contact = {}
  if (place.nationalPhoneNumber) contact.phone = place.nationalPhoneNumber
  if (place.websiteUri) contact.web = place.websiteUri.replace(/\/$/, '')

  return {
    id: randomUUID(),
    slug: slugify(place.displayName.text),
    name: place.displayName.text,
    description: generateDescription(place),
    categories,
    location: {
      lat: place.location.latitude,
      lng: place.location.longitude,
      address: [route, streetNumber].filter(Boolean).join(' ') ||
        (place.formattedAddress || '').split(',')[0].trim(),
      city: city || (place.formattedAddress || '').split(',')[1]?.trim() || '',
      kraj: KRAJ_MAP[region] || 'Středočeský',
      zip: zip || '000 00',
    },
    contact,
    openingHours,
    images: [],
    verified: false,
    createdAt: new Date().toISOString(),
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

async function textSearch(query, pageToken) {
  const body = {
    textQuery: query,
    languageCode: 'cs',
    regionCode: 'CZ',
    maxResultCount: 20,
  }
  if (pageToken) body.pageToken = pageToken

  const res = await fetch(TEXT_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': TEXT_SEARCH_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Text Search failed (${res.status}): ${err}`)
  }

  return res.json()
}

// ── SQL generation ────────────────────────────────────────────────────────────

function sqlStr(s) {
  return (s || '').replace(/'/g, "''")
}

function farmToSql(farm) {
  const loc = farm.location
  const cats = farm.categories.map((c) => `'${sqlStr(c)}'`).join(',')
  const contact = JSON.stringify(farm.contact).replace(/'/g, "''")
  const oh = farm.openingHours
    ? JSON.stringify(farm.openingHours).replace(/'/g, "''")
    : null
  const ohSql = oh ? `'${oh}'::jsonb` : 'NULL'

  return (
    `  (\n` +
    `    '${sqlStr(farm.slug)}',\n` +
    `    '${sqlStr(farm.name)}',\n` +
    `    '${sqlStr(farm.description)}',\n` +
    `    ARRAY[${cats}],\n` +
    `    ${loc.lat}, ${loc.lng},\n` +
    `    '${sqlStr(loc.address)}', '${sqlStr(loc.city)}', '${sqlStr(loc.kraj)}', '${sqlStr(loc.zip)}',\n` +
    `    '${contact}'::jsonb,\n` +
    `    ${ohSql},\n` +
    `    ARRAY['/images/placeholder-farm.jpg'], FALSE, '${farm.createdAt}'\n` +
    `  )`
  )
}

function generateSql(farms) {
  if (farms.length === 0) return '-- No new farms to insert\n'
  const values = farms.map(farmToSql).join(',\n')
  return (
    `-- Generated by scripts/import-farms-google.mjs\n` +
    `-- ${new Date().toISOString()}\n` +
    `-- ${farms.length} farms\n\n` +
    `INSERT INTO public.farms\n` +
    `  (slug, name, description, categories, lat, lng,\n` +
    `   address, city, kraj, zip, contact, opening_hours, images, verified, created_at)\n` +
    `VALUES\n` +
    `${values}\n` +
    `ON CONFLICT (slug) DO NOTHING;\n`
  )
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function isTooClose(a, b) {
  return (
    Math.abs(a.location.lat - b.location.lat) < 0.001 &&
    Math.abs(a.location.lng - b.location.lng) < 0.001
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Load existing farms to deduplicate against
  const existingPath = resolve(ROOT, 'src/data/farms.json')
  const existingFarms = existsSync(existingPath)
    ? JSON.parse(readFileSync(existingPath, 'utf-8'))
    : []
  const existingSlugs = new Set(existingFarms.map((f) => f.slug))

  const outputDir = resolve(__dirname, 'output')
  mkdirSync(outputDir, { recursive: true })

  const newFarms = []
  const seenPlaceIds = new Set()

  for (let qi = 0; qi < SEARCH_QUERIES.length; qi++) {
    const query = SEARCH_QUERIES[qi]
    console.log(`\n[${qi + 1}/${SEARCH_QUERIES.length}] Searching: "${query}"...`)

    let pageToken = undefined
    let page = 0
    let queryTotal = 0

    do {
      page++
      try {
        await sleep(RATE_LIMIT_MS)
        const result = await textSearch(query, pageToken)
        const places = result.places || []
        pageToken = result.nextPageToken

        if (page === 1) {
          console.log(`  ${places.length} results (page 1)`)
        } else {
          console.log(`  ${places.length} results (page ${page})`)
        }

        for (const place of places) {
          if (seenPlaceIds.has(place.id)) continue
          seenPlaceIds.add(place.id)

          const farm = mapPlaceToFarm(place)

          // Skip if slug exists in project data
          if (existingSlugs.has(farm.slug)) {
            console.log(`  [SKIP] slug "${farm.slug}" already exists`)
            continue
          }

          // Skip if too close to an already-added farm (duplicate location)
          const tooClose = newFarms.find((f) => isTooClose(f, farm))
          if (tooClose) {
            console.log(`  [SKIP] "${farm.name}" too close to "${tooClose.name}"`)
            continue
          }

          console.log(
            `  [ADD]  "${farm.name}" → ${farm.slug} (${farm.categories.join(', ')})`
          )
          newFarms.push(farm)
          existingSlugs.add(farm.slug) // prevent cross-query dupes
          queryTotal++
        }
      } catch (err) {
        console.error(`  [ERROR] ${err.message}`)
        break
      }
    } while (pageToken)

    console.log(`  → ${queryTotal} new farms from this query`)
  }

  // Write output files
  const jsonPath = resolve(outputDir, 'farms-imported.json')
  writeFileSync(jsonPath, JSON.stringify(newFarms, null, 2), 'utf-8')

  const sqlPath = resolve(outputDir, 'seed-imported.sql')
  writeFileSync(sqlPath, generateSql(newFarms), 'utf-8')

  console.log(`\nDone. ${newFarms.length} new farms added.`)
  console.log(`Output written to:`)
  console.log(`  ${jsonPath}`)
  console.log(`  ${sqlPath}`)
  console.log(`\nNext steps:`)
  console.log(`  1. Review scripts/output/farms-imported.json`)
  console.log(`  2. Run: npm run merge-farms   (merge into src/data/farms.json)`)
  console.log(`  OR paste seed-imported.sql into Supabase SQL Editor directly`)
}

main()
