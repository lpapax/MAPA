'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, MapPin, Star, Clock, List, Map as MapIcon, CheckCircle, Heart } from 'lucide-react'
import { MapViewWrapper } from '@/components/map/MapViewWrapper'
import { useFarmStore, getFilteredFarms } from '@/store/farmStore'
import { useCompareStore, MAX_COMPARE_FARMS } from '@/store/compareStore'
import { useFavoriteFarms } from '@/hooks/useFavoriteFarms'
import { CATEGORY_LABELS, isFarmOpenNow } from '@/lib/farms'
import { CompareBar } from '@/components/farms/CompareBar'
import { cn } from '@/lib/utils'
import type { Farm, FarmCategory, FarmMapMarker, KrajCode } from '@/types/farm'

const FILTER_CATEGORIES: FarmCategory[] = [
  'zelenina', 'ovoce', 'maso', 'mléko', 'vejce', 'med', 'byliny',
]

const KRAJ_OPTIONS = [
  'Praha', 'Středočeský', 'Jihočeský', 'Plzeňský', 'Karlovarský',
  'Ústecký', 'Liberecký', 'Královéhradecký', 'Pardubický',
  'Vysočina', 'Jihomoravský', 'Olomoucký', 'Moravskoslezský', 'Zlínský',
]

const CARD_GRADIENTS: Record<string, string> = {
  zelenina: 'from-emerald-300 to-teal-400',
  ovoce: 'from-rose-300 to-pink-400',
  maso: 'from-amber-400 to-orange-500',
  mléko: 'from-sky-300 to-blue-400',
  vejce: 'from-yellow-300 to-amber-400',
  med: 'from-amber-200 to-yellow-300',
  byliny: 'from-lime-300 to-green-400',
  default: 'from-emerald-300 to-teal-500',
}

interface MapSearchPageProps {
  farms: Farm[]
  markers: FarmMapMarker[]
  initialKraj?: KrajCode | null
  initialSearch?: string
}

