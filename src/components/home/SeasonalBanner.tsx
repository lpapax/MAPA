import { Leaf } from 'lucide-react'
import { SEASONAL_PRODUCTS } from '@/data/mockData'

export function SeasonalBanner() {
  return (
    <section
      className="py-12 bg-seasonal overflow-hidden relative"
      aria-labelledby="seasonal-heading"
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-white/5"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Label */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70 text-[10px] uppercase tracking-widest font-semibold">
                Jarní sezóna
              </p>
              <h2 id="seasonal-heading" className="font-heading font-bold text-white text-base">
                Právě teď v sezóně:
              </h2>
            </div>
          </div>

          {/* Products scroll */}
          <div
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 flex-1"
            role="list"
            aria-label="Sezónní produkty"
          >
            {SEASONAL_PRODUCTS.map((product) => (
              <span
                key={product}
                role="listitem"
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/25 text-white text-sm font-medium backdrop-blur-sm whitespace-nowrap hover:bg-white/30 transition-colors cursor-default"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
