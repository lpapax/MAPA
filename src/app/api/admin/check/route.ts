import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return NextResponse.json({ admin: false }, { status: 403 })

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ admin: false }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.json({ admin: false }, { status: 500 })

  const supabase = createClient(url, key)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user || user.email !== adminEmail) {
    return NextResponse.json({ admin: false }, { status: 403 })
  }

  return NextResponse.json({ admin: true })
}
