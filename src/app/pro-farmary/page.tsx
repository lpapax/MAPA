import type { Metadata } from 'next'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
  BarChart2,
} from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { FarmerFAQ } from '@/components/pro-farmary/FarmerFAQ'

export const metadata: Metadata = {
  title: 'Pro farmáře – Mapa Farem',
  description:
    'Prodávejte přímo zákazníkům bez zprostředkovatelů. Bezplatná registrace, přímý kontakt, vyšší marže. Přidejte svou farmu do Mapy Farem.',
  openGraph: {
    title: 'Pro farmáře – Mapa Farem',
    description: 'Prodávejte přímo zákazníkům bez zprostředkovatelů.',
    locale: 'cs_CZ',
  },
}

const PAIN_POINTS = [
  {
    title: 'Zprostředkovatelé berou většinu marže',
    description:
      'Distribuční řetězce a supermarkety si berou 70–90 % hodnoty vašich produktů. Vy dostanete zlomek toho, co zákazník zaplatí.',
  },
  {
    title: 'Nízká viditelnost v regionu',
    description:
      'Zákazníci ve vašem okolí nevědí, že existujete. Bez vlastní prezentace se k nim nedostanete.',
  },
  {
    title: 'Nejistota odbytu',
    description:
      'Nevíte, kolik zeleniny se prodá. Distributor může kdykoli odmítnout váš výpěstek. Přímý prodej dává jistotu.',
  },
]

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Až 5× vyšší příjmy',
    description:
      'Přímý prodej eliminuje zprostředkovatele. Zákazník platí vám, ne obchodnímu řetězci.',
  },
  {
    icon: Users,
    title: 'Přímý kontakt se zákazníky',
    description:
      'Zákazníci vás kontaktují přímo přes profil. Budujete dlouhodobé vztahy a stálou klientelu.',
  },
  {
    icon: Shield,
    title: 'Ověřený profil farmy',
    description:
      'Vaše farma dostane ověřovací odznak. Zákazníci vědí, že jde o skutečného lokálního producenta.',
  },
  {
    icon: BarChart2,
    title: 'Statistiky návštěvnosti',
    description:
      'Sledujte, kolik lidí navštívilo váš profil, odkud přichází zákazníci a co je nejvíce zajímá.',
  },
]

const PRICING = [
  {
    name: 'Základní',
    price: 'Zdarma',
    priceNote: 'navždy',
    color: 'border-gray-200',
    highlight: false,
    soon: false,
    features: [
      { label: 'Profil farmy s popisem', soon: false },
      { label: 'Kontaktní formulář', soon: false },
      { label: 'Až 5 fotografií', soon: false },
      { label: 'Zobrazení na mapě', soon: false },
      { label: 'Kategorie produktů', soon: false },
    ],
    cta: 'Začít zdarma',
    ctaHref: '/pridat-farmu',
    ctaStyle: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  },
  {
    name: 'Profesionál',
    price: '299 Kč',
    priceNote: '/ měsíc',
    color: 'border-primary-400 ring-2 ring-primary-200',
    highlight: true,
    soon: true,
    features: [
      { label: 'Vše ze základního plánu', soon: false },
      { label: 'Prioritní zobrazení ve výsledcích', soon: true },
      { label: 'Neomezený počet fotografií', soon: false },
      { label: 'Statistiky profilu', soon: true },
      { label: 'Odznáček „Ověřená farma"', soon: false },
      { label: 'E-mailová podpora', soon: false },
    ],
    cta: 'Mám zájem',
    ctaHref: '/kontakt',
    ctaStyle: 'bg-primary-600 text-white hover:bg-primary-700',
  },
  {
    name: 'Premium',
    price: '799 Kč',
    priceNote: '/ měsíc',
    color: 'border-earth-300',
    highlight: false,
    soon: true,
    features: [
      { label: 'Vše z Profesionálního plánu', soon: false },
      { label: 'Umístění v hero sekci domovské stránky', soon: true },
      { label: 'Zmínka v newsletteru Mapa Farem', soon: false },
      { label: 'Exporty dat a reporty', soon: true },
      { label: 'Telefonická podpora', soon: false },
    ],
    cta: 'Kontaktovat nás',
    ctaHref: '/kontakt',
    ctaStyle: 'border border-earth-600 text-earth-700 hover:bg-earth-50',
  },
]

