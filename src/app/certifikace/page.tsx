import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CertFAQ } from '@/components/certifikace/CertFAQ'

export const metadata: Metadata = {
  title: 'Bio certifikace – Mapa Farem',
  description:
    'Průvodce bio certifikací v České republice. Certifikační orgány, co certifikace zaručuje a jak poznat skutečné bio produkty.',
  openGraph: {
    title: 'Bio certifikace – Mapa Farem',
    description: 'Průvodce bio certifikací v ČR.',
    locale: 'cs_CZ',
  },
}

const CERT_BODIES = [
  {
    name: 'KEZ o.p.s.',
    fullName: 'Kontrola ekologického zemědělství',
    description:
      'Největší česká certifikační organizace pro ekologické zemědělství. Funguje od roku 1999 a certifikuje stovky farem po celé ČR. Jejich inspetoři provádějí pravidelné kontroly přímo na farmách.',
    website: 'https://www.kez.cz',
    code: 'CZ-BIO-001',
    farms: '1 200+ farem',
  },
  {
    name: 'ABCERT AG',
    fullName: 'Mezinárodní certifikační orgán',
    description:
      'Mezinárodní certifikační orgán se zastoupením v ČR. Certifikuje podle standardů EU i mezinárodních standardů (NOP, JAS). Vhodný pro farmáře orientované na export.',
    website: 'https://www.abcert.cz',
    code: 'CZ-BIO-003',
    farms: '300+ farem',
  },
  {
    name: 'Biokont CZ',
    fullName: 'Biokont CZ, s.r.o.',
    description:
      'Česká certifikační společnost zaměřená na ekologické zemědělství a zpracování potravin. Nabízí certifikaci pro farmy i zpracovatele bio produktů na domácím i zahraničním trhu.',
    website: 'https://www.biokont.cz',
    code: 'CZ-BIO-002',
    farms: '400+ farem',
  },
]

const COMPARISON = [
  {
    feature: 'Syntetické pesticidy',
    bio: false,
    local: null,
    conventional: true,
  },
  {
    feature: 'Syntetická hnojiva',
    bio: false,
    local: null,
    conventional: true,
  },
  {
    feature: 'GMO organismy',
    bio: false,
    local: null,
    conventional: null,
  },
  {
    feature: 'Pravidelná inspekce',
    bio: true,
    local: false,
    conventional: false,
  },
  {
    feature: 'Záručně lokální původ',
    bio: false,
    local: true,
    conventional: null,
  },
  {
    feature: 'Přirozený chov zvířat',
    bio: true,
    local: null,
    conventional: false,
  },
  {
    feature: 'Nižší uhlíková stopa',
    bio: null,
    local: true,
    conventional: false,
  },
]

function CompareCell({ value }: { value: boolean | null }) {
  if (value === true) return <CheckCircle className="w-4 h-4 text-primary-500 mx-auto" aria-label="Ano" />
  if (value === false) return <XCircle className="w-4 h-4 text-red-400 mx-auto" aria-label="Ne" />
  return <span className="text-neutral-300 text-xs mx-auto block text-center" aria-label="Závisí na farmáři">~</span>
}

