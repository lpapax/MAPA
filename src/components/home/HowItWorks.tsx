import { Search, MessageCircle, ShoppingBag } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Najdi farmu',
    description:
      'Vyhledejte farmy ve svém okolí na interaktivní mapě. Filtrujte podle produktu, vzdálenosti nebo kraje.',
    iconColor: 'text-primary-600',
    iconBg: 'bg-primary-50',
    iconBorder: 'border-primary-200',
    numColor: 'text-primary-100',
    cardBg: 'bg-white',
    accent: 'bg-primary-500',
  },
  {
    number: '02',
    icon: MessageCircle,
    title: 'Kontaktuj farmáře',
    description:
      'Spojte se přímo s farmářem přes telefon, e-mail nebo formulář. Bez prostředníků, bez skrytých poplatků.',
    iconColor: 'text-cta-DEFAULT',
    iconBg: 'bg-cta-50',
    iconBorder: 'border-cta-100',
    numColor: 'text-cyan-100',
    cardBg: 'bg-white',
    accent: 'bg-cta-DEFAULT',
  },
  {
    number: '03',
    icon: ShoppingBag,
    title: 'Vyzvedni si zboží',
    description:
      'Domluvte osobní vyzvednutí přímo na farmě nebo doručení domů. Čerstvé produkty od lokálních farmářů.',
    iconColor: 'text-earth-600',
    iconBg: 'bg-earth-50',
    iconBorder: 'border-earth-200',
    numColor: 'text-earth-100',
    cardBg: 'bg-white',
    accent: 'bg-earth-500',
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3">
            Jak to funguje
          </span>
          <h2
            id="how-heading"
            className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4"
          >
            Tři kroky k čerstvým potravinám
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Propojujeme zákazníky s farmáři co nejjednodušeji. Žádná registrace, žádné poplatky —
            jen přímý kontakt.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:flex absolute top-14 left-[calc(33%+2.5rem)] right-[calc(33%+2.5rem)] items-center"
            aria-hidden="true"
          >
            <div className="flex-1 border-t-2 border-dashed border-neutral-200" />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <AnimatedSection
                key={step.number}
                delay={(i * 200) as 0 | 200 | 400}
                className={cn(
                  'relative flex flex-col items-center text-center p-7 rounded-xl border border-neutral-100',
                  'shadow-card hover:shadow-card-hover transition-shadow duration-300',
                  step.cardBg,
                )}
              >
                {/* Accent bar at top */}
                <div className={cn('absolute top-0 left-8 right-8 h-1 rounded-b-full', step.accent)} aria-hidden="true" />

                {/* Step number */}
                <span
                  className={cn(
                    'font-heading font-bold text-7xl leading-none mb-3 select-none',
                    step.numColor,
                  )}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Icon circle */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-5',
                    step.iconBg,
                    step.iconBorder,
                    'border',
                  )}
                >
                  <Icon className={cn('w-6 h-6', step.iconColor)} aria-hidden="true" />
                </div>

                <h3 className="font-heading font-bold text-lg text-forest mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
