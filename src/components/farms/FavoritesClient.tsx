'use client'

import Link from 'next/link'
import { Heart, MapPin, ArrowRight, Share2, Download } from 'lucide-react'
import { useFavoriteFarms } from '@/hooks/useFavoriteFarms'
import { CATEGORY_LABELS } from '@/lib/farms'

function exportFavoritesCSV(favorites: ReturnType<typeof useFavoriteFarms>['favorites']) {
  const rows = [
    ['Název', 'Kraj', 'Kategorie', 'Odkaz'].join(','),
    ...favorites.map((f) =>
      [
        `"${f.name}"`,
        `"${f.kraj}"`,
        `"${f.categories.map((c) => CATEGORY_LABELS[c]).join('; ')}"`,
        `"${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mapafarem.cz'}/farmy/${f.slug}"`,
      ].join(','),
    ),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'oblibene-farmy.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function copyShareLink(favorites: ReturnType<typeof useFavoriteFarms>['favorites']) {
  const slugs = favorites.map((f) => f.slug).join(',')
  const url = `${window.location.origin}/porovnat?ids=${encodeURIComponent(slugs)}`
  navigator.clipboard?.writeText(url).catch(() => { /* ignore */ })
}

export function FavoritesClient() {
  const { favorites, clearFavorites } = useFavoriteFarms()

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
          <Heart className="w-8 h-8 text-rose-300" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Zatím žádné oblíbené</h2>
        <p className="text-neutral-400 text-sm mb-6 max-w-xs leading-relaxed">
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
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-sm text-neutral-400">
          {favorites.length} {favorites.length === 1 ? 'farma' : favorites.length < 5 ? 'farmy' : 'farem'}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyShareLink(favorites)}
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-primary-600 transition-colors cursor-pointer"
            title="Zkopírovat odkaz"
          >
            <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            Sdílet
          </button>
          <button
            onClick={() => exportFavoritesCSV(favorites)}
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-primary-600 transition-colors cursor-pointer"
            title="Stáhnout CSV"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Export
          </button>
          <button
            onClick={clearFavorites}
            className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Smazat vše
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((farm) => (
          <div
            key={farm.slug}
            className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-card transition-[box-shadow] p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-heading font-bold text-forest text-base leading-tight">{farm.name}</h2>
                <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
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
