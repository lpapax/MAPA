'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Globe, CheckCircle, Clock, Heart, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, isFarmOpenNow } from '@/lib/farms'
import { useFavoriteFarms } from '@/hooks/useFavoriteFarms'
import { useCompareStore, MAX_COMPARE_FARMS } from '@/store/compareStore'
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

  const { isFavorite, toggleFavorite } = useFavoriteFarms()
  const { isInCompare, toggleCompare, compareIds } = useCompareStore()
  const favorited = isFavorite(farm.slug)
  const comparing = isInCompare(farm.id)
  const compareDisabled = !comparing && compareIds.length >= MAX_COMPARE_FARMS

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
        'bg-white dark:bg-card border transition-[border-color,box-shadow,transform] duration-200',
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
              <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-label="Ověřená farma" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{farm.location.city}, {farm.location.kraj}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Open status */}
          {farm.openingHours && (
            <div className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
              isOpen ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500',
            )}>
              <Clock className="w-2.5 h-2.5" aria-hidden="true" />
              {isOpen ? 'Otevřeno' : 'Zavřeno'}
            </div>
          )}
          {/* Favorite button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite({
                slug: farm.slug,
                name: farm.name,
                categories: farm.categories,
                kraj: farm.location.kraj,
                savedAt: Date.now(),
              })
            }}
            aria-label={favorited ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
            aria-pressed={favorited}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            className="p-2.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <motion.div
              key={favorited ? 'filled' : 'empty'}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
            >
              <Heart
                className={cn('w-4 h-4 transition-colors', favorited ? 'fill-rose-500 text-rose-500' : 'text-neutral-300 hover:text-rose-400')}
                aria-hidden="true"
              />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {farm.description}
      </p>

      {/* Categories */}
      <div className="flex flex-wrap gap-1 mb-3">
        {farm.categories.slice(0, 4).map((cat) => (
          <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface text-primary border border-border">
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
            <a href={`tel:${farm.contact.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors" aria-label={`Telefon: ${farm.contact.phone}`}>
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">{farm.contact.phone}</span>
            </a>
          )}
          {farm.contact.web && (
            <a href={farm.contact.web} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors" aria-label="Web farmy">
              <Globe className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Web</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); if (!compareDisabled) toggleCompare(farm.id) }}
            disabled={compareDisabled}
            aria-label={comparing ? 'Odebrat z porovnání' : 'Přidat do porovnání'}
            aria-pressed={comparing}
            className={cn(
              'text-[11px] px-3 py-1.5 rounded-full border transition-[border-color,background-color,color] cursor-pointer',
              comparing
                ? 'bg-forest text-white border-forest'
                : compareDisabled
                  ? 'opacity-30 border-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'border-neutral-200 text-neutral-400 hover:border-forest hover:text-forest',
            )}
          >
            {comparing
            ? <><Check className="w-3 h-3" aria-hidden="true" /> Porovnat</>
            : 'Porovnat'
          }
          </button>

          <Link
            href={`/farmy/${farm.slug}`}
            onClick={(e) => e.stopPropagation()}
            className={cn('text-[11px] font-medium text-primary hover:text-primary-dark', 'underline-offset-2 hover:underline transition-colors')}
          >
            Detail →
          </Link>
        </div>
      </div>
    </article>
  )
}
