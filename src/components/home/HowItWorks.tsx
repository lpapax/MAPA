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
    <section className="relative py-16 lg:py-24 bg-white grain overflow-hidden" aria-labelledby="how-heading">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-50/60 -translate-y-1/3 translate-x-1/4 pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      {/* Two-column at xl: steps left, atmospheric photo right */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-20 xl:items-start">

          {/* Left — heading + steps */}
          <div>
            <AnimatedSection className="mb-14">
              <p className="text-primary-600 text-sm font-medium italic mb-3">
                Jak to funguje
              </p>
              <h2
                id="how-heading"
                className="font-heading text-3xl lg:text-4xl font-bold text-forest max-w-lg"
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
                    <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[100px_1fr] gap-6 lg:gap-10 py-10 border-t border-neutral-100 group">

                      {/* Step number */}
                      <div className="pt-1">
                        <span
                          className="font-heading font-bold text-6xl sm:text-7xl text-neutral-100 leading-none select-none group-hover:text-primary-100 transition-colors duration-500 tabular-nums"
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
              <div className="border-t border-neutral-100" aria-hidden="true" />
            </div>
          </div>

          {/* Right — decorative photo panel, xl only */}
          <div className="hidden xl:block sticky top-28 pt-[calc(theme(spacing.14)+theme(spacing.10))]">
            <AnimatedSection direction="right">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=75"
                  alt="Farmářská zahrada"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Soft bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" aria-hidden="true" />
                {/* Caption */}
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-heading font-semibold text-sm">
                    Přímý kontakt s farmářem
                  </p>
                  <p className="text-white/65 text-xs mt-0.5">
                    Bez prostředníků, bez skrytých poplatků
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}
