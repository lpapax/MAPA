import type { Metadata, Viewport } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
