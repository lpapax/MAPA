import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { HistorieClient } from '@/components/profil/HistorieClient'

export const metadata: Metadata = {
  title: 'Historie návštěv – Mapa Farem',
  description: 'Naposledy zobrazené farmy.',
}

export default function ProfilHistoriePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Historie návštěv</h1>
            <p className="text-neutral-500 text-sm">Naposledy zobrazené farmy.</p>
          </div>
          <HistorieClient />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
