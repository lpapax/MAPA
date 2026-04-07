import { NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json([], { status: 200 })

  const { data, error } = await sb
    .from('markets')
    .select('*')
    .eq('active', true)
    .order('id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  // Verify token belongs to admin
  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data: { user }, error: authErr } = await sb.auth.getUser(token)
  if (authErr || !user || user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as Record<string, unknown>
  const { data, error } = await sb.from('markets').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
