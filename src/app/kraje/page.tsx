import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { KRAJ_LIST } from '@/data/mockData'
import { getAllFarms } from '@/lib/farms'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Atlas krajů – Mapa Farem',
  description: 'Prozkoumejte farmy ve všech 14 krajích České republiky.',
}

export const revalidate = 300

export default async function KrajePage() {
  const farms = await getAllFarms()

  // Real farm counts by kraj
  const countByKraj: Record<string, number> = {}
  for (const farm of farms) {
    const k = farm.location.kraj
    countByKraj[k] = (countByKraj[k] ?? 0) + 1
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-16 mb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Atlas krajů
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Farmy ve vašem kraji
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Všech 14 krajů České republiky — vyberte svůj region a objevte místní farmáře.
            </p>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {KRAJ_LIST.map((kraj) => {
              const count = countByKraj[kraj.name] ?? kraj.farmCount
              return (
                <Link
                  key={kraj.code}
                  href={`/mapa?kraj=${encodeURIComponent(kraj.code)}`}
                  className="group block"
                >
                  <div
                    className={cn(
                      'relative rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm',
                      'hover:shadow-card transition-all duration-200 hover:-translate-y-0.5',
                    )}
                  >
                    {/* Cover gradient */}
                    <div className={cn('h-20 bg-gradient-to-br flex items-center justify-center', kraj.gradient)} aria-hidden="true">
                      <MapPin className="w-8 h-8 text-white/80" />
                    </div>
                    {/* Info */}
                    <div className="p-4">
                      <h2 className="font-heading font-bold text-forest text-sm mb-0.5 group-hover:text-primary-600 transition-colors">
                        {kraj.name}
                      </h2>
                      <p className="text-xs text-neutral-400">
                        {count} {count === 1 ? 'farma' : count < 5 ? 'farmy' : 'farem'}
                      </p>
                    </div>
                    {/* Arrow overlay */}
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Krajů', value: '14' },
              { label: 'Ověřených farem', value: farms.length > 0 ? String(farms.length) : 'Stovky' },
              { label: 'Druhů produktů', value: 'Tisíce' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 text-center">
                <div className="font-heading font-bold text-2xl text-forest mb-1">{stat.value}</div>
                <div className="text-xs text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
