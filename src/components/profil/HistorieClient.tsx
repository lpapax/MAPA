'use client'

import Link from 'next/link'
import { History, MapPin, ArrowLeft, Trash2 } from 'lucide-react'
import { useRecentFarms } from '@/hooks/useRecentFarms'
import { CATEGORY_LABELS } from '@/lib/farms'

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 1) return 'Právě teď'
  if (minutes < 60) return `Před ${minutes} min`
  if (hours < 24) return `Před ${hours} h`
  if (days === 1) return 'Včera'
  return `Před ${days} dny`
}

export function HistorieClient() {
  const { recentFarms, clearRecent } = useRecentFarms()

  if (recentFarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
          <History className="w-8 h-8 text-primary-300" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Žádná historie</h2>
        <p className="text-neutral-400 text-sm mb-6 max-w-xs leading-relaxed">
          Otevřete detail farmy a uvidíte ji zde.
        </p>
        <Link
          href="/mapa"
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          Procházet farmy
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/profil"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Zpět na profil
        </Link>
        <button
          onClick={clearRecent}
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" aria-hidden="true" />
          Smazat historii
        </button>
      </div>

      {recentFarms.map((farm) => (
        <Link
          key={farm.slug}
          href={`/farmy/${farm.slug}`}
          className="flex items-start gap-4 bg-white rounded-2xl border border-neutral-100 shadow-card p-4 hover:shadow-card-hover transition-[box-shadow] group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 font-heading font-bold text-primary-700 text-base group-hover:bg-primary-100 transition-colors">
            {farm.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-forest text-sm truncate">{farm.name}</p>
            <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {farm.kraj}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {farm.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-700 border border-primary-100"
                >
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-[10px] text-neutral-400">{formatRelativeTime(farm.visitedAt)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
