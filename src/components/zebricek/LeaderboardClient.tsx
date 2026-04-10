'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, Eye, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_META } from '@/lib/farms'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { LeaderboardFarm } from '@/app/zebricek/page'
import type { FarmCategory } from '@/types/farm'

type TabId = 'popular' | 'verified' | 'zelenina' | 'maso' | 'ovoce' | 'med'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'popular',  label: 'Nejnavštěvovanější', icon: '🔥' },
  { id: 'verified', label: 'Ověřené',            icon: '✓'  },
  { id: 'zelenina', label: 'Zelenina',            icon: '🌿' },
  { id: 'maso',     label: 'Maso',               icon: '🥩' },
  { id: 'ovoce',    label: 'Ovoce',              icon: '🍎' },
  { id: 'med',      label: 'Med',                icon: '🍯' },
]

/** Secondary sort: verified first, then alphabetical — used when viewCount is tied. */
function sortFarms(list: LeaderboardFarm[]): LeaderboardFarm[] {
  return [...list].sort((a, b) => {
    if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount
    if (a.verified !== b.verified) return a.verified ? -1 : 1
    return a.name.localeCompare(b.name, 'cs')
  })
}

function rankMedal(rank: number): string | null {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

function FarmRow({ farm, rank }: { farm: LeaderboardFarm; rank: number }) {
  const medal = rankMedal(rank)
  const primaryMeta = CATEGORY_META[farm.categories[0] ?? 'ostatní'] ?? CATEGORY_META.ostatní

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors rounded-xl group cursor-pointer"
      aria-label={`${rank}. místo: ${farm.name}, ${farm.city}`}
    >
      {/* Rank / medal */}
      <div className="w-8 text-center flex-shrink-0" aria-hidden="true">
        {medal ? (
          <span className="text-xl">{medal}</span>
        ) : (
          <span className="text-sm font-semibold text-neutral-400">{rank}</span>
        )}
      </div>

      {/* Thumbnail or category emoji */}
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50 flex items-center justify-center">
        {farm.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={farm.image} alt="" className="w-full h-full object-cover" aria-hidden="true" loading="lazy" />
        ) : (
          <span className="text-lg" aria-hidden="true">{primaryMeta.emoji}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-heading font-bold text-forest text-sm truncate group-hover:text-primary-600 transition-colors">
            {farm.name}
          </span>
          {farm.verified && (
            <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" aria-label="Ověřená farma" />
          )}
        </div>
        <div className="text-xs text-neutral-400 truncate">
          <span aria-label={`Město: ${farm.city}, kraj: ${farm.kraj}`}>{farm.city} · {farm.kraj}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {farm.viewCount > 0 ? (
          <div className="flex items-center gap-1 text-xs text-neutral-400" aria-label={`${farm.viewCount} zobrazení`}>
            <Eye className="w-3 h-3" aria-hidden="true" />
            {farm.viewCount.toLocaleString('cs-CZ')}
          </div>
        ) : (
          <div className="text-xs text-neutral-200">—</div>
        )}
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: primaryMeta.color + '1a', color: primaryMeta.color }}
        >
          {primaryMeta.label}
        </span>
      </div>
    </Link>
  )
}

function RegionBreakdown({ farms }: { farms: LeaderboardFarm[] }) {
  const regions = useMemo(() => {
    const map: Record<string, number> = {}
    for (const f of farms) {
      map[f.kraj] = (map[f.kraj] ?? 0) + 1
    }
    return Object.entries(map)
      .map(([kraj, count]) => ({ kraj, count }))
      .sort((a, b) => b.count - a.count)
  }, [farms])

  return (
    <div className="mt-10">
      <h2 className="font-heading text-xl font-bold text-forest mb-4 text-center">
        Farmy podle krajů
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {regions.map((r, i) => (
          <Link
            key={r.kraj}
            href={`/mapa?kraj=${encodeURIComponent(r.kraj)}`}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-[border-color,background-color,color] duration-150 cursor-pointer',
              i === 0
                ? 'bg-forest text-white shadow-md hover:bg-primary-700'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-700',
            )}
          >
            {i === 0 && <span aria-hidden="true">🏆</span>}
            <span>{r.kraj}</span>
            <span className={cn('text-xs', i === 0 ? 'text-white/70' : 'text-neutral-400')}>
              ({r.count})
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface Props {
  farms: LeaderboardFarm[]
  totalFarms: number
  verifiedCount: number
  krajCount: number
}

export function LeaderboardClient({ farms, totalFarms, verifiedCount, krajCount }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('popular')

  const { ranked, sortNote } = useMemo(() => {
    let list: LeaderboardFarm[]

    switch (activeTab) {
      case 'popular':
        list = sortFarms(farms)
        break
      case 'verified':
        list = sortFarms(farms.filter((f) => f.verified))
        break
      default: {
        const cat = activeTab as FarmCategory
        list = sortFarms(farms.filter((f) => f.categories.includes(cat)))
        break
      }
    }

    const hasRealViews = list.some((f) => f.viewCount > 0)
    const note = hasRealViews
      ? 'Seřazeno podle počtu zobrazení'
      : 'Seřazeno abecedně · data zobrazení se sbírají postupně'

    return { ranked: list.slice(0, 20), sortNote: note }
  }, [activeTab, farms])

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            Žebříček
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3">
            Nejlepší farmy ČR
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Nejnavštěvovanější a ověřené farmy České republiky
          </p>

          {/* Stats */}
          <div className="flex justify-center flex-wrap gap-8">
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-white">
                <AnimatedCounter target={totalFarms} />
              </div>
              <div className="text-white/60 text-sm">Celkem farem</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-white">
                <AnimatedCounter target={verifiedCount} />
              </div>
              <div className="text-white/60 text-sm">Ověřených</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl font-bold text-white">
                <AnimatedCounter target={krajCount} />
              </div>
              <div className="text-white/60 text-sm">Krajů</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-neutral-100 shadow-sm sticky top-[72px] z-30 overflow-x-auto scrollbar-none">
        <div role="tablist" aria-label="Kategorie žebříčku" className="flex justify-center min-w-max mx-auto px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold border-b-2 transition-[border-color,color] duration-150 whitespace-nowrap cursor-pointer',
                activeTab === tab.id
                  ? 'border-earth-400 text-forest'
                  : 'border-transparent text-neutral-500 hover:text-forest',
              )}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked list */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-neutral-400 text-center mb-4">{sortNote}</p>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
          {ranked.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <div className="text-4xl mb-3" aria-hidden="true">🌾</div>
              <p className="font-medium text-neutral-600">Žádné farmy v této kategorii.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {ranked.map((farm, i) => (
                <FarmRow key={farm.id} farm={farm} rank={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Region breakdown */}
        <RegionBreakdown farms={farms} />
      </div>
    </div>
  )
}
