import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { GTMScript } from '@/components/ui/GTMScript'
import { Analytics } from '@vercel/analytics/next'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mapafarem.cz'

export const metadata: Metadata = {
  title: {
    default: 'Mapa Farem – Nakupujte přímo od farmářů',
    template: '%s | Mapa Farem',
  },
  description:
    'Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé potraviny přímo ze dvora – zelenina, maso, mléko, med a stovky dalších produktů z celé ČR.',
  keywords: ['farma', 'farmářský trh', 'lokální potraviny', 'bio', 'mapa farem', 'čerstvé potraviny', 'česká republika'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Mapa Farem – Nakupujte přímo od farmářů',
    description: 'Nakupujte čerstvé, lokální potraviny přímo od českých farmářů. 3 960+ farem v celé ČR.',
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'MapaFarem.cz',
    url: SITE_URL,
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Mapa Farem – Nakupujte přímo od českých farmářů',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mapa Farem – Nakupujte přímo od farmářů',
    description: 'Nakupujte čerstvé, lokální potraviny přímo od českých farmářů.',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2d6b23',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <GTMScript />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest focus:text-white focus:rounded-md focus:font-semibold focus:text-sm focus:shadow-lg"
        >
          Přejít na obsah
        </a>
        <Analytics />
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div id="main-content">{children}</div>
              <CookieConsent />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
