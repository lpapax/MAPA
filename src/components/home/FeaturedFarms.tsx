import Link from 'next/link'
import { Star, MapPin, ArrowRight, Quote } from 'lucide-react'
import { FEATURED_FARMS, type MockFarm } from '@/data/mockData'
import { CATEGORY_LABELS } from '@/lib/farms'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function FeaturedFarms() {
  const spotlight = FEATURED_FARMS.find((f) => f.spotlight)
  const regular = FEATURED_FARMS.filter((f) => !f.spotlight)

  return (
    <section className="py-16 lg:py-24 bg-surface" aria-labelledby="farms-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-earth-700 uppercase tracking-widest mb-3">
              Doporučené farmy
            </span>
            <h2
              id="farms-heading"
              className="font-heading text-3xl lg:text-4xl font-bold text-forest"
            >
              Farmy ve vašem okolí
            </h2>
          </div>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group"
          >
            Zobrazit všechny farmy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Spotlight card — spans 2 cols on lg */}
          {spotlight && (
            <AnimatedSection
              className="sm:col-span-2 lg:col-span-2"
              direction="left"
            >
              <SpotlightCard farm={spotlight} />
            </AnimatedSection>
          )}

          {/* Regular cards */}
          {regular.slice(0, spotlight ? 4 : 6).map((farm, i) => (
            <AnimatedSection key={farm.id} delay={((i % 3) * 100) as 0 | 100 | 200}>
              <FarmCard farm={farm} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Spotlight ────────────────────────────────

function SpotlightCard({ farm }: { farm: MockFarm }) {
  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group relative flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer min-h-[280px] hover:scale-[1.01]"
      aria-label={`Farmář týdne: ${farm.name}`}
    >
      {/* Cover */}
      <div
        className={cn(
          'relative sm:w-[45%] min-h-[200px] sm:min-h-0 flex-shrink-0',
          'bg-gradient-to-br',
          farm.coverGradient,
        )}
        aria-hidden="true"
      >
        {/* Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-earth-400 text-earth-900 text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-earth-900" aria-hidden="true" />
          Farmář týdne
        </div>
        {/* Organic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm',
                farm.farmerColor,
              )}
              aria-label={`Avatar farmáře ${farm.farmerName}`}
            >
              {farm.farmerInitials}
            </div>
            <div>
              <div className="font-heading font-bold text-forest text-base leading-tight">
                {farm.name}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {farm.kraj} · {farm.distance}
              </div>
            </div>
          </div>

          {farm.quote && (
            <blockquote className="relative pl-4 border-l-2 border-primary-200 mt-4">
              <Quote
                className="absolute -top-1 -left-1 w-4 h-4 text-primary-300"
                aria-hidden="true"
              />
              <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-3">
                {farm.quote}
              </p>
              <cite className="not-italic text-xs text-gray-400 mt-1.5 block">
                — {farm.farmerName}
              </cite>
            </blockquote>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
          <StarRating rating={farm.rating} count={farm.reviewCount} />
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:gap-2.5 transition-all"
            aria-hidden="true"
          >
            Zobrazit farmu <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Regular card ─────────────────────────────

function FarmCard({ farm }: { farm: MockFarm }) {
  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01]"
      aria-label={`Farma: ${farm.name}`}
    >
      {/* Cover */}
      <div
        className={cn(
          'relative h-44 bg-gradient-to-br overflow-hidden',
          farm.coverGradient,
        )}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        {/* Distance badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm">
          {farm.distance}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2.5 mb-3">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm',
              farm.farmerColor,
            )}
            aria-label={`Avatar farmáře ${farm.farmerName}`}
          >
            {farm.farmerInitials}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-sm text-forest leading-tight truncate">
              {farm.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{farm.kraj}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {farm.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100"
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <StarRating rating={farm.rating} count={farm.reviewCount} />
          <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors inline-flex items-center gap-1">
            Zobrazit <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Stars ────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-label={`Hodnocení ${rating} z 5 hvězd`} role="img">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < Math.floor(rating) ? 'text-earth-400 fill-earth-400' : 'text-gray-200 fill-gray-200',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-medium">
        {rating.toFixed(1)} <span className="text-gray-300">({count})</span>
      </span>
    </div>
  )
}
