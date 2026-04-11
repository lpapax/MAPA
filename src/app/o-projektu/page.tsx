import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Sprout, Target, Leaf, ArrowLeftRight, Eye, Heart } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'O projektu – Mapa Farem',
  description: 'Mapa Farem propojuje zákazníky s lokálními farmáři z celé České republiky. Zjistěte, kdo za projektem stojí a proč vznikl.',
}

const STATS = [
  { value: '3 960+', label: 'farem v adresáři', Icon: Sprout },
  { value: '14', label: 'krajů ČR', Icon: MapPin },
]


const FARMER_BENEFITS = [
  { title: 'Bezplatný profil', description: 'Vytvořte si prezentaci farmy zdarma. Žádné poplatky za registraci.', Icon: Sprout },
  { title: 'Přímý kontakt', description: 'Zákazníci vás kontaktují přímo – bez zprostředkovatelů a provizí.', Icon: ArrowLeftRight },
  { title: 'Větší viditelnost', description: 'Dostaňte se k zákazníkům ve vašem regionu, kteří hledají lokální produkty.', Icon: Eye },
  { title: 'Správa profilu', description: 'Aktualizujte produkty, otevírací dobu a kontakt kdykoliv sami.', Icon: Target },
]

const CUSTOMER_BENEFITS = [
  { title: 'Přímý nákup', description: 'Nakupujte přímo od farmáře bez obchodních marží.', Icon: ArrowLeftRight },
  { title: 'Lokální produkty', description: 'Filtrujte podle kraje, kategorie nebo dostupnosti produktů.', Icon: MapPin },
  { title: 'Recenze komunity', description: 'Přidejte recenzi farmy a čtěte zkušenosti ostatních zákazníků.', Icon: Heart },
]


export default function OProjektuPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-[100dvh] bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
              O projektu
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Propojujeme farmáře<br />přímo se zákazníky
            </h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto leading-relaxed">
              Věříme, že každý má právo vědět, odkud pochází jeho jídlo. Mapa Farem je nezávislý
              adresář českých farem, který propojuje lidi s lokálními producenty v jejich okolí.
            </p>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-20" delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 text-center"
              >
                <div className="flex justify-center mb-3" aria-hidden="true">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <stat.Icon className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="font-heading font-bold text-3xl text-forest mb-1">{stat.value}</div>
                <div className="text-xs text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Mission & Vision */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-5" aria-hidden="true">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="font-heading text-xl font-bold text-forest mb-3">Naše mise</h2>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Usnadnit každému Čechovi přístup k lokálním, čerstvým a poctivým potravinám přímo od farmáře.
                Chceme, aby nákup lokálně byl stejně snadný jako nákup v supermarketu – jen chutnější, zdravější
                a s vědomím původu.
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-5" aria-hidden="true">
                <Leaf className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="font-heading text-xl font-bold text-forest mb-3">Naše vize</h2>
              <p className="text-neutral-600 leading-relaxed text-sm">
                Česká republika, kde se zkracuje vzdálenost mezi polem a talířem. Kde farmáři prosperují,
                protože mají přímý přístup k zákazníkům, a zákazníci vědí, co jedí a od koho to kupují.
                Zdravá příroda, zdraví lidé, zdravá ekonomika.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Origin story */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="font-heading text-2xl font-bold text-forest text-center mb-8">Jak to začalo</h2>
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-card p-8 space-y-4 text-sm text-neutral-600 leading-relaxed">
            <p>
              Mapa Farem vznikla z jednoduché frustrace: sehnat lokálního farmáře v okolí bylo překvapivě obtížné.
              Existovaly farmářské trhy, existoval Facebook, existovalo zdlouhavé hledání přes Google —
              ale žádné místo, kde by bylo všechno pohromadě, přehledně a na mapě.
            </p>
            <p>
              Rozhodli jsme se to změnit. Vytvořili jsme adresář, kde farmář vyplní profil jednou
              a zákazníci ho najdou snadno — podle místa, kategorie nebo toho, co právě hledají.
              Žádné provize, žádné zprostředkování. Jen přímé propojení.
            </p>
            <p>
              Jsme na začátku. Farmy přibývají, komunita roste a rádi bychom jednou pokryli
              každý kraj v Česku. Pokud znáte farmáře, který tu ještě není — pošlete mu odkaz.
            </p>
          </div>
        </AnimatedSection>

        {/* For farmers */}
        <AnimatedSection className="bg-gradient-to-br from-forest to-primary-800 py-16 mb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">
                Pro farmáře
              </span>
              <h2 className="font-heading text-3xl font-bold text-white mb-3">Přidejte svou farmu zdarma</h2>
              <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
                Registrace je bezplatná a trvá jen pár minut. Dostaňte se k zákazníkům ve svém regionu.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {FARMER_BENEFITS.map((b) => (
                <div key={b.title} className="bg-white/10 rounded-2xl p-5 border border-white/8">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center mb-3" aria-hidden="true">
                    <b.Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-sm mb-2">{b.title}</h3>
                  <p className="text-white/65 text-xs leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/pridat-farmu"
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-forest font-heading font-bold text-sm hover:bg-primary-50 transition-colors duration-200 shadow-lg"
              >
                Přidat farmu →
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* For customers */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Pro zákazníky
            </span>
            <h2 className="font-heading text-3xl font-bold text-forest mb-3">Proč nakupovat přes Mapu Farem?</h2>
            <p className="text-neutral-500 max-w-xl mx-auto text-sm leading-relaxed">
              Žádné poplatky, žádná registrace. Stačí najít farmu a kontaktovat farmáře přímo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {CUSTOMER_BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mb-3" aria-hidden="true">
                  <b.Icon className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-heading font-bold text-forest text-sm mb-2">{b.title}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/mapa"
              className="inline-block px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-heading font-bold text-sm transition-colors duration-200 shadow-sm"
            >
              Najít farmu v okolí →
            </Link>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
