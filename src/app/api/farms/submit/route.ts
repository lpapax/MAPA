import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { rateLimit, getIp } from '@/lib/rateLimit'

interface SubmitBody {
  name?: unknown
  description?: unknown
  categories?: unknown
  address?: unknown
  city?: unknown
  kraj?: unknown
  zip?: unknown
  phone?: unknown
  email?: unknown
  web?: unknown
  instagram?: unknown
  facebook?: unknown
  hours?: unknown
}

export async function POST(req: NextRequest) {
  // 3 submissions per IP per day — prevents spam that floods admin inbox
  if (!rateLimit(`farm-submit:${getIp(req)}`, { limit: 3, windowMs: 24 * 60 * 60_000 })) {
    return NextResponse.json({ success: false, error: 'Příliš mnoho požadavků. Zkuste to za chvíli.' }, { status: 429 })
  }

  let body: SubmitBody
  try {
    body = await req.json() as SubmitBody
  } catch {
    return NextResponse.json({ success: false, error: 'Neplatné tělo požadavku.' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const categories = Array.isArray(body.categories) ? body.categories : []
  const address = typeof body.address === 'string' ? body.address.trim() : ''
  const city = typeof body.city === 'string' ? body.city.trim() : ''
  const kraj = typeof body.kraj === 'string' ? body.kraj.trim() : ''
  const zip = typeof body.zip === 'string' ? body.zip.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const web = typeof body.web === 'string' ? body.web.trim() : ''
  const instagram = typeof body.instagram === 'string' ? body.instagram.trim() : ''
  const facebook = typeof body.facebook === 'string' ? body.facebook.trim() : ''
  const hours = body.hours && typeof body.hours === 'object' ? body.hours : {}

  if (!name || !description || categories.length === 0 || !address || !city || !kraj || !zip) {
    return NextResponse.json({ success: false, error: 'Chybí povinná pole.' }, { status: 422 })
  }
  if (!phone && !email) {
    return NextResponse.json({ success: false, error: 'Vyplňte alespoň telefon nebo e-mail.' }, { status: 422 })
  }

  const supabase = getSupabaseRaw()
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase as any)
      .from('pending_farms')
      .insert({
        name, description, categories, address, city, kraj, zip,
        phone, email, web, instagram, facebook, hours,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('[farms/submit] supabase error:', dbError.message)
      return NextResponse.json({ success: false, error: 'Chyba při uložení. Zkuste to prosím znovu.' }, { status: 500 })
    }
  }

  // Notify admin via Resend (optional)
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
        subject: `[Nová farma] ${name} — ${city}, ${kraj}`,
        text: `Nová žádost o přidání farmy:\n\nNázev: ${name}\nMěsto: ${city}\nKraj: ${kraj}\nKategorie: ${categories.join(', ')}\nKontakt: ${email || phone}\n\nPopis:\n${description}`,
      })
    } catch (err) {
      console.error('[farms/submit] resend error:', err)
    }
  }

  return NextResponse.json({ success: true })
}
