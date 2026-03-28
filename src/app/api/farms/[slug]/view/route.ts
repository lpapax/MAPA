import { NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'

export async function POST(_req: Request, { params }: { params: { slug: string } }) {
  const supabase = getSupabaseRaw()
  if (!supabase) return NextResponse.json({ ok: false }, { status: 503 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).rpc('increment_farm_view', { farm_slug: params.slug })
  return NextResponse.json({ ok: true })
}
