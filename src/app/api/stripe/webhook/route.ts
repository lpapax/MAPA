import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseRaw } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Tier = 'free' | 'profesional' | 'premium'

function getTierFromPriceId(priceId: string): Tier {
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return 'premium'
  if (priceId === process.env.STRIPE_PRICE_PROFESIONAL) return 'profesional'
  return 'free' // unknown price — do not grant paid tier
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Webhooks nejsou nakonfigurovány.' }, { status: 503 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Chybí podpis.' }, { status: 400 })
  }

  const body = await req.text()
  const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = getSupabaseRaw()
  if (!supabase) {
    // Return 200 so Stripe doesn't retry — DB available in production
    console.error('[stripe/webhook] Supabase not configured')
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { farm_slug, user_id } = session.metadata ?? {}
        if (!farm_slug || !user_id) break

        const subscriptionId = session.subscription as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as any
        const priceId: string = sub.items?.data[0]?.price?.id ?? ''
        const tier = getTierFromPriceId(priceId)
        const periodEnd = sub.current_period_end
          ? new Date((sub.current_period_end as number) * 1000).toISOString()
          : null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('subscriptions')
          .upsert(
            {
              user_id,
              farm_slug,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: priceId,
              tier,
              status: 'active',
              current_period_end: periodEnd,
            },
            { onConflict: 'stripe_subscription_id' }
          )

        await supabase.from('farms').update({ tier }).eq('slug', farm_slug)
        break
      }

      case 'customer.subscription.updated': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = event.data.object as any
        const priceId: string = sub.items?.data[0]?.price?.id ?? ''
        const tier = getTierFromPriceId(priceId)
        const periodEnd = sub.current_period_end
          ? new Date((sub.current_period_end as number) * 1000).toISOString()
          : null

        // Fetch farm_slug and update subscription row in parallel — both target the same row by id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [{ data: row }] = await Promise.all([
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any).from('subscriptions').select('farm_slug').eq('stripe_subscription_id', sub.id).single(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any).from('subscriptions').update({ tier, status: sub.status, current_period_end: periodEnd, stripe_price_id: priceId }).eq('stripe_subscription_id', sub.id),
        ])

        if (row?.farm_slug) {
          await supabase.from('farms').update({ tier }).eq('slug', row.farm_slug as string)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = event.data.object as any

        // Fetch farm_slug and mark canceled in parallel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [{ data: row }] = await Promise.all([
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any).from('subscriptions').select('farm_slug').eq('stripe_subscription_id', sub.id).single(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase as any).from('subscriptions').update({ status: 'canceled' }).eq('stripe_subscription_id', sub.id),
        ])

        if (row?.farm_slug) {
          await supabase.from('farms').update({ tier: 'free' }).eq('slug', row.farm_slug as string)
        }
        break
      }
    }
  } catch (err: unknown) {
    console.error('[stripe/webhook] Handler error:', err)
    // Still return 200 — Stripe must not retry for app-layer errors
  }

  return NextResponse.json({ received: true })
}
