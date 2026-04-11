/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mapbox GL JS uses browser APIs — must be transpiled for Next.js bundler
  transpilePackages: ['mapbox-gl'],

  // Remote image domains allowed in <Image />
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mapafarem.cz',
      },
      {
        // Supabase Storage bucket (update <project-ref> after project creation)
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Unsplash photos for UI/design
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Security headers for production
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js requires unsafe-inline for its runtime scripts; unsafe-eval needed by Mapbox GL
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      // Supabase, Mapbox, Stripe, GTM, analytics
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com wss://*.mapbox.com https://api.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      // Mapbox workers use blob: URLs
      "worker-src blob:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
