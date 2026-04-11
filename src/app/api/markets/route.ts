import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/adminAuth'
import { pickMarketFields } from './marketFields'

const MARKET_COLUMNS = 'id,name,city,region,lat,lng,schedule,time,vendors,tags,is_daily,dow,active'

export async function GET(req: NextRequest) {
  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json([], { status: 200 })

  const isAdmin = await verifyAdmin(req)

  let query = sb
    .from('markets')
    .select(MARKET_COLUMNS)
    .order('id', { ascending: true })

  if (!isAdmin) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('[markets GET]', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst trhy.' }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const sb = getSupabaseRaw()
  if (!sb) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { data: { user }, error: authErr } = await sb.auth.getUser(token)
  if (authErr || !user || user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payload = pickMarketFields(await req.json() as Record<string, unknown>)
  const { data, error } = await sb.from('markets').insert([payload]).select().single()
  if (error) {
    console.error('[markets POST]', error)
    return NextResponse.json({ error: 'Trh se nepodařilo vytvořit.' }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
