import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.startsWith('Bearer ')
    ? req.headers.get('authorization')!.slice(7)
    : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  // Verify user identity
  const { data: { user }, error: authErr } = await createClient(url, anonKey).auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient<any>(url, serviceKey)

  // Get this user's approved claims
  const { data: claims } = await sb
    .from('farm_claims')
    .select('farm_slug')
    .eq('user_id', user.id)
    .eq('status', 'approved')

  if (!claims || claims.length === 0) return NextResponse.json({ farms: [] })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slugs = claims.map((c: any) => c.farm_slug as string)

  const { data: farms } = await sb
    .from('farms')
    .select('id,slug,name,description,categories,city,kraj,images,verified,bio,delivery,pick_your_own,tier,opening_hours,contact')
    .in('slug', slugs)

  return NextResponse.json({ farms: farms ?? [] })
}
