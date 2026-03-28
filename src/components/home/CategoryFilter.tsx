'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="bg-cream border-b border-gray-100 shadow-sm sticky top-[72px] z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Fade — left edge */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />
        {/* Fade — right edge */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream to-transparent z-10 sm:hidden" aria-hidden="true" />

        <div
          role="group"
          aria-label="Filtrovat podle kategorie"
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3"
        >
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <motion.div key={id} layout className="relative">
                <motion.button
                  onClick={() => setActive(id)}
                  aria-pressed={isActive}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0',
                    'border transition-colors duration-200 cursor-pointer whitespace-nowrap z-10',
                    isActive
                      ? 'text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/50',
                  )}
                >
                  <Icon
                    className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400 transition-colors')}
                    aria-hidden="true"
                  />
                  {label}
                </motion.button>
                {isActive && (
                  <motion.div
                    layoutId="active-category"
                    className="absolute inset-0 bg-primary-600 rounded-full shadow-sm"
                    style={{ zIndex: 0 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
