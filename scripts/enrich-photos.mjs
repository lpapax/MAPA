/**
 * MAPA FAREM — Farm Photo Enrichment
 *
 * Scrapes og:image from farm websites and updates farms-imported.json.
 * Also generates SQL UPDATEs for Supabase.
 *
 * Usage: node scripts/enrich-photos.mjs
 *
 * Strategy:
 * 1. For each farm with a website URL → fetch the page HTML
 * 2. Extract og:image / twitter:image meta tag
 * 3. Validate the URL (https, reasonable length)
 * 4. Save progress incrementally
 * 5. Output: enriched farms-imported.json + enrich-photos.sql
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const IMPORTED_PATH = resolve(__dirname, 'output/farms-imported.json')
const OUTPUT_SQL_PATH = resolve(__dirname, 'output/enrich-photos.sql')

const CONCURRENCY = 20     // parallel requests
const TIMEOUT_MS  = 6000   // per request
const SAVE_EVERY  = 50     // save progress every N farms processed
const USER_AGENT  = 'Mozilla/5.0 (compatible; MapaFarem/1.0; +https://mapafarem.cz)'

// ── Helpers ────────────────────────────────────────────────────────────────

function extractOgImage(html) {
  // Standard og:image
  const patterns = [
    /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ]
  for (const pattern of patterns) {
    const m = html.match(pattern)
    if (m?.[1]) {
      const url = m[1].trim()
      if (url.startsWith('http')) return url
    }
  }
  return null
}

function extractDescription(html) {
  // Try og:description first, then meta description
  const patterns = [
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{20,300})["']/i,
    /<meta[^>]+content=["']([^"']{20,300})["'][^>]+property=["']og:description["']/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{20,300})["']/i,
    /<meta[^>]+content=["']([^"']{20,300})["'][^>]+name=["']description["']/i,
  ]
  for (const pattern of patterns) {
    const m = html.match(pattern)
    if (m?.[1]) {
      const desc = m[1].trim().replace(/\s+/g, ' ')
      if (desc.length > 30) return desc
    }
  }
  return null
}

function isValidImageUrl(url) {
  if (!url) return false
  if (!url.startsWith('https://')) return false
  if (url.length > 500) return false
  // Skip data URIs, SVGs used as og:image, tracking pixels
  if (url.includes('data:') || url.endsWith('.svg')) return false
  // Skip logo images (heuristic)
  const lower = url.toLowerCase()
  if (lower.includes('logo') || lower.includes('favicon') || lower.includes('icon')) return false
  return true
}

function resolveUrl(base, url) {
  if (!url) return null
  try {
    return new URL(url, base).toString()
  } catch {
    return null
  }
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    // Read only first 100KB — enough for meta tags
    const reader = res.body.getReader()
    const chunks = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      total += value.length
      if (total > 100_000) { reader.cancel(); break }
    }
    return Buffer.concat(chunks).toString('utf-8')
  } catch {
    return null
  } finally {
    clearTimeout(id)
  }
}

function sqlStr(s) { return (s || '').replace(/'/g, "''") }

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(IMPORTED_PATH)) {
    console.error('farms-imported.json not found. Run: npm run import-farms')
    process.exit(1)
  }

  const farms = JSON.parse(readFileSync(IMPORTED_PATH, 'utf-8'))
  const toProcess = farms.filter(
    (f) => f.contact?.web && (!f.images || f.images.length === 0 || f.images[0].includes('placeholder'))
  )
  const noWeb = farms.length - toProcess.length
  const alreadyHasPhoto = farms.filter(f => f.images?.length > 0 && !f.images[0].includes('placeholder')).length

  console.log(`Total farms: ${farms.length}`)
  console.log(`Already have photos: ${alreadyHasPhoto}`)
  console.log(`No website: ${noWeb - alreadyHasPhoto}`)
  console.log(`To process (have website, no photo): ${toProcess.length}`)
  console.log(`Concurrency: ${CONCURRENCY}, Timeout: ${TIMEOUT_MS}ms\n`)

  let processed = 0
  let found = 0
  let descUpdated = 0
  const results = new Map() // slug → { images, description }

  async function enrichFarm(farm) {
    const webUrl = farm.contact.web.startsWith('http')
      ? farm.contact.web
      : `https://${farm.contact.web}`

    const html = await fetchWithTimeout(webUrl, TIMEOUT_MS)
    if (!html) return

    let imageUrl = extractOgImage(html)
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = resolveUrl(webUrl, imageUrl)
    }
    if (!isValidImageUrl(imageUrl)) imageUrl = null

    const desc = extractDescription(html)

    if (imageUrl || desc) {
      results.set(farm.slug, {
        images: imageUrl ? [imageUrl] : null,
        description: desc,
      })
      if (imageUrl) found++
      if (desc) descUpdated++
    }
  }

  // Process in batches of CONCURRENCY
  for (let i = 0; i < toProcess.length; i += CONCURRENCY) {
    const batch = toProcess.slice(i, i + CONCURRENCY)
    await Promise.allSettled(batch.map(enrichFarm))
    processed += batch.length

    const pct = Math.round((processed / toProcess.length) * 100)
    process.stdout.write(`\r[${pct}%] ${processed}/${toProcess.length} processed — ${found} photos found, ${descUpdated} descriptions`)

    // Save progress
    if (processed % SAVE_EVERY === 0 || processed === toProcess.length) {
      const updated = farms.map((f) => {
        const r = results.get(f.slug)
        if (!r) return f
        return {
          ...f,
          ...(r.images ? { images: r.images } : {}),
          ...(r.description ? { description: r.description } : {}),
        }
      })
      writeFileSync(IMPORTED_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    }
  }

  console.log(`\n\nDone! ${found} photos + ${descUpdated} descriptions enriched out of ${toProcess.length} farms.`)

  // Generate final updated JSON
  const finalFarms = farms.map((f) => {
    const r = results.get(f.slug)
    if (!r) return f
    return {
      ...f,
      ...(r.images ? { images: r.images } : {}),
      ...(r.description ? { description: r.description } : {}),
    }
  })
  writeFileSync(IMPORTED_PATH, JSON.stringify(finalFarms, null, 2), 'utf-8')

  // Generate SQL UPDATE for Supabase
  const enriched = finalFarms.filter((f) => results.has(f.slug))
  const sqlLines = enriched.map((f) => {
    const r = results.get(f.slug)
    const parts = []
    if (r.images) {
      const imgArr = r.images.map(url => `'${sqlStr(url)}'`).join(',')
      parts.push(`images = ARRAY[${imgArr}]`)
    }
    if (r.description) {
      parts.push(`description = '${sqlStr(r.description)}'`)
    }
    if (parts.length === 0) return null
    return `UPDATE public.farms SET ${parts.join(', ')} WHERE slug = '${sqlStr(f.slug)}';`
  }).filter(Boolean)

  const sql = `-- Generated ${new Date().toISOString()} — ${sqlLines.length} updates\n-- Paste into Supabase SQL Editor\n\n` + sqlLines.join('\n') + '\n'
  writeFileSync(OUTPUT_SQL_PATH, sql, 'utf-8')

  console.log(`\nOutput files:`)
  console.log(`  ${IMPORTED_PATH}  (updated)`)
  console.log(`  ${OUTPUT_SQL_PATH}  (${sqlLines.length} SQL UPDATE rows)`)
  console.log(`\nNext steps:`)
  console.log(`  1. Review output/enrich-photos.sql`)
  console.log(`  2. Paste into Supabase SQL Editor to update the database`)
  console.log(`  3. Run: npm run merge-farms   to update src/data/farms.json`)
}

main().catch(console.error)
