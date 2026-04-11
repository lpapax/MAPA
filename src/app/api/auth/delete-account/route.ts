import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server není správně nakonfigurován.' }, { status: 500 })
  }

  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Chybí přihlašovací token.' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anonKey) {
    return NextResponse.json({ error: 'Server není správně nakonfigurován.' }, { status: 500 })
  }

  // Verify the token belongs to a real user
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
  const { data: { user }, error: userError } = await userClient.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Neplatný token.' }, { status: 401 })
  }

  // Delete the user with service role key (CASCADE deletes all related rows)
  const adminClient = createClient(supabaseUrl, serviceKey)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

  if (deleteError) {
    console.error('[delete-account] Supabase error:', deleteError)
    return NextResponse.json({ error: 'Smazání účtu se nezdařilo. Zkuste to prosím znovu.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
