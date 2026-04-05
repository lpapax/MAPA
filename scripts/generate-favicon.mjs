import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const svgContent = readFileSync(resolve(root, 'src/app/icon.svg'))

// Generate PNG sizes for apple-touch-icon and og
const sizes = [16, 32, 48, 180, 192, 512]
for (const size of sizes) {
  const out = resolve(root, `public/icons/icon-${size}.png`)
  await sharp(svgContent)
    .resize(size, size)
    .png()
    .toFile(out)
  console.log(`✓ ${out}`)
}

// favicon.ico = 16x16 + 32x32 + 48x48 bundled
// Sharp doesn't produce .ico natively — write a multi-size PNG as fallback
// and produce favicon.ico via raw ICO container around the 32x32 PNG
const png32 = await sharp(svgContent).resize(32, 32).png().toBuffer()
const png16 = await sharp(svgContent).resize(16, 16).png().toBuffer()
const png48 = await sharp(svgContent).resize(48, 48).png().toBuffer()

// Build minimal ICO file (ICONDIR + 3 ICONDIRENTRY + image data)
function buildIco(images) {
  // images: Array of { width, height, buffer }
  const count = images.length
  const headerSize = 6 // ICONDIR
  const entrySize = 16 // ICONDIRENTRY per image
  const dataOffset = headerSize + entrySize * count

  const entries = []
  let offset = dataOffset
  for (const img of images) {
    entries.push({ ...img, offset })
    offset += img.buffer.length
  }

  const totalSize = offset
  const buf = Buffer.alloc(totalSize)
  let pos = 0

  // ICONDIR
  buf.writeUInt16LE(0, pos); pos += 2       // reserved
  buf.writeUInt16LE(1, pos); pos += 2       // type: 1 = ICO
  buf.writeUInt16LE(count, pos); pos += 2   // image count

  // ICONDIRENTRY for each image
  for (const e of entries) {
    buf.writeUInt8(e.width >= 256 ? 0 : e.width, pos); pos++
    buf.writeUInt8(e.height >= 256 ? 0 : e.height, pos); pos++
    buf.writeUInt8(0, pos); pos++           // color count
    buf.writeUInt8(0, pos); pos++           // reserved
    buf.writeUInt16LE(1, pos); pos += 2     // planes
    buf.writeUInt16LE(32, pos); pos += 2    // bit count
    buf.writeUInt32LE(e.buffer.length, pos); pos += 4
    buf.writeUInt32LE(e.offset, pos); pos += 4
  }

  // Image data
  for (const e of entries) {
    e.buffer.copy(buf, e.offset)
  }

  return buf
}

const ico = buildIco([
  { width: 16, height: 16, buffer: png16 },
  { width: 32, height: 32, buffer: png32 },
  { width: 48, height: 48, buffer: png48 },
])

const icoPath = resolve(root, 'public/favicon.ico')
writeFileSync(icoPath, ico)
console.log(`✓ ${icoPath}`)

// Also write apple-touch-icon
const appleIconPath = resolve(root, 'public/apple-touch-icon.png')
writeFileSync(appleIconPath, await sharp(svgContent).resize(180, 180).png().toBuffer())
console.log(`✓ ${appleIconPath}`)

console.log('\nDone.')
