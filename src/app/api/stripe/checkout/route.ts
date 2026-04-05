import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Platby nejsou momentálně dostupné.' },
      { status: 503 }
    )
  }

  // Verify auth
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: 'Nepřihlášený uživatel.' }, { status: 401 })
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Databáze není dostupná.' }, { status: 503 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Neplatný token.' }, { status: 401 })
  }

  // Validate body
  let farm_slug: string
  let price_id: string
  try {
    const body = await req.json()
    if (
      typeof body?.farm_slug !== 'string' || body.farm_slug.trim() === '' ||
      typeof body?.price_id !== 'string' || !body.price_id.startsWith('price_')
    ) {
      return NextResponse.json({ error: 'Neplatná data požadavku.' }, { status: 400 })
    }
    farm_slug = body.farm_slug.trim()
    price_id = body.price_id
  } catch {
    return NextResponse.json({ error: 'Neplatná data požadavku.' }, { status: 400 })
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mapafarem.cz'

  const stripe = new Stripe(secretKey, { apiVersion: '2025-03-31.basil' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      metadata: { farm_slug, user_id: user.id },
      success_url: `${baseUrl}/pro-farmary?upgrade=success`,
      cancel_url: `${baseUrl}/pro-farmary#pricing`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (err: unknown) {
    console.error('[stripe/checkout] Stripe error:', err)
    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit platbu.' },
      { status: 500 }
    )
  }
}
