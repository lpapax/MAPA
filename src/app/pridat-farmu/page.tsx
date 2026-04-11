import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AddFarmForm } from '@/components/farms/AddFarmForm'

export const metadata: Metadata = {
  title: 'Přidat farmu – Mapa Farem',
  description: 'Zaregistrujte svou farmu do Mapy Farem. Registrace je zdarma a zákazníci vás budou moci najít přímo ve svém okolí.',
}

export default function PridatFarmuPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-[100dvh] bg-surface pt-24 pb-20">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-14 mb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Pro farmáře
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              Přidejte svou farmu
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Registrace je zdarma a trvá jen pár minut. Zákazníci ve vašem regionu vás snáz najdou.
            </p>
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8" delay={100}>
          <AddFarmForm />
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
