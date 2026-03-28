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
      className="bg-forest py-10"
      aria-labelledby="seasonal-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Label */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-md bg-primary-700 flex items-center justify-center">
              <Sprout className="w-4.5 h-4.5 text-primary-200" aria-hidden="true" />
            </div>
            <div>
              <p className="text-primary-300 text-[10px] uppercase tracking-widest font-semibold">
                {monthName} · sezóna
              </p>
              <h2 id="seasonal-heading" className="font-heading font-semibold text-white text-sm">
                Co je nyní čerstvé:
              </h2>
            </div>
          </div>

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
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-800 border border-primary-700 text-primary-100 text-xs font-medium whitespace-nowrap cursor-default"
              >
                {product.name}
              </span>
            )) : (
              <span className="text-primary-300 text-sm">Zimní zelenina, kořenová zelenina, zelí</span>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/sezona"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 hover:text-white transition-colors duration-150 cursor-pointer group"
          >
            Sezónní kalendář
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
