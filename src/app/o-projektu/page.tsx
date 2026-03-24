import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'O projektu – Mapa Farem',
  description: 'Mapa Farem propojuje zákazníky s lokálními farmáři z celé České republiky. Zjistěte, kdo za projektem stojí a proč vznikl.',
}

const STATS = [
  { value: '247', label: 'ověřených farem', icon: '🌾' },
  { value: '14', label: 'krajů ČR', icon: '🗺️' },
  { value: '1 200+', label: 'druhů produktů', icon: '🥕' },
  { value: '12 000+', label: 'spokojených zákazníků', icon: '😊' },
]

const TIMELINE = [
  {
    year: '2022',
    title: 'Zrod myšlenky',
    description: 'Projekt vznikl z frustrace – sehnat lokální farmáře bylo obtížné a zdlouhavé. Rozhodli jsme se to změnit.',
  },
  {
    year: '2023',
    title: 'První farmy na mapě',
    description: 'Spustili jsme beta verzi s 50 farmami z Jihočeského a Středočeského kraje. Zájem předčil naše očekávání.',
  },
  {
    year: '2024',
    title: 'Expanze do všech krajů',
    description: 'Rozšíření do všech 14 krajů ČR, nový design a mobilní aplikace. Komunita narostla na 5 000 aktivních uživatelů.',
  },
  {
    year: '2025',
    title: 'Komunita 12 000 lidí',
    description: 'Přes 200 ověřených farem, systém recenzí, bedýnkové objednávky a přímé propojení zákazníků s farmáři.',
  },
  {
    year: '2026',
    title: 'Dnes – 247 farem',
    description: 'Každý týden přibývají nové farmy. Pracujeme na přímém objednávkovém systému a partnerstvích s restauracemi.',
    current: true,
  },
]

const FARMER_BENEFITS = [
  { title: 'Bezplatný profil', description: 'Vytvořte si prezentaci farmy zdarma. Žádné poplatky za registraci.' },
  { title: 'Přímý kontakt', description: 'Zákazníci vás kontaktují přímo – bez zprostředkovatelů a provizí.' },
  { title: 'Větší viditelnost', description: 'Dostaňte se k zákazníkům ve vašem regionu, kteří hledají lokální produkty.' },
  { title: 'Správa profilu', description: 'Aktualizujte produkty, otevírací dobu a kontakt kdykoliv sami.' },
]

const CUSTOMER_BENEFITS = [
  { title: 'Ověřené farmy', description: 'Každá farma prochází procesem ověření. Žádné falešné profily.' },
  { title: 'Přímý nákup', description: 'Nakupujte přímo od farmáře bez obchodních marží.' },
  { title: 'Lokální produkty', description: 'Filtrujte podle kraje, kategorie nebo dostupnosti produktů.' },
  { title: 'Recenze komunity', description: 'Čtěte zkušenosti ostatních zákazníků a hodnoťte vaše nákupy.' },
]

export default function OProjektuPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-6">
              O projektu
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Propojujeme farmáře<br />se zákazníky od roku 2022
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
                className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 text-center"
              >
                <div className="text-3xl mb-2" aria-hidden="true">{stat.icon}</div>
                <div className="font-heading font-bold text-3xl text-forest mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Mission & Vision */}
        <AnimatedSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl mb-5" aria-hidden="true">
                🎯
              </div>
              <h2 className="font-heading text-xl font-bold text-forest mb-3">Naše mise</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Usnadnit každému Čechovi přístup k lokálním, čerstvým a poctivým potravinám přímo od farmáře.
                Chceme, aby nákup lokálně byl stejně snadný jako nákup v supermarketu – jen chutnější, zdravější
                a s vědomím původu.
              </p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-5" aria-hidden="true">
                🌱
              </div>
              <h2 className="font-heading text-xl font-bold text-forest mb-3">Naše vize</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Česká republika, kde se zkracuje vzdálenost mezi polem a talířem. Kde farmáři prosperují,
                protože mají přímý přístup k zákazníkům, a zákazníci vědí, co jedí a od koho to kupují.
                Zdravá příroda, zdraví lidé, zdravá ekonomika.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <h2 className="font-heading text-2xl font-bold text-forest text-center mb-10">Jak to začalo</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-primary-100" aria-hidden="true" />

            <div className="space-y-8">
              {TIMELINE.map((item) => (
                <div key={item.year} className="flex gap-6 relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-heading font-bold flex-shrink-0 relative z-10 border-2 ${
                      item.current
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-primary-600 border-primary-200'
                    }`}
                  >
                    {item.year}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
                    <h3 className="font-heading font-bold text-forest text-sm mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    {item.current && (
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold">
                        Právě teď
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                <div key={b.title} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
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
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Žádné poplatky, žádná registrace. Stačí najít farmu a kontaktovat farmáře přímo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {CUSTOMER_BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <h3 className="font-heading font-bold text-forest text-sm mb-2">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.description}</p>
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
