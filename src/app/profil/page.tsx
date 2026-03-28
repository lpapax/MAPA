import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { ProfilClient } from '@/components/profil/ProfilClient'

export const metadata: Metadata = {
  title: 'Můj profil – Mapa Farem',
  description: 'Nastavení preferencí, oblíbené kategorie, kraj a vzhled aplikace.',
}

export default function ProfilPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Můj profil</h1>
            <p className="text-neutral-500 text-sm">Přizpůsobte si Mapa Farem podle svých potřeb.</p>
          </div>
          <ProfilClient />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
