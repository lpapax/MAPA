'use client'

import { Sprout } from 'lucide-react'
import Link from 'next/link'
import { SEASONAL_CALENDAR, MONTH_NAMES } from '@/data/mockData'

function getCurrentSeasonalProducts(): { name: string }[] {
  const month = new Date().getMonth() + 1 // 1-12
  return SEASONAL_CALENDAR.filter((item) => item.months.includes(month))
}

export function SeasonalBanner() {
  const month = new Date().getMonth() // 0-11
  const monthName = MONTH_NAMES[month]
  const products = getCurrentSeasonalProducts()

  return (
    <section
      className="py-14 bg-seasonal overflow-hidden relative"
      aria-labelledby="seasonal-heading"
    >
      {/* Organic blob decorations */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/6"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Label */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">
                {monthName}
              </p>
              <h2 id="seasonal-heading" className="font-heading font-bold text-white text-base">
                Co je nyní v sezóně:
              </h2>
            </div>
          </div>

          {/* Products scroll strip */}
          <div
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 flex-1"
            role="list"
            aria-label="Sezónní produkty"
          >
            {products.length > 0 ? products.map((product) => (
              <span
                key={product.name}
                role="listitem"
                className="flex-shrink-0 px-4 py-1.5 rounded-full bg-white/18 border border-white/25 text-white text-sm font-medium backdrop-blur-sm whitespace-nowrap hover:bg-white/28 transition-colors cursor-default"
              >
                {product.name}
              </span>
            )) : (
              <span className="text-white/60 text-sm">Zimní zelenina, kořenová zelenina, zelí</span>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/sezona"
            className="flex-shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/18 border border-white/28 text-white text-sm font-semibold hover:bg-white/26 transition-colors duration-200 cursor-pointer backdrop-blur-sm"
          >
            Sezónní kalendář
          </Link>
        </div>
      </div>
    </section>
  )
}
