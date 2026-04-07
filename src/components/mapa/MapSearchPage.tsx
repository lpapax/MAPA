'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, MapPin, Star, Clock, List, Map as MapIcon, CheckCircle, Heart, Bookmark, Navigation2 } from 'lucide-react'
import { MapViewWrapper } from '@/components/map/MapViewWrapper'
import { useFarmStore, getFilteredFarms } from '@/store/farmStore'
import { useGeolocation } from '@/hooks/useGeolocation'
import { haversineKm, formatDistance } from '@/lib/geo'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { useCompareStore, MAX_COMPARE_FARMS } from '@/store/compareStore'
import { useFavoriteFarms } from '@/hooks/useFavoriteFarms'
import { useUserPrefs } from '@/hooks/useUserPrefs'
import { useAuth } from '@/hooks/useAuth'
import { useSavedSearches } from '@/hooks/useSavedSearches'
import { CATEGORY_LABELS, CATEGORY_META, isFarmOpenNow } from '@/lib/farms'
import { CompareBar } from '@/components/farms/CompareBar'
import { cn } from '@/lib/utils'
import type { Farm, FarmCategory, FarmMapMarker, KrajCode } from '@/types/farm'

const FILTER_CATEGORIES: FarmCategory[] = [
  'zelenina', 'ovoce', 'maso', 'mléko', 'vejce', 'med', 'byliny', 'chléb', 'sýry', 'víno', 'ryby', 'ostatní',
]

const KRAJ_OPTIONS = [
  'Praha', 'Středočeský', 'Jihočeský', 'Plzeňský', 'Karlovarský',
  'Ústecký', 'Liberecký', 'Královéhradecký', 'Pardubický',
  'Vysočina', 'Jihomoravský', 'Olomoucký', 'Moravskoslezský', 'Zlínský',
]

