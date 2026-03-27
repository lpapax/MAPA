/**
 * MAPA FAREM — Google Places Farm Importer (Full CZ Scan)
 *
 * SETUP:
 * 1. Go to https://console.cloud.google.com
 * 2. Enable "Places API (New)" for your project
 * 3. Create an API key, add to .env.local:
 *    GOOGLE_PLACES_API_KEY=AIza...
 * 4. Run: npm run import-farms
 *
 * STRATEGY:
 * 14 Czech regions × 15 farm-type queries = 210 location-restricted searches
 * Each search returns up to 60 results (3 pages × 20)
 * Total potential: ~12,000 farm listings covering all of CZ
 *
 * OUTPUT:
 * scripts/output/farms-imported.json → npm run merge-farms
 * scripts/output/seed-imported.sql   → paste into Supabase SQL Editor
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Config ────────────────────────────────────────────────────────────────────

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('Missing GOOGLE_PLACES_API_KEY in environment')
  console.error('Add to .env.local: GOOGLE_PLACES_API_KEY=AIza...')
  process.exit(1)
}

// 14 Czech kraje — center + search radius in meters
const REGIONS = [
  { name: 'Praha',              lat: 50.0755, lng: 14.4378, radius: 25000 },
  { name: 'Středočeský',        lat: 49.9500, lng: 14.8000, radius: 85000 },
  { name: 'Jihočeský',          lat: 49.1000, lng: 14.5000, radius: 85000 },
  { name: 'Plzeňský',           lat: 49.7000, lng: 13.4000, radius: 75000 },
  { name: 'Karlovarský',        lat: 50.2300, lng: 12.8700, radius: 50000 },
  { name: 'Ústecký',            lat: 50.6200, lng: 13.9000, radius: 65000 },
  { name: 'Liberecký',          lat: 50.7700, lng: 15.0500, radius: 45000 },
  { name: 'Královéhradecký',    lat: 50.3500, lng: 15.8300, radius: 60000 },
  { name: 'Pardubický',         lat: 49.9500, lng: 15.8000, radius: 60000 },
  { name: 'Vysočina',           lat: 49.4500, lng: 15.5900, radius: 75000 },
  { name: 'Jihomoravský',       lat: 49.0000, lng: 16.6000, radius: 75000 },
  { name: 'Olomoucký',          lat: 49.5900, lng: 17.2500, radius: 60000 },
  { name: 'Zlínský',            lat: 49.2300, lng: 17.6700, radius: 55000 },
  { name: 'Moravskoslezský',    lat: 49.8000, lng: 18.2500, radius: 65000 },
]

// 15 farm-type queries — run for each region
const FARM_QUERIES = [
  'farma přímý prodej',
  'ekofarma ekologické zemědělství',
  'biofarma bioprodukt',
  'zelinářství zelenina přímý prodej',
  'zahradnictví přímý prodej',
  'včelařství med prodej',
  'vinařství víno sklep',
  'pekařství kváskový chléb',
  'mlékárna sýry přímý prodej',
  'rybník ryby přímý prodej',
  'ovocné sady ovoce prodej',
  'chov ovcí jehněčí maso',
  'drůbežárna vejce přímý prodej',
  'rodinná farma maso prodej',
  'bylinková zahrada bylinky prodej',
]

const TEXT_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText'
const FIELD_MASK = [
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

const RATE_LIMIT_MS = 250 // between API calls

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/á/g,'a').replace(/č/g,'c').replace(/ď/g,'d').replace(/é/g,'e')
    .replace(/ě/g,'e').replace(/í/g,'i').replace(/ň/g,'n').replace(/ó/g,'o')
    .replace(/ř/g,'r').replace(/š/g,'s').replace(/ť/g,'t').replace(/ú/g,'u')
    .replace(/ů/g,'u').replace(/ý/g,'y').replace(/ž/g,'z')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-|-$/g,'')
}

function guessCategories(name, types) {
  const n = name.toLowerCase()
  const t = (types || []).join(' ').toLowerCase()
  const both = n + ' ' + t
  const cats = []
  if (both.includes('zelen') || both.includes('salát') || both.includes('zahradnictv')) cats.push('zelenina')
  if (both.includes('ovoce') || both.includes('sad') || both.includes('jahod') || both.includes('ovocn')) cats.push('ovoce')
  if (both.includes('mas') || both.includes('řezn') || both.includes('jatk') || both.includes('ovce') || both.includes('jehněč') || both.includes('pras') || both.includes('drůbež')) cats.push('maso')
  if (both.includes('mlék') || both.includes('dairy') || both.includes('kráv') || both.includes('mlékárn')) cats.push('mléko')
  if (both.includes('vejce') || both.includes('slepic') || both.includes('drůbež') || both.includes('kuř')) cats.push('vejce')
  if (both.includes('med') || both.includes('včel') || both.includes('apiár')) cats.push('med')
  if (both.includes('chléb') || both.includes('pekár') || both.includes('pekař') || both.includes('kvásk')) cats.push('chléb')
  if (both.includes('sýr') || both.includes('tvaroh') || both.includes('jogurt')) cats.push('sýry')
  if (both.includes('vín') || both.includes('vinař') || both.includes('sklep') || both.includes('hrozn')) cats.push('víno')
  if (both.includes('bylin') || both.includes('herb') || both.includes('lavend') || both.includes('koření')) cats.push('byliny')
  if (both.includes('ryb') || both.includes('fish') || both.includes('kapr') || both.includes('pstruh')) cats.push('ryby')
  if (cats.length === 0) cats.push('ostatní')
  return [...new Set(cats)]
}

function convertTime(t) {
  const [time, period] = t.trim().split(' ')
  if (!time) return null
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2,'0')}:${String(m || 0).padStart(2,'0')}`
}

function mapOpeningHours(googleHours) {
  if (!googleHours?.weekdayDescriptions) return null
  const dayMap = { Monday:'po', Tuesday:'út', Wednesday:'st', Thursday:'čt', Friday:'pá', Saturday:'so', Sunday:'ne' }
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
      const open = convertTime(parts[0])
      const close = convertTime(parts[1])
      if (open && close) result[dayCz] = { open, close }
    } catch { continue }
  }
  return Object.keys(result).length > 0 ? result : null
}

const KRAJ_MAP = {
  'Jihočeský kraj':'Jihočeský', 'Jihomoravský kraj':'Jihomoravský',
  'Karlovarský kraj':'Karlovarský', 'Královéhradecký kraj':'Královéhradecký',
  'Liberecký kraj':'Liberecký', 'Moravskoslezský kraj':'Moravskoslezský',
  'Olomoucký kraj':'Olomoucký', 'Pardubický kraj':'Pardubický',
  'Plzeňský kraj':'Plzeňský', 'Praha':'Praha',
  'Středočeský kraj':'Středočeský', 'Ústecký kraj':'Ústecký',
  'Vysočina':'Vysočina', 'Zlínský kraj':'Zlínský',
}

function mapPlaceToFarm(place, regionName) {
  const components = place.addressComponents || []
  const getComp = (type) => components.find((c) => c.types?.includes(type))?.longText || ''

  const streetNumber = getComp('street_number')
  const route = getComp('route')
  const city = getComp('locality') || getComp('postal_town') || getComp('sublocality') || getComp('administrative_area_level_2')
  const zip = getComp('postal_code')
  const region = getComp('administrative_area_level_1')

  const contact = {}
  if (place.nationalPhoneNumber) contact.phone = place.nationalPhoneNumber
  if (place.websiteUri) contact.web = place.websiteUri.replace(/\/$/, '')

  const categories = guessCategories(place.displayName.text, place.types)
  const catLabels = { zelenina:'zeleniny', ovoce:'ovoce', maso:'masa', mléko:'mléka', vejce:'vajec', med:'medu', chléb:'pečiva', sýry:'sýrů', víno:'vína', byliny:'bylin', ryby:'ryb', ostatní:'produktů' }
  const label = catLabels[categories[0]] || 'produktů'
  const description = `${place.displayName.text} nabízí přímý prodej ${label} z vlastní produkce. Nakupte čerstvé od farmáře bez prostředníků.`

  return {
    id: randomUUID(),
    slug: slugify(place.displayName.text),
    name: place.displayName.text,
    description,
    categories,
    location: {
      lat: place.location.latitude,
      lng: place.location.longitude,
      address: [route, streetNumber].filter(Boolean).join(' ') || (place.formattedAddress || '').split(',')[0].trim(),
      city: city || (place.formattedAddress || '').split(',')[1]?.trim() || '',
      kraj: KRAJ_MAP[region] || regionName,
      zip: zip || '',
    },
    contact,
    openingHours: mapOpeningHours(place.regularOpeningHours),
    images: [],
    verified: false,
    createdAt: new Date().toISOString(),
  }
}

// ── API ───────────────────────────────────────────────────────────────────────

async function textSearch(query, region, pageToken) {
  const body = {
    textQuery: query,
    languageCode: 'cs',
    regionCode: 'CZ',
    maxResultCount: 20,
    locationBias: {
      circle: {
        center: { latitude: region.lat, longitude: region.lng },
        radius: region.radius,
      },
    },
  }
  if (pageToken) body.pageToken = pageToken

  const res = await fetch(TEXT_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(`${res.status}: ${err.error?.message || res.statusText}`)
  }

  return res.json()
}

// ── SQL output ────────────────────────────────────────────────────────────────

function sqlStr(s) { return (s || '').replace(/'/g, "''") }

function farmToSqlRow(f) {
  const loc = f.location
  const cats = f.categories.map((c) => `'${sqlStr(c)}'`).join(',')
  const contact = JSON.stringify(f.contact).replace(/'/g, "''")
  const oh = f.openingHours ? JSON.stringify(f.openingHours).replace(/'/g, "''") : null
  return (
    `  ('${sqlStr(f.slug)}', '${sqlStr(f.name)}', '${sqlStr(f.description)}',\n` +
    `   ARRAY[${cats}], ${loc.lat}, ${loc.lng},\n` +
    `   '${sqlStr(loc.address)}', '${sqlStr(loc.city)}', '${sqlStr(loc.kraj)}', '${sqlStr(loc.zip)}',\n` +
    `   '${contact}'::jsonb, ${oh ? `'${oh}'::jsonb` : 'NULL'},\n` +
    `   ARRAY['/images/placeholder-farm.jpg'], FALSE, '${f.createdAt}')`
  )
}

function generateSql(farms) {
  if (farms.length === 0) return '-- No new farms\n'
  return (
    `-- Generated ${new Date().toISOString()} — ${farms.length} farms\n\n` +
    `INSERT INTO public.farms\n` +
    `  (slug, name, description, categories, lat, lng,\n` +
    `   address, city, kraj, zip, contact, opening_hours, images, verified, created_at)\nVALUES\n` +
    farms.map(farmToSqlRow).join(',\n') +
    `\nON CONFLICT (slug) DO NOTHING;\n`
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const existingPath = resolve(ROOT, 'src/data/farms.json')
  const existing = existsSync(existingPath) ? JSON.parse(readFileSync(existingPath, 'utf-8')) : []
  const existingSlugs = new Set(existing.map((f) => f.slug))

  // Also load previous import output to resume without duplicates
  const prevOutputPath = resolve(__dirname, 'output/farms-imported.json')
  const prevImported = existsSync(prevOutputPath) ? JSON.parse(readFileSync(prevOutputPath, 'utf-8')) : []
  prevImported.forEach((f) => existingSlugs.add(f.slug))

  const outputDir = resolve(__dirname, 'output')
  mkdirSync(outputDir, { recursive: true })

  const newFarms = [...prevImported] // start from previous run
  const seenPlaceIds = new Set()
  const totalQueries = REGIONS.length * FARM_QUERIES.length
  let queryNum = 0
  let errors = 0

  console.log(`Starting full CZ scan: ${REGIONS.length} regions × ${FARM_QUERIES.length} queries = ${totalQueries} searches`)
  console.log(`Existing farms in project: ${existing.length}`)
  console.log(`Previously imported (resuming): ${prevImported.length}\n`)

  for (const region of REGIONS) {
    console.log(`\n── ${region.name} ──────────────────────────────`)

    for (const query of FARM_QUERIES) {
      queryNum++
      process.stdout.write(`  [${queryNum}/${totalQueries}] "${query}"... `)

      let pageToken = undefined
      let page = 0
      let added = 0

      do {
        try {
          await sleep(RATE_LIMIT_MS)
          const result = await textSearch(query, region, pageToken)
          const places = result.places || []
          pageToken = result.nextPageToken
          page++

          for (const place of places) {
            if (seenPlaceIds.has(place.id)) continue
            seenPlaceIds.add(place.id)

            const farm = mapPlaceToFarm(place, region.name)

            if (existingSlugs.has(farm.slug)) continue

            // Skip if too close to existing farm (0.001° ≈ 100m)
            const tooClose = newFarms.find(
              (f) => Math.abs(f.location.lat - farm.location.lat) < 0.001 &&
                     Math.abs(f.location.lng - farm.location.lng) < 0.001
            )
            if (tooClose) continue

            newFarms.push(farm)
            existingSlugs.add(farm.slug)
            added++
          }

          if (!pageToken) break
        } catch (err) {
          errors++
          console.log(`ERROR: ${err.message}`)
          break
        }
      } while (pageToken && page < 3)

      console.log(`+${added} (total: ${newFarms.length})`)

      // Save progress after each query in case of interruption
      writeFileSync(prevOutputPath, JSON.stringify(newFarms, null, 2), 'utf-8')
    }
  }

  // Write final output
  const sqlPath = resolve(outputDir, 'seed-imported.sql')
  writeFileSync(sqlPath, generateSql(newFarms), 'utf-8')

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Done. ${newFarms.length} total farms collected (${errors} query errors).`)
  console.log(`\nOutput:`)
  console.log(`  ${prevOutputPath}`)
  console.log(`  ${sqlPath}`)
  console.log(`\nNext:`)
  console.log(`  npm run merge-farms   → merge into src/data/farms.json`)
  console.log(`  OR paste seed-imported.sql into Supabase SQL Editor`)
}

main()
