import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const next = req.nextUrl.searchParams.get('next') ?? '/profil'

  // No code — implicit flow will be handled client-side by page.tsx
  if (!code) {
    return NextResponse.redirect(new URL('/auth/callback', req.url))
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    return NextResponse.redirect(new URL('/prihlasit?error=config', req.url))
  }

  const cookieStore = cookies()

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component — cookies can't be set.
          // Session will be picked up on the next request.
        }
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(new URL('/prihlasit?error=auth', req.url))
  }

  // Sanitise redirect target — only allow same-origin paths
  const safeNext = next.startsWith('/') ? next : '/profil'
  return NextResponse.redirect(new URL(safeNext, req.url))
}
