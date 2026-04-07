import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_FIELDS = new Set([
  'description', 'categories', 'opening_hours', 'contact', 'images',
  'bio', 'delivery', 'pick_your_own',
])

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const token = req.headers.get('authorization')?.startsWith('Bearer ')
    ? req.headers.get('authorization')!.slice(7)
    : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  // Verify identity
  const { data: { user }, error: authErr } = await createClient(url, anonKey).auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient<any>(url, serviceKey)

  // Verify ownership — must have approved claim for this slug
  const { data: claim } = await sb
    .from('farm_claims')
    .select('id')
    .eq('user_id', user.id)
    .eq('farm_slug', params.slug)
    .eq('status', 'approved')
    .single()

  if (!claim) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Strip any fields the farmer shouldn't be able to change
  const body = await req.json() as Record<string, unknown>
  const update = Object.fromEntries(
    Object.entries(body).filter(([k]) => ALLOWED_FIELDS.has(k)),
  )

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await sb.from('farms').update(update).eq('slug', params.slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
