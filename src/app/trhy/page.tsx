import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MarketsClient } from '@/components/trhy/MarketsClient'

export const metadata: Metadata = {
  title: 'Farmářské trhy – Mapa Farem',
  description: 'Přehled farmářských trhů v celé České republice. Filtrujte podle kraje a přidejte si termín do kalendáře.',
  keywords: ['farmářský trh', 'trh', 'bio trh', 'lokální trh', 'česká republika'],
}

export default function TrhyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-surface pb-20 pt-20">
        <MarketsClient />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
