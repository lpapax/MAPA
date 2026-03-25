import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { HelpAccordion } from '@/components/pomoc/HelpAccordion'

export const metadata: Metadata = {
  title: 'Nápověda a FAQ – Mapa Farem',
  description:
    'Odpovědi na nejčastější dotazy zákazníků i farmářů. Jak najít farmu, jak se registrovat, jak kontaktovat farmáře.',
  openGraph: {
    title: 'Nápověda – Mapa Farem',
    description: 'Odpovědi na nejčastější dotazy.',
    locale: 'cs_CZ',
  },
}

export default function PomocPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-16 mb-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Nápověda
            </span>
            <h1 className="font-heading text-4xl font-bold text-white mb-4">
              Jak vám můžeme pomoci?
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed">
              Najděte odpovědi na nejčastější dotazy nebo nás kontaktujte přímo.
            </p>
          </div>
        </AnimatedSection>

        {/* FAQ Accordion */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <HelpAccordion />
        </AnimatedSection>

        {/* Contact fallback */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-8 text-center">
            <h2 className="font-heading text-xl font-bold text-forest mb-2">
              Nenašli jste odpověď?
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
              Náš tým je vám k dispozici v pracovní dny od 9:00 do 17:00. Rádi zodpovíme
              jakýkoliv dotaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@mapafarem.cz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                info@mapafarem.cz
              </a>
              <a
                href="tel:+420800123456"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-forest font-semibold text-sm transition-colors duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                +420 800 123 456
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Nebo vyplňte{' '}
              <Link href="/kontakt" className="text-primary-600 hover:underline cursor-pointer">
                kontaktní formulář
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
