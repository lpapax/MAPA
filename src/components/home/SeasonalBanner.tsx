'use client'

import { Sprout, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SEASONAL_CALENDAR, MONTH_NAMES } from '@/data/mockData'

function getCurrentSeasonalProducts(): { name: string }[] {
  const month = new Date().getMonth() + 1
  return SEASONAL_CALENDAR.filter((item) => item.months.includes(month))
}

export function SeasonalBanner() {
  const month = new Date().getMonth()
  const monthName = MONTH_NAMES[month]
  const products = getCurrentSeasonalProducts()

  return (
    <section
      className="bg-primary-50 border-y border-primary-100"
      aria-labelledby="seasonal-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Label */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-primary-500 text-[10px] uppercase tracking-widest font-semibold leading-none mb-0.5">
                {monthName} · sezóna
              </p>
              <h2 id="seasonal-heading" className="font-heading font-semibold text-forest text-sm leading-none">
                Co je nyní čerstvé
              </h2>
            </div>
          </div>

          <div className="w-px h-8 bg-primary-200 hidden sm:block flex-shrink-0" aria-hidden="true" />

          {/* Products */}
          <div
            className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1"
            role="list"
            aria-label="Sezónní produkty"
          >
            {products.length > 0 ? products.map((product) => (
              <span
                key={product.name}
                role="listitem"
                className="flex-shrink-0 px-3 py-1 rounded-full bg-white border border-primary-200 text-primary-700 text-xs font-medium whitespace-nowrap shadow-sm"
              >
                {product.name}
              </span>
            )) : (
              <span className="text-primary-600 text-sm">Zimní zelenina, kořenová zelenina, zelí</span>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/sezona"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-150 cursor-pointer group"
          >
            Sezónní kalendář
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
