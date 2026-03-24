'use client'

import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'
import type { Farm } from '@/types/farm'

interface CompareBarProps {
  farms: Farm[]
}

export function CompareBar({ farms }: CompareBarProps) {
  const { compareIds, toggleCompare, clearCompare } = useCompareStore()

  if (compareIds.length === 0) return null

  const selected = compareIds
    .map((id) => farms.find((f) => f.id === id))
    .filter((f): f is Farm => Boolean(f))

  const url = `/porovnat?ids=${compareIds.join(',')}`

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-40 flex justify-center pointer-events-none">
      <div className="bg-forest text-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 pointer-events-auto max-w-lg w-full border border-white/10">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 mb-0.5">Vybrané k porovnání</p>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((farm) => (
              <span key={farm.id} className="flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded-lg">
                {farm.name}
                <button
                  onClick={() => toggleCompare(farm.id)}
                  className="text-white/50 hover:text-white cursor-pointer"
                  aria-label={`Odebrat ${farm.name} z porovnání`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Zrušit
          </button>
          <Link
            href={url}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold transition-colors"
          >
            Porovnat {selected.length}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
