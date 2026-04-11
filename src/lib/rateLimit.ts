/**
 * In-memory sliding-window rate limiter.
 *
 * Works per-instance (no cross-Vercel-instance coordination). Sufficient for a
 * low-traffic farm directory. Upgrade to Upstash Redis if the site scales to
 * multiple concurrent serverless instances under sustained load.
 *
 * Usage:
 *   const allowed = rateLimit(ip, { limit: 10, windowMs: 60_000 })
 *   if (!allowed) return NextResponse.json({ error: '...' }, { status: 429 })
 */

interface Window {
  timestamps: number[]
}

// Global store — survives across requests within the same serverless instance.
// Entries are pruned on each check so memory is bounded.
const store = new Map<string, Window>()

interface Options {
  /** Max requests allowed within the window. */
  limit: number
  /** Window duration in milliseconds. */
  windowMs: number
}

/**
 * Returns true if the request is within the rate limit, false if it should be
 * rejected. `key` is typically the caller's IP address plus a route identifier.
 */
export function rateLimit(key: string, { limit, windowMs }: Options): boolean {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  // Prune timestamps outside the current window
  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs)

  if (entry.timestamps.length >= limit) {
    store.set(key, entry)
    return false
  }

  entry.timestamps.push(now)
  store.set(key, entry)
  return true
}

/** Convenience: extract the best available IP from a Next.js request. */
export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
