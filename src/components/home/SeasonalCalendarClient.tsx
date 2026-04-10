'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SEASONAL_CALENDAR, MONTH_NAMES } from '@/data/mockData'
import type { FarmCategory } from '@/types/farm'

const CATEGORIES: { value: FarmCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Vše' },
  { value: 'zelenina', label: 'Zelenina' },
  { value: 'ovoce', label: 'Ovoce' },
  { value: 'byliny', label: 'Byliny' },
  { value: 'med', label: 'Med' },
  { value: 'vejce', label: 'Vejce' },
]

export function SeasonalCalendarClient() {
  const currentMonth = new Date().getMonth() + 1
  const [activeCategory, setActiveCategory] = useState<FarmCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? SEASONAL_CALENDAR
    : SEASONAL_CALENDAR.filter((item) => item.category === activeCategory)

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtry kategorií">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            aria-pressed={activeCategory === cat.value}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-[background-color,border-color,color] duration-150 cursor-pointer active:scale-[0.97]',
              activeCategory === cat.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-400 hover:text-primary-600',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MONTH_NAMES.map((monthName, idx) => {
          const month = idx + 1
          const isCurrent = month === currentMonth
          const monthItems = filtered.filter((item) => item.months.includes(month))

          return (
            <div
              key={month}
              className={cn(
                'rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] duration-200',
                isCurrent
                  ? 'bg-primary-50 border-primary-300 shadow-card ring-2 ring-primary-200'
                  : 'bg-white border-neutral-100 shadow-sm',
              )}
            >
              {/* Month header */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={cn(
                    'font-heading font-bold text-sm',
                    isCurrent ? 'text-primary-700' : 'text-forest',
                  )}
                >
                  {monthName}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-600 text-white">
                    Nyní
                  </span>
                )}
              </div>

              {/* Products */}
              {monthItems.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {monthItems.map((item) => (
                    <span
                      key={item.name}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-white border border-neutral-100 shadow-sm text-neutral-600"
                      title={item.name}
                    >
                      <span aria-hidden="true">{item.emoji}</span>
                      {item.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-300 italic">Žádné produkty v této kategorii</p>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-neutral-400 mt-6 text-center">
        Sezóny jsou orientační a mohou se lišit dle regionu a počasí.
      </p>
    </div>
  )
}
