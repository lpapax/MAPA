'use client'

import { useState } from 'react'
import { CATEGORY_META } from '@/lib/farms'
import type { FarmCategory } from '@/types/farm'

const LEGEND_CATEGORIES: FarmCategory[] = [
  'zelenina', 'ovoce', 'maso', 'mléko', 'vejce', 'med', 'byliny', 'víno', 'ryby',
]

export function MapLegend() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-8 right-3 z-10">
      {open && (
        <div className="mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-100 p-3 w-40">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Typy farem</p>
          <ul className="space-y-1.5">
            {LEGEND_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat]
              return (
                <li key={cat} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-xs text-neutral-600">{meta.emoji} {meta.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Legenda mapy"
        aria-expanded={open}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-primary-600 hover:border-primary-300 transition-colors cursor-pointer"
      >
        <span className="flex gap-0.5">
          {LEGEND_CATEGORIES.slice(0, 4).map((cat) => (
            <span
              key={cat}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CATEGORY_META[cat].color }}
            />
          ))}
        </span>
        Legenda
      </button>
    </div>
  )
}
