import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

/**
 * Returns true only when the request carries a valid Bearer token belonging
 * to the ADMIN_EMAIL address. All admin API routes must call this before
 * processing any data.
 */
export async function verifyAdmin(req: NextRequest | Request): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return false

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false

  const { data: { user } } = await createClient(url, key).auth.getUser(token)
  return user?.email === adminEmail
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = ReturnType<typeof createClient<any>>

/**
 * Service-role Supabase client for admin mutations that bypass RLS.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY is not configured.
 */
export function getSupabaseServiceClient(): AnyClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createClient<any>(url, key)
}
