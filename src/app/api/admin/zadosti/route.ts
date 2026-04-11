import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getSupabaseServiceClient } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const status = new URL(req.url).searchParams.get('status') ?? 'pending'
  let query = sb
    .from('pending_farms')
    .select('*')
    .order('created_at', { ascending: false })

  if (status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) {
    console.error('[admin/zadosti GET]', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst žádosti.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}
