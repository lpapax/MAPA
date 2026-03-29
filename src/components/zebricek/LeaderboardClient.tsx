'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, Eye, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_META } from '@/lib/farms'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import type { LeaderboardFarm } from '@/app/zebricek/page'

type TabId = 'popular' | 'verified' | 'zelenina' | 'maso' | 'ovoce' | 'med'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'popular',  label: 'Nejnavštěvovanější', icon: '🔥' },
  { id: 'verified', label: 'Ověřené',            icon: '✓'  },
  { id: 'zelenina', label: 'Zelenina',            icon: '🌿' },
  { id: 'maso',     label: 'Maso',               icon: '🥩' },
  { id: 'ovoce',    label: 'Ovoce',              icon: '🍎' },
  { id: 'med',      label: 'Med',                icon: '🍯' },
]

function rankMedal(rank: number): string | null {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

interface FarmRowProps {
  farm: LeaderboardFarm
  rank: number
}

function FarmRow({ farm, rank }: FarmRowProps) {
  const medal = rankMedal(rank)
  const primaryMeta = CATEGORY_META[farm.categories[0]] ?? CATEGORY_META.ostatní

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors rounded-xl group cursor-pointer"
      aria-label={`${farm.name}, ${farm.city}, rank ${rank}`}
    >
      {/* Rank / medal */}
      <div className="w-8 text-center flex-shrink-0">
        {medal ? (
          <span className="text-xl" aria-hidden="true">{medal}</span>
        ) : (
          <span className="text-sm font-semibold text-neutral-400">{rank}</span>
        )}
      </div>

      {/* Thumbnail or emoji */}
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50 flex items-center justify-center">
        {farm.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={farm.image} alt="" className="w-full h-full object-cover" aria-hidden="true" />
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
        <div className="text-xs text-neutral-400 truncate">{farm.city} · {farm.kraj}</div>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {farm.viewCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Eye className="w-3 h-3" aria-hidden="true" />
            {farm.viewCount.toLocaleString('cs-CZ')}
          </div>
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

interface RegionBubble {
  kraj: string
  count: number
}

function RegionBreakdown({ farms }: { farms: LeaderboardFarm[] }) {
  const regions: RegionBubble[] = useMemo(() => {
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
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer',
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

  const ranked = useMemo(() => {
    let list: LeaderboardFarm[]

    switch (activeTab) {
      case 'popular':
        list = [...farms].sort((a, b) => b.viewCount - a.viewCount)
        break
      case 'verified':
        list = farms.filter((f) => f.verified).sort((a, b) => b.viewCount - a.viewCount)
        break
      default:
        list = farms.filter((f) => f.categories.includes(activeTab as never)).sort((a, b) => b.viewCount - a.viewCount)
        break
    }

    return list.slice(0, 20)
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
            Hodnocení, oblíbenost a přímý prodej
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
        <div className="flex justify-center min-w-max mx-auto px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              className={cn(
                'flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer',
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
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
          {ranked.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <div className="text-4xl mb-3" aria-hidden="true">🌾</div>
              <p className="font-medium">Žádné farmy nenalezeny.</p>
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
