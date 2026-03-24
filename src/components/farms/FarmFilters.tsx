'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/farms'
import { useFarmStore, selectHasActiveFilters } from '@/store/farmStore'
import type { FarmCategory } from '@/types/farm'

const CATEGORY_OPTIONS: FarmCategory[] = [
  'zelenina',
  'ovoce',
  'maso',
  'mléko',
  'vejce',
  'med',
  'chléb',
  'sýry',
  'víno',
  'byliny',
  'ryby',
]

export function FarmFilters() {
  const { filters, toggleCategory, setSearchQuery, setOpenNow, clearFilters } = useFarmStore()
  const hasActive = useFarmStore(selectHasActiveFilters)

  return (
    <div className="space-y-3 pb-3 border-b border-border">
      {/* Search bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Hledat farmu nebo město…"
          value={filters.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full pl-9 pr-3 py-2 rounded-xl text-sm',
            'bg-white border border-border',
            'placeholder:text-muted-foreground/60 text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'transition-shadow duration-150',
          )}
          aria-label="Vyhledávání farem"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            aria-label="Smazat hledání"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          Filtry:
        </div>

        {/* Open now toggle */}
        <button
          onClick={() => setOpenNow(!filters.openNow)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 cursor-pointer',
            filters.openNow
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
          )}
          aria-pressed={filters.openNow}
        >
          Nyní otevřeno
        </button>

        {/* Clear filters */}
        {hasActive && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-muted-foreground hover:text-destructive border border-transparent hover:border-red-200 cursor-pointer transition-colors duration-150"
            aria-label="Zrušit všechny filtry"
          >
            <X className="w-3 h-3" />
            Zrušit
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kategorie produktů">
        {CATEGORY_OPTIONS.map((cat) => {
          const active = filters.categories.includes(cat)
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150 cursor-pointer',
                active
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white border-border text-muted-foreground hover:border-primary/50 hover:text-primary',
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