const POPULAR_CHIPS: { label: string; query: string }[] = [
  { label: '🥕 Bio zelenina',    query: 'bio zelenina' },
  { label: '🥛 Čerstvé mléko',   query: 'mléko' },
  { label: '🥚 Farmářská vejce', query: 'vejce' },
  { label: '🍯 Místní med',      query: 'med' },
  { label: '🥩 Domácí maso',     query: 'maso' },
  { label: '🍷 Víno',            query: 'víno' },
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
  const { prefs } = useUserPrefs()
  const [mobileView, setMobileView] = useState<'map' | 'list'>(prefs.defaultView)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortByDistance, setSortByDistance] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const { lat: userLat, lng: userLng } = useGeolocation()
  const { searches: recentSearches, addSearch: saveRecentSearch, removeSearch } = useRecentSearches()

  const store = useFarmStore()

  // Apply URL params and user preferences on first mount
  useEffect(() => {
    // URL params take precedence over saved preferences
    if (initialKraj) {
      store.setKraj(initialKraj)
    } else if (prefs.kraj) {
      store.setKraj(prefs.kraj)
    }
    if (initialSearch) store.setSearchQuery(initialSearch)
    // Apply preferred categories only when no URL override
    if (!initialKraj && prefs.categories.length > 0) {
      prefs.categories.forEach((cat) => store.toggleCategory(cat))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { filters, setSearchQuery, toggleCategory, setKraj, setOpenNow, setVerifiedOnly, setHasPhotos, clearFilters, selectFarm, hoverFarm, selectedFarmId, hoveredFarmId } = store

  const { isInCompare, toggleCompare, compareIds } = useCompareStore()
  const { isFavorite, toggleFavorite } = useFavoriteFarms()
  const { user } = useAuth()
  const { saveSearch } = useSavedSearches()
  const [savingSearch, setSavingSearch] = useState(false)

  const filteredBase = useMemo(() => getFilteredFarms(allFarms, store), [allFarms, store])
  const filtered = useMemo(() => {
    if (sortByDistance && userLat != null && userLng != null) {
      return [...filteredBase].sort((a, b) =>
        haversineKm(userLat, userLng, a.location.lat, a.location.lng) -
        haversineKm(userLat, userLng, b.location.lat, b.location.lng)
      )
    }
    return filteredBase
  }, [filteredBase, sortByDistance, userLat, userLng])
  const hasActiveFilters = filters.categories.length > 0 || filters.kraj !== null || filters.openNow || filters.verifiedOnly || filters.hasPhotos

  const PAGE_SIZE = 50
  const [page, setPage] = useState(1)
  // Reset page when filters change
  useEffect(() => { setPage(1) }, [filtered])
  const visibleFarms = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])
  const hasMore = visibleFarms.length < filtered.length
  const loadMore = useCallback(() => setPage((p) => p + 1), [])

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top search bar */}
      <div className="flex-none bg-white border-b border-neutral-100 shadow-sm px-4 py-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              placeholder="Hledat farmu nebo město…"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filters.searchQuery.trim()) {
                  saveRecentSearch(filters.searchQuery.trim())
                  setSearchFocused(false)
                }
              }}
              aria-label="Vyhledávání farem"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-surface"
            />
            {filters.searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors" aria-label="Smazat hledání">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Recent searches dropdown */}
            {searchFocused && !filters.searchQuery && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-200 shadow-lg z-30 overflow-hidden">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 pt-2.5 pb-1">Nedávná hledání</p>
                {recentSearches.map((q) => (
                  <div key={q} className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 group">
                    <button
                      onMouseDown={() => { setSearchQuery(q); setSearchFocused(false) }}
                      className="flex items-center gap-2 flex-1 text-left text-sm text-neutral-600 cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-neutral-300 flex-shrink-0" aria-hidden="true" />
                      {q}
                    </button>
                    <button
                      onMouseDown={() => removeSearch(q)}
                      aria-label={`Smazat hledání "${q}"`}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-300 hover:text-neutral-500 cursor-pointer transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-400 hover:text-primary-600',
            )}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filtry
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-white text-primary-600 text-[10px] font-bold flex items-center justify-center">
                {filters.categories.length + (filters.kraj ? 1 : 0) + (filters.openNow ? 1 : 0) + (filters.verifiedOnly ? 1 : 0) + (filters.hasPhotos ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Save search (logged-in users only, only when filters active) */}
          {user && hasActiveFilters && (
            <button
              onClick={async () => {
                if (savingSearch) return
                const name = prompt('Název hledání:')
                if (!name?.trim()) return
                setSavingSearch(true)
                await saveSearch(name.trim(), filters)
                setSavingSearch(false)
              }}
              disabled={savingSearch}
              aria-label="Uložit aktuální hledání"
              title="Uložit hledání"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-200 text-neutral-500 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {/* Mobile toggle */}
          <div className="flex md:hidden rounded-xl overflow-hidden border border-neutral-200">
            <button onClick={() => setMobileView('list')} aria-pressed={mobileView === 'list'} className={cn('flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors', mobileView === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600')}>
              <List className="w-3.5 h-3.5" aria-hidden="true" /> Seznam
            </button>
            <button onClick={() => setMobileView('map')} aria-pressed={mobileView === 'map'} className={cn('flex items-center gap-1.5 px-3 py-2 text-xs font-medium cursor-pointer transition-colors', mobileView === 'map' ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600')}>
              <MapIcon className="w-3.5 h-3.5" aria-hidden="true" /> Mapa
            </button>
          </div>
        </div>

        {/* Popular chips — only when search is empty and filters closed */}
        {!filtersOpen && !filters.searchQuery && !hasActiveFilters && (
          <div className="max-w-7xl mx-auto mt-2 flex flex-wrap gap-1.5">
            {POPULAR_CHIPS.map((chip) => (
              <button
                key={chip.query}
                onClick={() => { setSearchQuery(chip.query); saveRecentSearch(chip.query) }}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface border border-neutral-200 text-neutral-500 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Filters panel */}
        {filtersOpen && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-neutral-100">
            <div className="flex flex-wrap gap-4">
              {/* Categories */}
              <div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Produkty</div>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kategorie">
                  {FILTER_CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => toggleCategory(cat)} aria-pressed={filters.categories.includes(cat)}
                      className={cn('px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer',
                        filters.categories.includes(cat) ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-400 hover:text-primary-600',
                      )}>
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kraj */}
              <div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Kraj</div>
                <select
                  value={filters.kraj ?? ''}
                  onChange={(e) => setKraj(e.target.value as typeof filters.kraj || null)}
                  aria-label="Vybrat kraj"
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                >
                  <option value="">Všechny kraje</option>
                  {KRAJ_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Availability + quality */}
              <div>
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Dostupnost a kvalita</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setOpenNow(!filters.openNow)} aria-pressed={filters.openNow}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                      filters.openNow ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-neutral-200 text-neutral-600 hover:border-green-400',
                    )}>
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Nyní otevřeno
                  </button>
                  <button onClick={() => setVerifiedOnly(!filters.verifiedOnly)} aria-pressed={filters.verifiedOnly}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                      filters.verifiedOnly ? 'bg-primary-50 border-primary-400 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-400',
                    )}>
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> Pouze ověřené
                  </button>
                  <button onClick={() => setHasPhotos(!filters.hasPhotos)} aria-pressed={filters.hasPhotos}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                      filters.hasPhotos ? 'bg-primary-50 border-primary-400 text-primary-700' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-400',
                    )}>
                    <Star className="w-3.5 h-3.5" aria-hidden="true" /> S fotografiemi
                  </button>
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer self-end pb-1">
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
            'flex-none overflow-hidden flex-col border-r border-neutral-100 bg-white',
            'md:flex md:w-[400px] lg:w-[440px]',
            mobileView === 'list' ? 'flex w-full' : 'hidden',
          )}
          aria-label="Seznam farem"
        >
          {/* Result count + sort */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-50 flex-shrink-0">
            <span className="text-sm font-semibold text-forest">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'farma' : filtered.length < 5 ? 'farmy' : 'farem'}
            </span>
            <div className="flex items-center gap-2">
              {userLat != null && (
                <button
                  onClick={() => setSortByDistance((v) => !v)}
                  aria-pressed={sortByDistance}
                  title="Seřadit podle vzdálenosti"
                  className={cn(
                    'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border transition-colors cursor-pointer',
                    sortByDistance
                      ? 'bg-primary-50 border-primary-400 text-primary-700'
                      : 'border-neutral-200 text-neutral-400 hover:border-primary-300 hover:text-primary-600',
                  )}
                >
                  <Navigation2 className="w-3 h-3" aria-hidden="true" />
                  Vzdálenost
                </button>
              )}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors">
                  Zrušit filtry
                </button>
              )}
            </div>
          </div>

          {/* Farm list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-neutral-300" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">Žádné výsledky</p>
                <p className="text-xs text-neutral-400">Zkuste upravit filtry nebo vyhledávání</p>
              </div>
            ) : (
              visibleFarms.map((farm) => {
                const isOpen = isFarmOpenNow(farm)
                const isSelected = selectedFarmId === farm.id
                const isHovered = hoveredFarmId === farm.id
                const gradient = CARD_GRADIENTS[farm.categories[0]] ?? CARD_GRADIENTS.default
                const primaryMeta = CATEGORY_META[farm.categories[0]] ?? CATEGORY_META.ostatní
                const favorited = isFavorite(farm.slug)
                const thumbUrl = farm.images.find((u) => u.startsWith('http') && !u.includes('placeholder')) ?? null
                const distanceKm = userLat != null && userLng != null
                  ? haversineKm(userLat, userLng, farm.location.lat, farm.location.lng)
                  : null
                const comparing = isInCompare(farm.id)
                const compareDisabled = !comparing && compareIds.length >= MAX_COMPARE_FARMS
                return (
                  <div
                    key={farm.id}
                    onMouseEnter={() => hoverFarm(farm.id)}
                    onMouseLeave={() => hoverFarm(null)}
                    style={{ borderLeftColor: primaryMeta.color }}
                    className={cn(
                      'w-full flex gap-3 p-3 rounded-xl border border-l-4 transition-all duration-200',
                      isSelected
                        ? 'bg-primary-50 shadow-glow border-r-primary-500 border-t-primary-500 border-b-primary-500'
                        : isHovered
                          ? 'bg-primary-50/50 shadow-sm border-r-primary-300 border-t-primary-300 border-b-primary-300'
                          : 'bg-white hover:shadow-sm border-r-neutral-100 border-t-neutral-100 border-b-neutral-100',
                    )}
                  >
                    {/* Cover thumb — real photo or emoji+gradient fallback */}
                    <div className={cn('w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-gradient-to-br relative', gradient)} aria-hidden="true">
                      {thumbUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-2xl">{primaryMeta.emoji}</span>
                      )}
                    </div>

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
                      <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1.5">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {farm.location.city} · {farm.location.kraj}
                        {distanceKm != null && (
                          <span className="ml-auto text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">
                            {formatDistance(distanceKm)}
                          </span>
                        )}
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
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', isOpen ? 'text-green-700 bg-green-50' : 'text-neutral-400 bg-neutral-50')}>
                            {isOpen ? 'Otevřeno' : 'Zavřeno'}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Action buttons — min 44×44px touch targets */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite({ slug: farm.slug, name: farm.name, categories: farm.categories, kraj: farm.location.kraj, savedAt: Date.now() })}
                        aria-label={favorited ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
                        aria-pressed={favorited}
                        className="w-[44px] h-[44px] flex items-center justify-center rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Heart className={cn('w-4 h-4 transition-colors', favorited ? 'fill-rose-500 text-rose-500' : 'text-neutral-300 hover:text-rose-400')} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => { if (!compareDisabled) toggleCompare(farm.id) }}
                        disabled={compareDisabled}
                        aria-label={comparing ? 'Odebrat z porovnání' : 'Přidat do porovnání'}
                        aria-pressed={comparing}
                        className={cn(
                          'w-[44px] h-[22px] flex items-center justify-center rounded-full border text-[9px] font-bold transition-all cursor-pointer',
                          comparing ? 'bg-forest text-white border-forest' : compareDisabled ? 'opacity-30 border-neutral-200 text-neutral-400 cursor-not-allowed' : 'border-neutral-200 text-neutral-400 hover:border-forest hover:text-forest',
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

          {/* Load more */}
          {hasMore && (
            <div className="flex-shrink-0 px-3 pb-3">
              <button
                onClick={loadMore}
                className="w-full py-2 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Načíst další ({filtered.length - visibleFarms.length} zbývá)
              </button>
            </div>
          )}

          {/* Detail link for selected farm */}
          {selectedFarmId && (() => {
            const farm = allFarms.find((f) => f.id === selectedFarmId)
            return farm ? (
              <div className="flex-shrink-0 p-3 border-t border-neutral-100 bg-white">
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
