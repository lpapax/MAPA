import { NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'

async function verifyAdmin(req: Request): Promise<boolean> {
  const token = (req.headers.get('authorization') ?? '').replace('Bearer ', '')
  if (!token) return false
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false
  const sb = getSupabaseRaw()
  if (!sb) return false
  const { data: { user } } = await sb.auth.getUser(token)
  return user?.email === adminEmail
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const body = await req.json() as Record<string, unknown>
  const { data, error } = await sb
    .from('markets')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { error } = await sb.from('markets').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
