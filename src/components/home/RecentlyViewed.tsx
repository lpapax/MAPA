'use client'

import Link from 'next/link'
import { Clock, ArrowRight, X, MapPin } from 'lucide-react'
import { useRecentFarms } from '@/hooks/useRecentFarms'
import { CATEGORY_LABELS } from '@/lib/farms'
import { cn } from '@/lib/utils'
import type { FarmCategory } from '@/types/farm'

// Gradient per category (matches FarmDetailPage)
const CATEGORY_GRADIENT: Record<string, string> = {
  zelenina: 'from-emerald-400 to-teal-500',
  ovoce: 'from-rose-400 to-pink-500',
  maso: 'from-amber-500 to-orange-500',
  mléko: 'from-sky-300 to-blue-400',
  vejce: 'from-yellow-300 to-amber-400',
  med: 'from-amber-300 to-yellow-400',
  byliny: 'from-lime-400 to-green-500',
  sýry: 'from-orange-300 to-amber-400',
  víno: 'from-purple-400 to-violet-500',
  chléb: 'from-orange-200 to-amber-300',
  ryby: 'from-cyan-400 to-blue-500',
  ostatní: 'from-gray-300 to-slate-400',
  default: 'from-emerald-400 to-teal-500',
}

function categoryGradient(categories: FarmCategory[]): string {
  return CATEGORY_GRADIENT[categories[0]] ?? CATEGORY_GRADIENT.default
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Právě teď'
  if (mins < 60) return `Před ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Před ${hrs} h`
  const days = Math.floor(hrs / 24)
  return `Před ${days} d`
}

export function RecentlyViewed() {
  const { recentFarms, clearRecent } = useRecentFarms()

  if (recentFarms.length === 0) return null

  return (
    <section
      className="py-10 lg:py-14"
      aria-labelledby="recently-viewed-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="recently-viewed-heading"
                className="font-heading text-lg font-bold text-forest leading-tight"
              >
                Naposledy zobrazeno
              </h2>
              <p className="text-xs text-gray-400">Farmy, které jste nedávno navštívili</p>
            </div>
          </div>
          <button
            onClick={clearRecent}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Vymazat historii"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Vymazat
          </button>
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
          role="list"
          aria-label="Naposledy zobrazené farmy"
        >
          {recentFarms.map((farm) => {
            const gradient = categoryGradient(farm.categories)
            return (
              <Link
                key={farm.slug}
                href={`/farmy/${farm.slug}`}
                role="listitem"
                className="group flex-shrink-0 snap-start w-52 rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                aria-label={`${farm.name} — naposledy zobrazeno ${timeAgo(farm.visitedAt)}`}
              >
                {/* Mini cover */}
                <div
                  className={cn('h-20 bg-gradient-to-br relative', gradient)}
                  aria-hidden="true"
                >
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/90">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      {timeAgo(farm.visitedAt)}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3">
                  <h3 className="font-heading font-bold text-sm text-forest truncate leading-tight">
                    {farm.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{farm.kraj}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {farm.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
                      >
                        {CATEGORY_LABELS[cat]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-2">
                    <span className="text-[11px] font-semibold text-primary-600 group-hover:gap-1.5 flex items-center gap-1 transition-all">
                      Zobrazit <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