export default function CertifikacePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-[100dvh] bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-16 mb-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              Bio certifikace
            </span>
            <h1 className="font-heading text-4xl font-bold text-white mb-4">
              Průvodce ekologickým zemědělstvím
            </h1>
            <p className="text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
              Co znamená bio certifikace, jak ji rozeznat a proč záleží na tom, kde vaše jídlo vzniklo.
            </p>
          </div>
        </AnimatedSection>

        {/* What BIO means */}
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl border border-primary-100 shadow-card p-8">
            <h2 className="font-heading text-2xl font-bold text-forest mb-4">
              Co je ekologické zemědělství?
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              Ekologické (bio) zemědělství je způsob hospodaření, který pracuje v souladu s přírodou.
              Zakazuje syntetické pesticidy, herbicidy a minerální hnojiva. Podporuje biodiverzitu,
              zdraví půdy a přirozené koloběhy živin.
            </p>
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              Na bio produktech musíte najít dva povinné prvky: <strong className="text-forest">logo EU pro bio</strong>{' '}
              (zelený list ze hvězdičkových teček) a <strong className="text-forest">kód certifikačního orgánu</strong>{' '}
              ve formátu CZ-BIO-XXX. Bez těchto značek nejde o certifikované bio.
            </p>
            <div className="bg-primary-50 rounded-2xl p-5 text-sm text-primary-800">
              <strong>Důležité:</strong> Bio certifikace neznamená automaticky lokální původ.
              Bio mango z Peru je stále bio – ale urazilo tisíce kilometrů. Ideální kombinace je{' '}
              <strong>lokální + bio</strong>.
            </div>
          </div>
        </AnimatedSection>

        {/* Certification bodies */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-2xl font-bold text-forest text-center mb-10">
            Certifikační orgány v České republice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERT_BODIES.map((body) => (
              <div key={body.name} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-sm mb-4 flex-shrink-0">
                  {body.name.slice(0, 2)}
                </div>
                <h3 className="font-heading font-bold text-forest text-base mb-1">{body.name}</h3>
                <p className="text-xs text-neutral-400 mb-3">{body.fullName}</p>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4 flex-1">{body.description}</p>
                <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
                  <div><span className="font-medium text-forest">Kód:</span> {body.code}</div>
                  <div><span className="font-medium text-forest">Certifikovaných farem:</span> {body.farms}</div>
                </div>
                <a
                  href={body.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Navštívit web
                </a>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Comparison table */}
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-2xl font-bold text-forest text-center mb-10">
            BIO vs. Lokální vs. Konvenční
          </h2>
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left px-6 py-4 font-heading font-semibold text-forest">Vlastnost</th>
                    <th className="text-center px-6 py-4 font-heading font-semibold text-primary-700">
                      <span className="block">BIO</span>
                      <span className="text-xs font-normal text-primary-500">certifikované</span>
                    </th>
                    <th className="text-center px-6 py-4 font-heading font-semibold text-amber-700">
                      <span className="block">Lokální</span>
                      <span className="text-xs font-normal text-amber-500">bez certifikace</span>
                    </th>
                    <th className="text-center px-6 py-4 font-heading font-semibold text-neutral-500">
                      <span className="block">Konvenční</span>
                      <span className="text-xs font-normal text-neutral-400">průmyslové</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} className="hover:bg-neutral-50">
                      <td className="px-6 py-3.5 text-neutral-600 text-sm">{row.feature}</td>
                      <td className="px-6 py-3.5"><CompareCell value={row.bio} /></td>
                      <td className="px-6 py-3.5"><CompareCell value={row.local} /></td>
                      <td className="px-6 py-3.5"><CompareCell value={row.conventional} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-400">
              ~ závisí na konkrétním farmáři nebo produktu
            </div>
          </div>
        </AnimatedSection>

        {/* How to recognize */}
        <AnimatedSection className="bg-gradient-to-b from-primary-50 to-surface py-16 mb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold text-forest text-center mb-10">
              Jak poznat certifikovaný bio produkt
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Hledejte logo EU',
                  desc: 'Zelený list ze hvězdičkových teček. Povinné na všech balených bio produktech v EU od roku 2012.',
                },
                {
                  step: '2',
                  title: 'Zkontrolujte kód',
                  desc: 'CZ-BIO-001 (KEZ), CZ-BIO-002 (Biokont), CZ-BIO-003 (ABCERT). Kód identifikuje certifikační orgán.',
                },
                {
                  step: '3',
                  title: 'Zeptejte se farmáře',
                  desc: 'Upřímný farmář vám řekne, jestli je certifikovaný, nebo proč certifikaci nemá. Certifikace je drahá i pro malé farmy.',
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-heading font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-bold text-forest text-sm mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="font-heading text-2xl font-bold text-forest text-center mb-10">
            Časté dotazy o bio certifikaci
          </h2>
          <CertFAQ />
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-forest to-primary-800 rounded-3xl p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-white mb-3">
              Najděte certifikované farmy ve svém okolí
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Na Mapě Farem si filtrujte farmy s bio certifikací nebo kontaktujte lokální
              farmáře přímo a zjistěte jejich přístup k hospodaření.
            </p>
            <Link
              href="/mapa"
              className="inline-block px-8 py-3.5 rounded-xl bg-white text-forest font-heading font-bold text-sm hover:bg-primary-50 transition-colors duration-200 shadow-lg cursor-pointer"
            >
              Otevřít mapu farem
            </Link>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