const STEPS = [
  {
    num: '1',
    title: 'Vyplňte registraci',
    description: 'Základní informace, lokalita, kategorie produktů a kontakt. Trvá 5 minut.',
  },
  {
    num: '2',
    title: 'Ověříme váš profil',
    description: 'Do 3 pracovních dnů ověříme údaje a aktivujeme váš profil na mapě.',
  },
  {
    num: '3',
    title: 'Zákazníci vás najdou',
    description: 'Tisíce zákazníků z vašeho regionu vás snadno najdou a kontaktují přímo.',
  },
]

export default function ProFarmaryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-white/20" />
            <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-emerald-300/20" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
              Pro farmáře
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Prodávejte přímo<br />
              <span className="text-primary-300">zákazníkům ve vašem okolí</span>
            </h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Spojte se s tisíci zákazníků, kteří hledají lokální potraviny přímo ve vašem regionu.
              Bezplatná registrace, přímý kontakt, žádné provize.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pridat-farmu"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-forest font-heading font-bold text-sm hover:bg-primary-50 transition-colors duration-200 shadow-lg cursor-pointer"
              >
                Přidat farmu zdarma
              </Link>
              <Link
                href="/pro-farmary/narokovat"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-heading font-semibold text-sm hover:border-white/60 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                Spravovat existující farmu
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Pain Points */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-forest mb-3">
              Problémy, které řeší Mapa Farem
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Znáte to. Pěstujete skvělé produkty, ale dostat je ke správným zákazníkům je boj.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point) => (
              <div
                key={point.title}
                className="bg-white rounded-2xl border border-red-100 shadow-card p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <span className="text-red-500 font-bold text-lg" aria-hidden="true">✕</span>
                </div>
                <h3 className="font-heading font-bold text-forest text-sm mb-2">{point.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection className="bg-gradient-to-b from-primary-50 to-surface py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-forest mb-3">
                Co Mapa Farem přinese vám
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Stovky farmářů již využívají Mapu Farem k přímému prodeji. Výsledky mluví za sebe.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={benefit.title}
                    className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-forest text-sm mb-1.5">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* How it works */}
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-forest mb-3">Jak začít</h2>
            <p className="text-gray-500 text-sm">Tři jednoduché kroky k prvnímu zákazníkovi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-primary-100" aria-hidden="true" />
            {STEPS.map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white font-heading font-bold text-xl flex items-center justify-center mx-auto mb-4 relative z-10">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-forest text-sm mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Pricing */}
        <div id="pricing">
        <AnimatedSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-forest mb-3">Ceník</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Základní registrace je zcela zdarma. Prémiové plány odemykají větší viditelnost a pokročilé funkce.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border-2 shadow-card p-7 flex flex-col ${plan.color} ${
                  plan.highlight ? 'shadow-card-hover' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {plan.highlight && (
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                      Nejoblíbenější
                    </span>
                  )}
                  {plan.soon && (
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                      Připravujeme
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-forest text-lg mb-1">{plan.name}</h3>
                <div className="mb-5">
                  <span className="font-heading font-bold text-3xl text-forest">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.priceNote}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        {feature.label}
                        {feature.soon && (
                          <span className="ml-1.5 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">brzy</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`text-center py-3 px-5 rounded-xl font-semibold text-sm transition-colors duration-200 cursor-pointer ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </AnimatedSection>
        </div>

        {/* FAQ */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-forest mb-3">Časté dotazy farmářů</h2>
          </div>
          <FarmerFAQ />
        </AnimatedSection>

        {/* Final CTA */}
        <AnimatedSection className="bg-gradient-to-br from-forest to-primary-800 py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Připraveni začít?
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Registrace je zdarma a trvá 5 minut. Zákazníci z vašeho regionu vás budou moci najít ještě dnes.
            </p>
            <Link
              href="/pridat-farmu"
              className="inline-block px-10 py-4 rounded-xl bg-white text-forest font-heading font-bold text-base hover:bg-primary-50 transition-colors duration-200 shadow-lg cursor-pointer"
            >
              Přidat farmu zdarma →
            </Link>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
