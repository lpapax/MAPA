'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Flame,
  Milk,
  Egg,
  Apple,
  Leaf,
  Sun,
  Flower2,
  Fish,
  Wheat,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  label: string
  icon: React.ElementType
  mapQuery?: string
}

const CATEGORIES: Category[] = [
  { id: 'all',      label: 'Všechny',  icon: LayoutGrid },
  { id: 'zelenina', label: 'Zelenina', icon: Leaf,    mapQuery: 'zelenina' },
  { id: 'ovoce',    label: 'Ovoce',    icon: Apple,   mapQuery: 'ovoce' },
  { id: 'maso',     label: 'Maso',     icon: Flame,   mapQuery: 'maso' },
  { id: 'mléko',    label: 'Mléčné',   icon: Milk,    mapQuery: 'mléko' },
  { id: 'vejce',    label: 'Vejce',    icon: Egg,     mapQuery: 'vejce' },
  { id: 'med',      label: 'Med',      icon: Sun,     mapQuery: 'med' },
  { id: 'byliny',   label: 'Byliny',   icon: Flower2, mapQuery: 'byliny' },
  { id: 'ryby',     label: 'Ryby',     icon: Fish,    mapQuery: 'ryby' },
  { id: 'chléb',    label: 'Pečivo',   icon: Wheat,   mapQuery: 'chléb' },
]

export function CategoryFilter() {
  const [active, setActive] = useState('all')
  const router = useRouter()

  const handleClick = (cat: Category) => {
    setActive(cat.id)
    router.push(cat.mapQuery ? `/mapa?q=${encodeURIComponent(cat.mapQuery)}` : '/mapa')
  }

  return (
    <div className="bg-cream border-b border-neutral-100 shadow-sm sticky top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Fade — left edge */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />
        {/* Fade — right edge */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />

        <div
          role="group"
          aria-label="Přejít na kategorii farem"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3"
        >
          {CATEGORIES.map((cat) => {
            const { id, label, icon: Icon } = cat
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => handleClick(cat)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-semibold flex-shrink-0',
                  'border transition-all duration-200 cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/60',
                )}
              >
                <Icon
                  className={cn('w-4 h-4', isActive ? 'text-white' : 'text-neutral-400')}
                  aria-hidden="true"
                />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
