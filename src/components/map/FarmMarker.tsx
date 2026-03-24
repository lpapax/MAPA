'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { FarmCategory } from '@/types/farm'

interface FarmMarkerProps {
  id: string
  name: string
  categories: FarmCategory[]
  verified: boolean
  isSelected: boolean
  isHovered: boolean
  onClick: (id: string) => void
  onMouseEnter: (id: string) => void
  onMouseLeave: () => void
}

export function FarmMarker({
  id,
  name,
  categories,
  verified,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FarmMarkerProps) {
  const handleClick = useCallback(() => onClick(id), [id, onClick])
  const handleMouseEnter = useCallback(() => onMouseEnter(id), [id, onMouseEnter])

  const isHighlighted = isSelected || isHovered

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Farma: ${name}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={cn(
        'relative flex items-center justify-center cursor-pointer',
        'transition-transform duration-200',
        isHighlighted ? 'scale-125 z-10' : 'hover:scale-110',
      )}
    >
      {/* Pin shape */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 border-white shadow-marker',
          'transition-colors duration-200',
          'w-8 h-8',
          isSelected
            ? 'bg-accent'
            : isHovered
              ? 'bg-primary-light'
              : 'bg-primary',
        )}
      >
        <CategoryIcon category={categories[0]} />
      </div>

      {/* Verified badge */}
      {verified && (
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white"
          title="Ověřená farma"
        />
      )}

      {/* Pin tail */}
      <div
        className={cn(
          'absolute -bottom-1.5 left-1/2 -translate-x-1/2',
          'w-0 h-0 border-l-4 border-r-4 border-t-6',
          'border-l-transparent border-r-transparent',
          'transition-colors duration-200',
          isSelected
            ? 'border-t-accent'
            : isHovered
              ? 'border-t-primary-light'
              : 'border-t-primary',
        )}
        style={{ borderTopWidth: 6 }}
      />
    </div>
  )
}

function CategoryIcon({ category }: { category: FarmCategory | undefined }) {
  if (!category) return null
  const icons: Partial<Record<FarmCategory, string>> = {
    zelenina: '🥦',
    ovoce: '🍎',
    maso: '🥩',
    mléko: '🥛',
    vejce: '🥚',
    med: '🍯',
    chléb: '🍞',
    sýry: '🧀',
    víno: '🍇',
    byliny: '🌿',
    ryby: '🐟',
  }
  // Note: we use emoji only in the marker SVG-like pin for illustrative purpose.
  // Production: replace with inline SVG Lucide icons per category.
  return (
    <span className="text-[10px] leading-none select-none" aria-hidden="true">
      {icons[category] ?? '🌾'}
    </span>
  )
}
