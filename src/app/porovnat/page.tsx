import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { CompareClient } from '@/components/farms/CompareClient'
import { getAllFarms } from '@/lib/farms'

export const metadata: Metadata = {
  title: 'Porovnat farmy – Mapa Farem',
  description: 'Porovnejte až 3 farmy vedle sebe — kategorie, otevírací dobu, kontakt a kraj.',
}

interface PageProps {
  searchParams: { ids?: string }
}

export default async function PorovnatPage({ searchParams }: PageProps) {
  const ids = (searchParams.ids ?? '').split(',').filter(Boolean)
  const allFarms = await getAllFarms()
  const farms = allFarms.filter((f) => ids.includes(f.id))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Porovnat farmy</h1>
            <p className="text-neutral-500 text-sm">Srovnání {farms.length} {farms.length === 1 ? 'farmy' : 'farem'} vedle sebe.</p>
          </div>
          <CompareClient farms={farms} />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
