import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { FavoritesClient } from '@/components/farms/FavoritesClient'

export const metadata: Metadata = {
  title: 'Oblíbené farmy – Mapa Farem',
  description: 'Vaše uložené oblíbené farmy z celé České republiky.',
}

export default function OblibeneePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Oblíbené farmy</h1>
            <p className="text-gray-500 text-sm">Farmy, které jste si uložili srdíčkem.</p>
          </div>
          <FavoritesClient />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
