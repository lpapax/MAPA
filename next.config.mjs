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
    ],
  },

  // Security headers for production
  async headers() {
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
        ],
      },
    ]
  },
}

export default nextConfig
