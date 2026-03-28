import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { FarmClaimForm } from '@/components/pro-farmary/FarmClaimForm'

export const metadata: Metadata = {
  title: 'Nárokovat farmu – Mapa Farem',
  description: 'Přihlaste se jako provozovatel farmy a spravujte její informace.',
}

export default function NarokujeFarmuPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">Správa vaší farmy</h1>
            <p className="text-neutral-500 text-sm">
              Ověřte se jako provozovatel a získejte přístup ke správě informací.
            </p>
          </div>
          <FarmClaimForm />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
