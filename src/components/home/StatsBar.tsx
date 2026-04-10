import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const STATS = [
  { target: 3960, suffix: '+', label: 'farem v ČR', note: 'Největší adresář' },
  { target: 14, suffix: '', label: 'krajů pokryto', note: 'Celá republika' },
  { target: 12, suffix: '', label: 'kategorií', note: 'Zelenina až víno' },
  { target: 0, suffix: '', label: 'poplatků', isZero: true, note: 'Vždy zdarma' },
]

export function StatsBar() {
  return (
    <section className="bg-forest" aria-label="Statistiky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-800/60">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-0.5 px-6 py-8 first:pl-0 last:pr-0"
            >
              <span className="font-heading font-bold text-4xl lg:text-5xl text-white tabular-nums leading-none">
                {stat.isZero ? (
                  'Zdarma'
                ) : (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                )}
              </span>
              <span className="text-primary-200 text-sm font-medium mt-1.5">
                {stat.label}
              </span>
              <span className="text-primary-400/70 text-xs">
                {stat.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
