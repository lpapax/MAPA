import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MyReviewsClient } from '@/components/profil/MyReviewsClient'

export const metadata: Metadata = {
  title: 'Moje recenze – Mapa Farem',
  description: 'Recenze, které jste zanechali na farmách.',
}

export default function ProfilRecenzePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Moje recenze</h1>
            <p className="text-neutral-500 text-sm">Recenze, které jste zanechali na farmách.</p>
          </div>
          <MyReviewsClient />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
