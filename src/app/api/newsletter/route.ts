import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  let email: string | undefined
  try {
    const body = await req.json() as { email?: unknown }
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined
  } catch {
    return NextResponse.json({ success: false, error: 'Neplatné tělo požadavku.' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Neplatná e-mailová adresa.' }, { status: 422 })
  }

  const supabase = getSupabaseClient()

  if (supabase) {
    // Try to save to Supabase `subscribers` table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('subscribers')
      .insert({ email, created_at: new Date().toISOString() })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Tento e-mail je již přihlášen k odběru.' }, { status: 409 })
      }
      return NextResponse.json({ success: false, error: 'Chyba při uložení. Zkuste to prosím znovu.' }, { status: 500 })
    }
  }
  // If no Supabase, we simply accept and return success (e.g. logged elsewhere)

  return NextResponse.json({ success: true })
}
