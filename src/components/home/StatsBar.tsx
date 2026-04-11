import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export function StatsBar() {
  return (
    <section className="relative bg-forest overflow-hidden" aria-label="Statistiky">
      {/* Background farm photo — very low opacity for depth */}
      <img
        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=60"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.18] pointer-events-none select-none"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest/60 via-transparent to-forest/60 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-primary-400/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-5">
            O Mapě Farem
          </p>
          <p
            className="font-heading font-bold text-white leading-snug"
            style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)' }}
          >
            Přes{' '}
            <AnimatedCounter target={3960} suffix="+" />
            {' '}farem ze všech 14 krajů České republiky —{' '}
            12 kategorií od zeleniny po víno.{' '}
            <span className="text-primary-200">Vždy zdarma.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
