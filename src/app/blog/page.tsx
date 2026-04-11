import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { BlogGrid } from '@/components/blog/BlogGrid'

export const metadata: Metadata = {
  title: 'Blog – Mapa Farem',
  description: 'Články o lokálních potravinách, farmářství, ekologickém zemědělství a sezónním vaření.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-[100dvh] bg-surface pt-24 pb-20">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-16 mb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Blog
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Příběhy ze světa farem
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Průvodci, tipy a inspirace pro každého, kdo chce jíst lokálně, sezónně a s rozumem.
            </p>
          </div>
        </AnimatedSection>

        {/* Grid + filters */}
        <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" delay={100}>
          <BlogGrid />
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
