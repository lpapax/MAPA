'use client'

import { Map, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileToggleProps {
  view: 'map' | 'list'
  onChange: (view: 'map' | 'list') => void
}

export function MobileToggle({ view, onChange }: MobileToggleProps) {
  return (
    <div
      className="flex rounded-xl overflow-hidden border border-border bg-white shadow-card"
      role="group"
      aria-label="Přepínač zobrazení"
    >
      <button
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-150',
          view === 'list'
            ? 'bg-primary text-white'
            : 'text-muted-foreground hover:text-primary',
        )}
      >
        <List className="w-4 h-4" aria-hidden="true" />
        Seznam
      </button>
      <button
        onClick={() => onChange('map')}
        aria-pressed={view === 'map'}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-150',
          view === 'map'
            ? 'bg-primary text-white'
            : 'text-muted-foreground hover:text-primary',
        )}
      >
        <Map className="w-4 h-4" aria-hidden="true" />
        Mapa
      </button>
    </div>
  )
}
