import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { ContactForm } from '@/components/kontakt/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt – Mapa Farem',
  description:
    'Kontaktujte tým Mapy Farem. Máte dotaz, námět nebo chcete spolupracovat? Ozvěte se nám – rádi odpovíme.',
  openGraph: {
    title: 'Kontakt – Mapa Farem',
    description: 'Kontaktujte tým Mapy Farem.',
    locale: 'cs_CZ',
  },
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'E-mail',
    value: 'info@mapafarem.cz',
    href: 'mailto:info@mapafarem.cz',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+420 800 123 456',
    href: 'tel:+420800123456',
  },
  {
    icon: MapPin,
    label: 'Adresa',
    value: 'Praha, Česká republika',
    href: null,
  },
  {
    icon: Clock,
    label: 'Pracovní doba',
    value: 'Po–Pá 9:00–17:00',
    href: null,
  },
]

export default function KontaktPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-16 mb-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Kontakt
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Napište nám
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Máte dotaz, nápad nebo chcete nahlásit problém? Odpovídáme do 24 hodin
              v pracovní dny.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Odeslat zprávu</h2>
              <ContactForm />
            </div>

            {/* Contact info */}
            <aside className="lg:col-span-2 space-y-5">
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Kontaktní údaje</h2>

              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm text-forest font-medium hover:text-primary-600 transition-colors cursor-pointer">
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm text-forest font-medium">{value}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl border border-primary-100 h-40 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" aria-hidden="true">
                  <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-primary-400" />
                  <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-teal-400" />
                </div>
                <MapPin className="w-8 h-8 text-primary-500" aria-hidden="true" />
                <p className="text-sm text-forest font-medium">Praha, Česká republika</p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
