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
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="how-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="mb-14">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
            Jak to funguje
          </span>
          <h2
            id="how-heading"
            className="font-heading text-3xl lg:text-4xl font-bold text-forest mt-3 max-w-lg"
          >
            Tři kroky k čerstvým potravinám
          </h2>
        </AnimatedSection>

        <div>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <AnimatedSection
                key={step.number}
                delay={(i * 120) as 0 | 120 | 240}
              >
                <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[100px_1fr] lg:grid-cols-[140px_1fr] gap-6 lg:gap-10 py-10 border-t border-neutral-100 group">

                  {/* Step number — pure typographic weight */}
                  <div className="pt-1">
                    <span
                      className="font-heading font-bold text-6xl sm:text-7xl lg:text-8xl text-neutral-100 leading-none select-none group-hover:text-primary-100 transition-colors duration-500 tabular-nums"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                        'border',
                        step.iconBg,
                        step.iconBorder,
                      )}
                    >
                      <Icon className={cn('w-5 h-5', step.iconColor)} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-forest mb-2">
                        {step.title}
                      </h3>
                      <p className="text-neutral-500 leading-relaxed max-w-[55ch] text-[15px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
          {/* Closing rule */}
          <div className="border-t border-neutral-100" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
