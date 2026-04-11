import Link from 'next/link'
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { getHomepageFarms, CATEGORY_LABELS } from '@/lib/farms'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import type { Farm } from '@/types/farm'

export async function HomeFeaturedFarms() {
  const farms = await getHomepageFarms(6)
  if (farms.length === 0) return null

  const [spotlight, ...rest] = farms

  return (
    <section className="relative py-16 lg:py-24 bg-surface grain overflow-hidden" aria-labelledby="featured-farms-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="relative">
            {/* Large muted section number */}
            <span
              className="absolute -left-1 -top-4 font-heading font-bold text-neutral-100 select-none pointer-events-none leading-none"
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
              aria-hidden="true"
            >
              01
            </span>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-500 font-bold mb-3">
                Farmy v adresáři
              </p>
              <h2
                id="featured-farms-heading"
                className="font-heading font-bold text-forest leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Objevte místní farmáře
              </h2>
            </div>
          </div>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group pb-1"
          >
            Zobrazit všechny farmy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatedSection className="sm:col-span-2 lg:col-span-2">
            <SpotlightCard farm={spotlight} />
          </AnimatedSection>
          {rest.slice(0, 4).map((farm, i) => (
            <AnimatedSection key={farm.id} delay={(i + 1) * 70}>
              <FarmCard farm={farm} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Category-specific fallback photos — shown when farm has no real image
const CATEGORY_PHOTO: Record<string, string> = {
  zelenina: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=70',
  ovoce:    'https://images.unsplash.com/photo-1569870499705-504209102861?w=800&q=70',
  maso:     'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=70',
  mléko:    'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=800&q=70',
  vejce:    'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?w=800&q=70',
  med:      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=70',
  byliny:   'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=70',
  víno:     'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=70',
  chléb:    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70',
  ryby:     'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=70',
  default:  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=70',
}

function farmFallbackPhoto(farm: Farm): string {
  return CATEGORY_PHOTO[farm.categories[0]] ?? CATEGORY_PHOTO.default
}

// ── Spotlight card ────────────────────────────────────────

function SpotlightCard({ farm }: { farm: Farm }) {
  const img = farm.images?.[0] ?? ''
  const photo = img.startsWith('http') && !img.includes('placeholder') ? img : farmFallbackPhoto(farm)

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group flex flex-col sm:flex-row rounded-xl overflow-hidden bg-white border border-neutral-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 cursor-pointer min-h-[260px]"
      aria-label={`Farma: ${farm.name}`}
    >
      {/* Cover — always a photo */}
      <div className="relative sm:w-[42%] min-h-[200px] sm:min-h-0 flex-shrink-0 overflow-hidden bg-neutral-200" aria-hidden="true">
        <img
          src={photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-forest text-lg leading-tight">
              {farm.name}
              {farm.verified && (
                <CheckCircle className="inline-block ml-1.5 w-4 h-4 text-primary-500 relative -top-0.5" aria-label="Ověřená farma" />
              )}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {farm.location.city}, {farm.location.kraj}
          </div>
          {farm.description && (
            <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">{farm.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {farm.categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100"
              >
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-100">
          <span className="text-xs text-neutral-400">Zobrazit profil</span>
          <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </Link>
  )
}

// ── Regular card ──────────────────────────────────────────

function FarmCard({ farm }: { farm: Farm }) {
  const img = farm.images?.[0] ?? ''
  const photo = img.startsWith('http') && !img.includes('placeholder') ? img : farmFallbackPhoto(farm)

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 cursor-pointer"
      aria-label={`Farma: ${farm.name}`}
    >
      {/* Cover — always a photo */}
      <div className="relative h-40 overflow-hidden flex-shrink-0 bg-neutral-200" aria-hidden="true">
        <img
          src={photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        {farm.verified && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-primary-600" aria-label="Ověřená farma" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-sm text-forest leading-snug mb-1 truncate">
          {farm.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-neutral-400 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{farm.location.city}, {farm.location.kraj}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {farm.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100"
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-end mt-auto pt-3 border-t border-neutral-100 mt-4">
          <span className="text-xs font-semibold text-primary-600 inline-flex items-center gap-1">
            Zobrazit <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
