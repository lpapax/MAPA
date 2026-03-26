import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-surface" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-earth-700 uppercase tracking-widest mb-3">
            Recenze zákazníků
          </span>
          <h2
            id="testimonials-heading"
            className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4"
          >
            Co říkají naši zákazníci
          </h2>
          {/* Trust stat */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-earth-100 shadow-sm">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-earth-400 fill-earth-400" />
              ))}
            </div>
            <span className="font-heading font-bold text-forest text-sm">
              Hodnoceno zákazníky
            </span>
          </div>
        </AnimatedSection>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection
              key={t.id}
              delay={(i * 100) as 0 | 100 | 200}
              className="relative flex flex-col bg-white rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Large decorative quote mark */}
              <div
                className="absolute top-4 right-5 font-heading text-8xl text-primary-100 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5" aria-label={`${t.rating} z 5 hvězd`} role="img">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      'w-4 h-4',
                      idx < t.rating ? 'text-earth-400 fill-earth-400' : 'text-gray-200 fill-gray-200',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 mb-6">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm',
                    t.color,
                  )}
                  aria-label={`Avatar uživatele ${t.name}`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-heading font-semibold text-forest text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {t.city} · {t.since}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
