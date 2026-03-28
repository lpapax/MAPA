'use client'

import { useRouter } from 'next/navigation'
import { Search, Trash2, ExternalLink } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSavedSearches } from '@/hooks/useSavedSearches'
import { CATEGORY_LABELS } from '@/lib/farms'

function filtersToText(filters: import('@/hooks/useSavedSearches').SavedSearch['filters']): string {
  const parts: string[] = []
  if (filters.kraj) parts.push(filters.kraj)
  if (filters.categories.length > 0) {
    parts.push(filters.categories.map((c) => CATEGORY_LABELS[c]).join(', '))
  }
  if (filters.searchQuery) parts.push(`"${filters.searchQuery}"`)
  if (filters.openNow) parts.push('Nyní otevřeno')
  return parts.join(' · ') || 'Vše'
}

export function SavedSearchesSection() {
  const { user } = useAuth()
  const { searches, loading, deleteSearch } = useSavedSearches()
  const router = useRouter()

  if (!user) return null

  const loadSearch = (filters: import('@/hooks/useSavedSearches').SavedSearch['filters']) => {
    const params = new URLSearchParams()
    if (filters.kraj) params.set('kraj', filters.kraj)
    if (filters.searchQuery) params.set('q', filters.searchQuery)
    router.push(`/mapa?${params.toString()}`)
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="font-heading font-semibold text-forest text-base">Uložená hledání</h2>
        <Search className="w-4 h-4 text-gray-300" aria-hidden="true" />
      </div>

      {loading ? (
        <div className="px-5 py-4 text-sm text-gray-400">Načítám…</div>
      ) : searches.length === 0 ? (
        <div className="px-5 py-4 text-sm text-gray-400">
          Žádná uložená hledání. Uložte aktuální filtr na stránce mapy.
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {searches.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-forest truncate">{s.name}</p>
                <p className="text-xs text-gray-400 truncate">{filtersToText(s.filters)}</p>
              </div>
              <button
                onClick={() => loadSearch(s.filters)}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0"
                aria-label={`Načíst hledání ${s.name}`}
              >
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                Načíst
              </button>
              <button
                onClick={() => deleteSearch(s.id)}
                className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                aria-label={`Smazat hledání ${s.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
