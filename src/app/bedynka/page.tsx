import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { BedynkaClient } from '@/components/farms/BedynkaClient'

export const metadata: Metadata = {
  title: 'Moje bedýnka – Mapa Farem',
  description: 'Produkty uložené do vaší bedýnky z různých farem.',
}

export default function BedynkaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Moje bedýnka</h1>
            <p className="text-gray-500 text-sm">Produkty z různých farem přidané k objednávce.</p>
          </div>
          <BedynkaClient />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
