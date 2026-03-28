import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'

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

export const metadata: Metadata = {
  title: {
    default: 'Mapa Farem – Nakupujte přímo od farmářů',
    template: '%s | Mapa Farem',
  },
  description:
    'Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé potraviny přímo ze dvora – zelenina, maso, mléko, med a stovky dalších produktů z celé ČR.',
  keywords: ['farma', 'farmářský trh', 'lokální potraviny', 'bio', 'mapa farem', 'čerstvé'],
  openGraph: {
    title: 'Mapa Farem',
    description: 'Nakupujte čerstvé potraviny přímo od českých farmářů.',
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'MapaFarem.cz',
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
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest focus:text-white focus:rounded-md focus:font-semibold focus:text-sm focus:shadow-lg"
        >
          Přejít na obsah
        </a>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div id="main-content">{children}</div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
