'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryIcon } from '@/components/ui/CategoryIcon'

interface Category {
  id: string
  label: string
  mapQuery?: string
}

const CATEGORIES: Category[] = [
  { id: 'all',      label: 'Všechny'  },
  { id: 'zelenina', label: 'Zelenina', mapQuery: 'zelenina' },
  { id: 'ovoce',    label: 'Ovoce',    mapQuery: 'ovoce'    },
  { id: 'maso',     label: 'Maso',     mapQuery: 'maso'     },
  { id: 'mléko',    label: 'Mléčné',   mapQuery: 'mléko'    },
  { id: 'vejce',    label: 'Vejce',    mapQuery: 'vejce'    },
  { id: 'med',      label: 'Med',      mapQuery: 'med'      },
  { id: 'byliny',   label: 'Byliny',   mapQuery: 'byliny'   },
  { id: 'ryby',     label: 'Ryby',     mapQuery: 'ryby'     },
  { id: 'chléb',    label: 'Pečivo',   mapQuery: 'chléb'    },
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
        {/* Fade edges on mobile */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />

        <div
          role="group"
          aria-label="Přejít na kategorii farem"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3"
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat)}
                aria-pressed={isActive}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm font-semibold flex-shrink-0',
                  'border transition-colors duration-150 cursor-pointer whitespace-nowrap',
                  isActive
                    ? 'border-primary-600 text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/60',
                )}
              >
                {/* Sliding background pill */}
                {isActive && (
                  <motion.span
                    layoutId="category-pill"
                    className="absolute inset-0 rounded-full bg-primary-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  {cat.id === 'all' ? (
                    <LayoutGrid
                      className={cn('w-4 h-4', isActive ? 'text-white' : 'text-neutral-400')}
                      aria-hidden="true"
                    />
                  ) : (
                    <CategoryIcon
                      category={cat.id}
                      size={18}
                      className={isActive ? 'brightness-0 invert' : ''}
                    />
                  )}
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