export function MapSearchPage({ farms: allFarms, markers: allMarkers, initialKraj, initialSearch }: MapSearchPageProps) {
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const store = useFarmStore()

  // Apply URL query params on first mount only
  useEffect(() => {
    if (initialKraj) store.setKraj(initialKraj)
    if (initialSearch) store.setSearchQuery(initialSearch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { filters, setSearchQuery, toggleCategory, setKraj, setOpenNow, clearFilters, selectFarm, hoverFarm, selectedFarmId, hoveredFarmId } = store

  const { isInCompare, toggleCompare, compareIds } = useCompareStore()
  const { isFavorite, toggleFavorite } = useFavoriteFarms()

  const filtered = useMemo(() => getFilteredFarms(allFarms, store), [allFarms, store])
  const hasActiveFilters = filters.categories.length > 0 || filters.kraj !== null || filters.openNow

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Top search bar */}
      <div className="flex-none bg-white border-b border-gray-100 shadow-sm px-4 py-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              placeholder="Hledat farmu nebo město…"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Vyhledávání farem"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-surface"
            />
            {filters.searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" aria-label="Smazat hledání">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-label="Zobrazit/skrýt filtry"
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-200 cursor-pointer',
              filtersOpen || hasActiveFilters
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600',
            )}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filtry
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-white text-primary-600 text-[10px] font-bold flex items-center justify-center">
                {filters.categories.length + (filters.kraj ? 1 : 0) + (filters.openNow ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <div className="flex md:hidden rounded-xl overflow-hidden border border-gray-200">
            <button onClick={() => setMobileView('list')} aria-pressed={mobileView === 'list'} className={cn('flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors', mobileView === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600')}>
              <List className="w-3.5 h-3.5" aria-hidden="true" /> Seznam
            </button>
            <button onClick={() => setMobileView('map')} aria-pressed={mobileView === 'map'} className={cn('flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors', mobileView === 'map' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600')}>
              <MapIcon className="w-3.5 h-3.5" aria-hidden="true" /> Mapa
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-4">
              {/* Categories */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Produkty</div>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kategorie">
                  {FILTER_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => toggleCategory(cat)} aria-pressed={filters.categories.includes(cat)}
                      className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
                        filters.categories.includes(cat) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600',
                      )}>
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kraj */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kraj</div>
                <select
                  value={filters.kraj ?? ''}
                  onChange={(e) => setKraj(e.target.value as typeof filters.kraj || null)}
                  aria-label="Vybrat kraj"
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                >
                  <option value="">Všechny kraje</option>
                  {KRAJ_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Open now */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dostupnost</div>
                <button onClick={() => setOpenNow(!filters.openNow)} aria-pressed={filters.openNow}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                    filters.openNow ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-200 text-gray-600 hover:border-green-400',
                  )}>
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Nyní otevřeno
                </button>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer self-end pb-1">
                  <X className="w-3 h-3" /> Zrušit filtry
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar — 40% on desktop */}
        <aside
          className={cn(
            'flex-none overflow-hidden flex-col border-r border-gray-100 bg-white',
            'md:flex md:w-[400px] lg:w-[440px]',
            mobileView === 'list' ? 'flex w-full' : 'hidden',
          )}
          aria-label="Seznam farem"
        >
          {/* Result count */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 flex-shrink-0">
            <span className="text-sm font-semibold text-forest">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'farma' : filtered.length < 5 ? 'farmy' : 'farem'}
            </span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors">
                Zrušit filtry
              </button>
            )}
          </div>

          {/* Farm list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-gray-300" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Žádné výsledky</p>
                <p className="text-xs text-gray-400">Zkuste upravit filtry nebo vyhledávání</p>
              </div>
            ) : (
              filtered.map((farm) => {
                const isOpen = isFarmOpenNow(farm)
                const isSelected = selectedFarmId === farm.id
                const isHovered = hoveredFarmId === farm.id
                const gradient = CARD_GRADIENTS[farm.categories[0]] ?? CARD_GRADIENTS.default
                const favorited = isFavorite(farm.slug)
                const comparing = isInCompare(farm.id)
                const compareDisabled = !comparing && compareIds.length >= MAX_COMPARE_FARMS
                return (
                  <div
                    key={farm.id}
                    onMouseEnter={() => hoverFarm(farm.id)}
                    onMouseLeave={() => hoverFarm(null)}
                    className={cn(
                      'w-full flex gap-3 p-3 rounded-xl border transition-all duration-200',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-glow'
                        : isHovered
                          ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm',
                    )}
                  >
                    {/* Cover thumb */}
                    <div className={cn('w-14 h-14 rounded-xl flex-shrink-0 bg-gradient-to-br', gradient)} aria-hidden="true" />

                    {/* Info — clickable area */}
                    <button
                      onClick={() => selectFarm(farm.id)}
                      aria-label={`Vybrat farmu ${farm.name}`}
                      aria-pressed={isSelected}
                      className="flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h3 className="font-heading font-semibold text-sm text-forest leading-tight truncate">
                          {farm.name}
                        </h3>
                        {farm.verified && <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" aria-label="Ověřeno" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {farm.location.city} · {farm.location.kraj}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {farm.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary-50 text-primary-600 border border-primary-100">
                              {CATEGORY_LABELS[cat]}
                            </span>
                          ))}
                        </div>
                        {farm.openingHours && (
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', isOpen ? 'text-green-700 bg-green-50' : 'text-gray-400 bg-gray-50')}>
                            {isOpen ? 'Otevřeno' : 'Zavřeno'}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Action buttons */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite({ slug: farm.slug, name: farm.name, categories: farm.categories, kraj: farm.location.kraj, savedAt: Date.now() })}
                        aria-label={favorited ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                        aria-pressed={favorited}
                        className="p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Heart className={cn('w-3.5 h-3.5 transition-colors', favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-300 hover:text-rose-400')} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => { if (!compareDisabled) toggleCompare(farm.id) }}
                        disabled={compareDisabled}
                        aria-label={comparing ? 'Odebrat z porovnání' : 'Přidat do porovnání'}
                        aria-pressed={comparing}
                        className={cn(
                          'text-[9px] px-1.5 py-0.5 rounded-full border transition-all cursor-pointer leading-tight',
                          comparing ? 'bg-forest text-white border-forest' : compareDisabled ? 'opacity-30 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-400 hover:border-forest hover:text-forest',
                        )}
                      >
                        {comparing ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Detail link for selected farm */}
          {selectedFarmId && (() => {
            const farm = allFarms.find((f) => f.id === selectedFarmId)
            return farm ? (
              <div className="flex-shrink-0 p-3 border-t border-gray-100 bg-white">
                <Link href={`/farmy/${farm.slug}`} className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors cursor-pointer">
                  Zobrazit detail farmy
                  <Star className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ) : null
          })()}
        </aside>

        {/* Map — 60% on desktop */}
        <div className={cn('flex-1 overflow-hidden', mobileView === 'map' ? 'flex' : 'hidden md:flex')}>
          <MapViewWrapper markers={allMarkers} />
        </div>
      </div>

      <CompareBar farms={allFarms} />
    </div>
  )
}
