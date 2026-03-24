import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Returns null when env vars are not configured (dev / pre-Supabase setup).
 * farms.ts falls back to the JSON seed file in that case.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Singleton for client-side usage
let _client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClientSingleton() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!_client) {
    _client = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _client
}
