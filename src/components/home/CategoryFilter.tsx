'use client'

import { useState } from 'react'
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
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Všechny', icon: LayoutGrid },
  { id: 'maso', label: 'Maso', icon: Flame },
  { id: 'mléko', label: 'Mléčné', icon: Milk },
  { id: 'vejce', label: 'Vejce', icon: Egg },
  { id: 'ovoce', label: 'Ovoce', icon: Apple },
  { id: 'zelenina', label: 'Zelenina', icon: Leaf },
  { id: 'med', label: 'Med', icon: Sun },
  { id: 'byliny', label: 'Byliny', icon: Flower2 },
  { id: 'ryby', label: 'Ryby', icon: Fish },
  { id: 'chléb', label: 'Pečivo', icon: Wheat },
]

export function CategoryFilter() {
  const [active, setActive] = useState('all')

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Fade indicator — right edge (mobile) */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" aria-hidden="true" />
        <div
          role="group"
          aria-label="Filtrovat podle kategorie"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3"
        >
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium flex-shrink-0',
                  'border transition-all duration-200 cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600',
                )}
              >
                <Icon
                  className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400')}
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
