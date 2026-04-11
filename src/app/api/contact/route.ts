import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { rateLimit, getIp } from '@/lib/rateLimit'

interface ContactBody {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  if (!rateLimit(`contact:${ip}`, { limit: 3, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ success: false, error: 'Příliš mnoho požadavků. Zkuste to za hodinu.' }, { status: 429 })
  }

  let body: ContactBody
  try {
    body = await req.json() as ContactBody
  } catch {
    return NextResponse.json({ success: false, error: 'Neplatné tělo požadavku.' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ success: false, error: 'Chybí povinná pole.' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'Neplatný e-mail.' }, { status: 422 })
  }
  if (message.length < 20) {
    return NextResponse.json({ success: false, error: 'Zpráva je příliš krátká.' }, { status: 422 })
  }

  // Save to Supabase
  const supabase = getSupabaseRaw()
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from('contact_messages')
      .insert({ name, email, subject, message, created_at: new Date().toISOString() })

    if (dbError) {
      console.error('[contact] supabase error:', dbError.message)
      return NextResponse.json({ success: false, error: 'Chyba při uložení. Zkuste to prosím znovu.' }, { status: 500 })
    }
  }

  // Send email via Resend (optional — only if RESEND_API_KEY is set)
  const resendKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@mapafarem.cz'

  if (resendKey && adminEmail) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: `Mapa Farem <${fromEmail}>`,
        to: adminEmail,
        subject: `[Kontakt] ${subject} — od ${name}`,
        text: `Nová zpráva z kontaktního formuláře:\n\nJméno: ${name}\nE-mail: ${email}\nPředmět: ${subject}\n\nZpráva:\n${message}`,
      })
    } catch (err) {
      // Email failure is non-fatal — message already saved to Supabase
      console.error('[contact] resend error:', err)
    }
  }

  return NextResponse.json({ success: true })
}
