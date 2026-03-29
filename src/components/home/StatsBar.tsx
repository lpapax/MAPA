import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const STATS = [
  { target: 3960, suffix: '+', label: 'farem v ČR' },
  { target: 14, suffix: '', label: 'krajů pokryto' },
  { target: 12, suffix: '', label: 'kategorií produktů' },
  { target: 0, suffix: '', label: 'poplatků pro zákazníky', isZero: true },
]

export function StatsBar() {
  return (
    <section className="bg-forest py-8" aria-label="Statistiky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="font-heading font-bold text-3xl lg:text-4xl text-white">
                {stat.isZero ? (
                  'Zdarma'
                ) : (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                )}
              </span>
              <span className="text-xs text-primary-200 font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
