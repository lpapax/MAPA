'use client'

import { Heart } from 'lucide-react'
import { useFavoriteFarms, type FavoriteFarmEntry } from '@/hooks/useFavoriteFarms'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  entry: FavoriteFarmEntry
}

export function FavoriteButton({ entry }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteFarms()
  const active = isFavorite(entry.slug)

  return (
    <button
      onClick={() => toggleFavorite(entry)}
      aria-label={active ? `Odebrat ${entry.name} z oblíbených` : `Přidat ${entry.name} do oblíbených`}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-sm',
        active
          ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-rose-500 hover:border-rose-200',
      )}
    >
      <Heart
        className={cn('w-4 h-4 transition-all duration-200', active && 'fill-rose-500 text-rose-500')}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">{active ? 'Oblíbeno' : 'Uložit'}</span>
    </button>
  )
}
