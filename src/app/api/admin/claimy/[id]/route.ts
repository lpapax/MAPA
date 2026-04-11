import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getSupabaseServiceClient } from '@/lib/adminAuth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const body = await req.json()
  if (body.status !== 'approved' && body.status !== 'rejected') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  const status = body.status as 'approved' | 'rejected'

  const { data: claim, error: claimErr } = await sb
    .from('farm_claims')
    .select('farm_slug')
    .eq('id', params.id)
    .single()

  if (claimErr || !claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 })

  await sb.from('farm_claims').update({ status } as never).eq('id', params.id)

  if (status === 'approved') {
    await sb.from('farms').update({ tier: 'profesional' } as never).eq('slug', claim.farm_slug as string)
  }

  return NextResponse.json({ ok: true })
}
