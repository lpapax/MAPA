'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Globe, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, isFarmOpenNow } from '@/lib/farms'
import type { Farm } from '@/types/farm'

interface FarmCardProps {
  farm: Farm
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function FarmCard({ farm, isSelected, isHovered, onSelect, onHover }: FarmCardProps) {
  const isOpen = isFarmOpenNow(farm)
  const handleClick = useCallback(() => onSelect(farm.id), [farm.id, onSelect])
  const handleMouseEnter = useCallback(() => onHover(farm.id), [farm.id, onHover])
  const handleMouseLeave = useCallback(() => onHover(null), [onHover])

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Farma ${farm.name}${isSelected ? ' – vybraná' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={cn(
        'group relative rounded-xl p-4 cursor-pointer',
        'bg-white border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isSelected
          ? 'border-primary shadow-card-hover ring-1 ring-primary'
          : isHovered
            ? 'border-primary/40 shadow-card'
            : 'border-border shadow-sm hover:shadow-card hover:border-primary/30',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
              {farm.name}
            </h3>
            {farm.verified && (
              <CheckCircle
                className="w-3.5 h-3.5 text-primary flex-shrink-0"
                aria-label="Ověřená farma"
              />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">
              {farm.location.city}, {farm.location.kraj}
            </span>
          </div>
        </div>

        {/* Open status */}
        {farm.openingHours && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0',
              isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500',
            )}
          >
            <Clock className="w-2.5 h-2.5" aria-hidden="true" />
            {isOpen ? 'Otevřeno' : 'Zavřeno'}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {farm.description}
      </p>

      {/* Categories */}
      <div className="flex flex-wrap gap-1 mb-3">
        {farm.categories.slice(0, 4).map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface text-primary border border-border"
          >
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
        {farm.categories.length > 4 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">
            +{farm.categories.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {farm.contact.phone && (
            <a
              href={`tel:${farm.contact.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Telefon: ${farm.contact.phone}`}
            >
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">{farm.contact.phone}</span>
            </a>
          )}
          {farm.contact.web && (
            <a
              href={farm.contact.web}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              aria-label="Web farmy"
            >
              <Globe className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Web</span>
            </a>
          )}
        </div>

        <Link
          href={`/farmy/${farm.slug}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'text-[11px] font-medium text-primary hover:text-primary-dark',
            'underline-offset-2 hover:underline transition-colors',
          )}
        >
          Detail →
        </Link>
      </div>
    </article>
  )
}
