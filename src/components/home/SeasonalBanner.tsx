'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SEASONAL_CALENDAR, MONTH_NAMES } from '@/data/mockData'

function getCurrentSeasonalProducts(): { name: string }[] {
  const month = new Date().getMonth() + 1
  return SEASONAL_CALENDAR.filter((item) => item.months.includes(month))
}

const FALLBACK_PRODUCTS = [
  { name: 'Zimní zelenina' },
  { name: 'Kořenová zelenina' },
  { name: 'Zelí' },
]

export function SeasonalBanner() {
  const month = new Date().getMonth()
  const monthName = MONTH_NAMES[month]
  const products = getCurrentSeasonalProducts()
  const displayProducts = products.length > 0 ? products : FALLBACK_PRODUCTS

  return (
    <section
      className="relative bg-forest overflow-hidden"
      aria-labelledby="seasonal-heading"
    >
      {/* Giant month watermark — anchored right, vertically centred */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 font-heading font-bold text-white/[0.045] uppercase select-none pointer-events-none leading-none flex items-center"
        style={{ fontSize: 'clamp(6rem, 18vw, 14rem)', letterSpacing: '-0.02em' }}
      >
        {monthName}
      </span>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-20">

          {/* Left: editorial block */}
          <div className="flex-1 min-w-0">
            <p className="text-primary-400 text-[10px] font-bold uppercase tracking-[0.22em] mb-3.5">
              {monthName} · sezóna
            </p>
            <h2
              id="seasonal-heading"
              className="font-heading font-bold text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
            >
              Co je nyní čerstvé
            </h2>

            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2.5"
              role="list"
              aria-label="Sezónní produkty"
            >
              {displayProducts.map((product, i) => (
                <span
                  key={product.name}
                  role="listitem"
                  className="text-white/70 text-sm font-medium flex items-center gap-2.5"
                >
                  {i > 0 && (
                    <span className="w-1 h-1 rounded-full bg-primary-600 flex-shrink-0" aria-hidden="true" />
                  )}
                  {product.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            href="/sezona"
            className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-semibold hover:bg-white/[0.16] transition-[background-color] duration-150 whitespace-nowrap cursor-pointer flex-shrink-0 self-start lg:self-auto group"
          >
            Sezónní kalendář
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
