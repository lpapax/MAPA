import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false
  const token = req.headers.get('authorization')?.startsWith('Bearer ')
    ? req.headers.get('authorization')!.slice(7)
    : null
  if (!token) return false
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  const { data: { user } } = await createClient(url, key).auth.getUser(token)
  return user?.email === adminEmail
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(url, key)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const sb = getServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { status } = await req.json() as { status: 'approved' | 'rejected' }

  // Get the claim to find which farm to update
  const { data: claim, error: claimErr } = await sb
    .from('farm_claims')
    .select('farm_slug')
    .eq('id', params.id)
    .single()

  if (claimErr || !claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 })

  // Update claim status
  await sb.from('farm_claims').update({ status } as never).eq('id', params.id)

  // If approved, upgrade the farm tier to 'profesional'
  if (status === 'approved') {
    await sb.from('farms').update({ tier: 'profesional' } as never).eq('slug', claim.farm_slug as string)
  }

  return NextResponse.json({ ok: true })
}
