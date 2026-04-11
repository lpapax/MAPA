import { NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/adminAuth'
import { pickMarketFields } from '../marketFields'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const payload = pickMarketFields(await req.json() as Record<string, unknown>)
  const { data, error } = await sb
    .from('markets')
    .update(payload)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('[markets PUT]', error)
    return NextResponse.json({ error: 'Trh se nepodařilo aktualizovat.' }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { error } = await sb.from('markets').delete().eq('id', params.id)
  if (error) {
    console.error('[markets DELETE]', error)
    return NextResponse.json({ error: 'Trh se nepodařilo smazat.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
