'use client'

import Link from 'next/link'
import { Heart, MapPin, ArrowRight } from 'lucide-react'
import { useFavoriteFarms } from '@/hooks/useFavoriteFarms'
import { CATEGORY_LABELS } from '@/lib/farms'

export function FavoritesClient() {
  const { favorites, clearFavorites } = useFavoriteFarms()

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
          <Heart className="w-8 h-8 text-rose-300" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Zatím žádné oblíbené</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
          Klikněte na srdíčko u detailu farmy a uložte si ji sem k rychlému přístupu.
        </p>
        <Link
          href="/mapa"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors duration-200"
        >
          Procházet farmy
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">
          {favorites.length} {favorites.length === 1 ? 'farma' : favorites.length < 5 ? 'farmy' : 'farem'}
        </span>
        <button
          onClick={clearFavorites}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          Smazat vše
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((farm) => (
          <div
            key={farm.slug}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card transition-all p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-heading font-bold text-forest text-base leading-tight">{farm.name}</h2>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {farm.kraj}
                </div>
              </div>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 flex-shrink-0" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {farm.categories.slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
                >
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
            </div>

            <Link
              href={`/farmy/${farm.slug}`}
              className="block text-center py-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold transition-colors"
            >
              Zobrazit farmu →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
