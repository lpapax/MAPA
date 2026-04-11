import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getSupabaseServiceClient } from '@/lib/adminAuth'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function geocode(name: string, city: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return null
  try {
    const query = encodeURIComponent(`${name} ${city} Czech Republic`)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}`,
    )
    const json = await res.json()
    const loc = json?.results?.[0]?.geometry?.location
    if (loc?.lat && loc?.lng) return { lat: loc.lat, lng: loc.lng }
  } catch {
    // ignore geocode failures — coords fall back to CZ centroid
  }
  return null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const body = await req.json() as { action: 'approve' | 'reject'; note?: string }

  if (body.action !== 'approve' && body.action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  if (body.action === 'reject') {
    const { error } = await sb
      .from('pending_farms')
      .update({ status: 'rejected' })
      .eq('id', params.id)
    if (error) {
      console.error('[admin/zadosti PATCH reject]', error)
      return NextResponse.json({ error: 'Žádost se nepodařilo zamítnout.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  // approve
  const { data: row, error: fetchErr } = await sb
    .from('pending_farms')
    .select('*')
    .eq('id', params.id)
    .single()

  if (fetchErr || !row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Generate unique slug
  let slug = slugify(row.name as string)
  const { data: existing } = await sb.from('farms').select('slug').eq('slug', slug).single()
  if (existing) slug = `${slug}-${params.id}`

  // Geocode
  const geo = await geocode(row.name as string, row.city as string)
  const lat = geo?.lat ?? 49.8
  const lng = geo?.lng ?? 15.5

  const { error: insertErr } = await sb.from('farms').insert({
    slug,
    name: row.name,
    description: row.description,
    categories: row.categories,
    address: row.address,
    city: row.city,
    kraj: row.kraj,
    zip: row.zip,
    contact: {
      phone: row.phone ?? null,
      email: row.email ?? null,
      web: row.web ?? null,
      instagram: row.instagram ?? null,
      facebook: row.facebook ?? null,
    },
    opening_hours: row.hours ?? null,
    lat,
    lng,
    images: [],
    verified: true,
    tier: 'free',
    view_count: 0,
  } as unknown as Record<string, unknown>)

  if (insertErr) {
    console.error('[admin/zadosti PATCH approve insert]', insertErr)
    return NextResponse.json({ error: 'Farmu se nepodařilo schválit.' }, { status: 500 })
  }

  await sb.from('pending_farms').update({ status: 'approved' }).eq('id', params.id)

  return NextResponse.json({ ok: true, slug })
}
