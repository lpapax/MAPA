import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { rateLimit, getIp } from '@/lib/rateLimit'

const SLUG_RE = /^[a-z0-9-]+$/

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  // Validate slug format before hitting the DB
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // 30 view increments per IP per hour across all farms — prevents leaderboard manipulation
  if (!rateLimit(`view:${getIp(req)}`, { limit: 30, windowMs: 60 * 60_000 })) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  const supabase = getSupabaseRaw()
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('increment_farm_view', { farm_slug: slug })
  return NextResponse.json({ ok: true })
}
