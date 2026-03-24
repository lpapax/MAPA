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
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    numberColor: 'text-primary-200',
  },
  {
    number: '02',
    icon: MessageCircle,
    title: 'Kontaktuj farmáře',
    description:
      'Spojte se přímo s farmářem přes telefon, e-mail nebo formulář. Bez prostředníků, bez skrytých poplatků.',
    color: 'text-cta-DEFAULT',
    bg: 'bg-cta-50',
    border: 'border-cta-100',
    numberColor: 'text-cyan-200',
  },
  {
    number: '03',
    icon: ShoppingBag,
    title: 'Vyzvedni si zboží',
    description:
      'Domluvte osobní vyzvednutí přímo na farmě nebo doručení domů. Čerstvé produkty od lokálních farmářů.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    numberColor: 'text-amber-200',
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
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Propojujeme zákazníky s farmáři co nejjednodušeji. Žádná registrace, žádné poplatky —
            jen přímý kontakt.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector lines (desktop only) */}
          <div
            className="hidden md:block absolute top-12 left-[33%] right-[33%] h-px border-t-2 border-dashed border-gray-200"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <AnimatedSection
                key={step.number}
                delay={(i * 200) as 0 | 200 | 400}
                className={cn(
                  'relative flex flex-col items-center text-center p-7 rounded-3xl border',
                  step.bg,
                  step.border,
                )}
              >
                {/* Step number */}
                <span
                  className={cn(
                    'font-heading font-bold text-6xl leading-none mb-4 select-none',
                    step.numberColor,
                  )}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Icon circle */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-5',
                    step.border,
                    'border',
                  )}
                >
                  <Icon className={cn('w-6 h-6', step.color)} aria-hidden="true" />
                </div>

                <h3 className="font-heading font-bold text-lg text-forest mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
