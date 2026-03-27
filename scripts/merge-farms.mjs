/**
 * MAPA FAREM — Farm Merge Script
 *
 * Merges scripts/output/farms-imported.json into src/data/farms.json.
 * Deduplicates by slug. Safe to run multiple times.
 *
 * Usage: npm run merge-farms
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const existingPath = resolve(ROOT, 'src/data/farms.json')
const importedPath = resolve(__dirname, 'output/farms-imported.json')

if (!existsSync(importedPath)) {
  console.error('No imported farms found at scripts/output/farms-imported.json')
  console.error('Run: npm run import-farms')
  process.exit(1)
}

const existing = JSON.parse(readFileSync(existingPath, 'utf-8'))
const imported = JSON.parse(readFileSync(importedPath, 'utf-8'))

const existingSlugs = new Set(existing.map((f) => f.slug))
const toAdd = imported.filter((f) => !existingSlugs.has(f.slug))

if (toAdd.length === 0) {
  console.log('Nothing to merge — all imported farms already exist in farms.json')
  process.exit(0)
}

const merged = [...existing, ...toAdd]
writeFileSync(existingPath, JSON.stringify(merged, null, 2), 'utf-8')

console.log(`Added ${toAdd.length} farms. Total: ${merged.length} farms.`)
console.log('src/data/farms.json updated.')
