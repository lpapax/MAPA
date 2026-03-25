import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'

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
  themeColor: '#059669',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-xl focus:font-semibold focus:text-sm focus:shadow-lg"
        >
          Přejít na obsah
        </a>
        <ToastProvider>
          <div id="main-content">{children}</div>
        </ToastProvider>
      </body>
    </html>
  )
}
