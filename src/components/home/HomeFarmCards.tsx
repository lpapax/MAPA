'use client'

import Link from 'next/link'
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/farms'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { use3dEffect } from '@/hooks/use3dEffect'
import type { Farm } from '@/types/farm'

const CATEGORY_GRADIENT: Record<string, string> = {
  zelenina: 'from-emerald-400 via-teal-500 to-cyan-600',
  ovoce: 'from-rose-300 via-pink-400 to-red-400',
  maso: 'from-amber-400 via-orange-500 to-red-500',
  mléko: 'from-sky-300 via-blue-400 to-indigo-400',
  vejce: 'from-yellow-300 via-amber-400 to-orange-400',
  med: 'from-amber-300 via-yellow-400 to-orange-300',
  byliny: 'from-lime-400 via-green-500 to-emerald-600',
  víno: 'from-purple-400 via-violet-500 to-indigo-500',
  default: 'from-emerald-400 via-teal-500 to-green-600',
}

function farmGradient(farm: Farm) {
  return CATEGORY_GRADIENT[farm.categories[0]] ?? CATEGORY_GRADIENT.default
}

export function SpotlightCard({ farm }: { farm: Farm }) {
  const gradient = farmGradient(farm)
  const { transform, onMouseMove, onMouseEnter, onMouseLeave, transition } = use3dEffect()

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transform, transition }}
    >
      <Link
        href={`/farmy/${farm.slug}`}
        className="group relative flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer min-h-[280px] hover:scale-[1.01]"
        aria-label={`Farma: ${farm.name}`}
      >
        {/* Cover gradient */}
        <div
          className={cn('relative sm:w-[45%] min-h-[200px] sm:min-h-0 flex-shrink-0 bg-gradient-to-br', gradient)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sp-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#sp-dots)" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-6 flex-1">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm bg-gradient-to-br', gradient)}
                aria-hidden="true"
              >
                {farm.name.charAt(0)}
              </div>
              <div>
                <div className="font-heading font-bold text-forest text-base leading-tight flex items-center gap-1.5">
                  {farm.name}
                  {farm.verified && (
                    <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" aria-label="Ověřená farma" />
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {farm.location.city}, {farm.location.kraj}
                </div>
              </div>
            </div>
            {farm.description && (
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">{farm.description}</p>
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
          <div className="flex items-center justify-end mt-5 pt-4 border-t border-gray-50">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 group-hover:gap-2.5 transition-all" aria-hidden="true">
              Zobrazit farmu <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function FarmCard({ farm }: { farm: Farm }) {
  const gradient = farmGradient(farm)
  const { transform, onMouseMove, onMouseEnter, onMouseLeave, transition } = use3dEffect()
  return (
    <div
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transform, transition }}
    >
      <Link
        href={`/farmy/${farm.slug}`}
        className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01]"
        aria-label={`Farma: ${farm.name}`}
      >
        {/* Cover gradient */}
        <div className={cn('relative h-44 bg-gradient-to-br overflow-hidden', gradient)} aria-hidden="true">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`dots-${farm.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dots-${farm.id})`} />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start gap-2.5 mb-3">
            <div
              className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm bg-gradient-to-br', gradient)}
              aria-hidden="true"
            >
              {farm.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-forest leading-tight truncate flex items-center gap-1">
                {farm.name}
                {farm.verified && (
                  <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" aria-label="Ověřená farma" />
                )}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{farm.location.city}, {farm.location.kraj}</span>
              </div>
            </div>
          </div>

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

          <div className="flex items-center justify-end mt-auto pt-3 border-t border-gray-50">
            <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors inline-flex items-center gap-1">
              Zobrazit <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

interface HomeFarmCardsGridProps {
  spotlight: Farm
  rest: Farm[]
}

export function HomeFarmCardsGrid({ spotlight, rest }: HomeFarmCardsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <AnimatedSection className="sm:col-span-2 lg:col-span-2" direction="left">
        <SpotlightCard farm={spotlight} />
      </AnimatedSection>
      {rest.slice(0, 4).map((farm, i) => (
        <AnimatedSection key={farm.id} delay={((i % 3) * 100) as 0 | 100 | 200}>
          <FarmCard farm={farm} />
        </AnimatedSection>
      ))}
    </div>
  )
}
