import Link from 'next/link'
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { getHomepageFarms, CATEGORY_LABELS } from '@/lib/farms'
import { cn } from '@/lib/utils'
import type { Farm } from '@/types/farm'

export async function HomeFeaturedFarms() {
  const farms = await getHomepageFarms(6)
  if (farms.length === 0) return null

  const [spotlight, ...rest] = farms

  return (
    <section className="relative py-16 lg:py-24 bg-surface grain overflow-hidden" aria-labelledby="featured-farms-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-earth-700 text-sm font-medium italic mb-2">
              Farmy v adresáři
            </p>
            <h2
              id="featured-farms-heading"
              className="font-heading text-3xl lg:text-4xl font-bold text-forest"
            >
              Objevte místní farmáře
            </h2>
          </div>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group"
          >
            Zobrazit všechny farmy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <SpotlightCard farm={spotlight} />
          </div>
          {rest.slice(0, 4).map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      </div>
    </section>
  )
}

const CATEGORY_GRADIENT: Record<string, string> = {
  zelenina: 'from-emerald-600 to-teal-700',
  ovoce:    'from-rose-500 to-pink-700',
  maso:     'from-amber-600 to-orange-800',
  mléko:    'from-sky-500 to-blue-700',
  vejce:    'from-yellow-500 to-amber-700',
  med:      'from-amber-400 to-yellow-600',
  byliny:   'from-lime-500 to-green-700',
  víno:     'from-purple-600 to-violet-800',
  default:  'from-primary-600 to-forest',
}

function farmGradient(farm: Farm) {
  return CATEGORY_GRADIENT[farm.categories[0]] ?? CATEGORY_GRADIENT.default
}

// ── Spotlight card ────────────────────────────────────────

function SpotlightCard({ farm }: { farm: Farm }) {
  const gradient = farmGradient(farm)
  const img = farm.images?.[0] ?? ''
  const photo = img.startsWith('http') && !img.includes('placeholder') ? img : null

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group flex flex-col sm:flex-row rounded-xl overflow-hidden bg-white border border-neutral-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 cursor-pointer min-h-[260px]"
      aria-label={`Farma: ${farm.name}`}
    >
      {/* Cover — photo or gradient */}
      <div
        className={cn('relative sm:w-[42%] min-h-[180px] sm:min-h-0 flex-shrink-0 overflow-hidden', photo ? 'bg-neutral-200' : cn('bg-gradient-to-br', gradient))}
        aria-hidden="true"
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sp-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sp-dots)" />
            </svg>
            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-xl font-heading">
              {farm.name.charAt(0)}
            </div>
          </>
        )}
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
  const gradient = farmGradient(farm)
  const img = farm.images?.[0] ?? ''
  const photo = img.startsWith('http') && !img.includes('placeholder') ? img : null

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 cursor-pointer"
      aria-label={`Farma: ${farm.name}`}
    >
      {/* Cover — photo or gradient */}
      <div className={cn('relative h-36 overflow-hidden flex-shrink-0', photo ? 'bg-neutral-200' : cn('bg-gradient-to-br', gradient))} aria-hidden="true">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`dots-${farm.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dots-${farm.id})`} />
            </svg>
            <div className="absolute bottom-3 left-3 w-9 h-9 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-sm font-heading">
              {farm.name.charAt(0)}
            </div>
          </>
        )}
        {farm.verified && (
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
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
