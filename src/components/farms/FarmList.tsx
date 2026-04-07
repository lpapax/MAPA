'use client'

import { useMemo } from 'react'
import { FarmCard } from './FarmCard'
import { FarmFilters } from './FarmFilters'
import { useFarmStore, getFilteredFarms } from '@/store/farmStore'
import type { Farm } from '@/types/farm'

interface FarmListProps {
  farms: Farm[]
}

export function FarmList({ farms }: FarmListProps) {
  const store = useFarmStore()
  const { selectedFarmId, hoveredFarmId, selectFarm, hoverFarm } = store

  const filtered = useMemo(() => getFilteredFarms(farms, store), [farms, store])

  return (
    <aside
      className="flex flex-col h-full bg-surface"
      aria-label="Seznam farem"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border bg-white/80 dark:bg-card/90 backdrop-blur-sm">
        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-base font-bold text-foreground">
            Mapa farem
          </h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length} {filtered.length === 1 ? 'farma' : filtered.length < 5 ? 'farmy' : 'farem'}
          </span>
        </div>
        <FarmFilters />
      </div>

      {/* Farm cards */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-2.5"
        role="list"
        aria-label="Farmy"
      >
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((farm) => (
            <div key={farm.id} role="listitem">
              <FarmCard
                farm={farm}
                isSelected={selectedFarmId === farm.id}
                isHovered={hoveredFarmId === farm.id}
                onSelect={selectFarm}
                onHover={hoverFarm}
              />
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

function EmptyState() {
  const { clearFilters } = useFarmStore()
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground mb-1">Žádné farmy nenalezeny</p>
      <p className="text-xs text-muted-foreground mb-4">
        Zkuste upravit nebo zrušit filtry
      </p>
      <button
        onClick={clearFilters}
        className="text-xs font-medium text-primary hover:text-primary-dark underline-offset-2 hover:underline cursor-pointer transition-colors"
      >
        Zrušit filtry
      </button>
    </div>
  )
}
