import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SeasonalCalendarClient } from '@/components/home/SeasonalCalendarClient'

export const metadata: Metadata = {
  title: 'Sezónní kalendář – Mapa Farem',
  description: 'Co roste kdy? Přehledný sezónní kalendář ovoce, zeleniny a dalších produktů z českých farem.',
}

export default function SezonaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[100dvh] bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-lime-600 via-green-700 to-emerald-800 py-16 mb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Sezónní kalendář
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Co je teď v sezóně?
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Přehled 30 druhů ovoce, zeleniny a bylinek — filtrujte podle kategorie a aktuálního měsíce.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" delay={100}>
          <SeasonalCalendarClient />
        </AnimatedSection>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
