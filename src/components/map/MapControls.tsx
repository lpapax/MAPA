'use client'

import { Locate, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex items-center justify-center w-9 h-9',
        'bg-white hover:bg-surface text-foreground',
        'cursor-pointer transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
    >
      {children}
    </button>
  )
}

export function MapControls({ onZoomIn, onZoomOut, onLocate }: MapControlsProps) {
  return (
    <div className="absolute right-3 bottom-8 flex flex-col gap-1 z-10">
      {/* Zoom controls */}
      <div className="flex flex-col rounded-xl overflow-hidden shadow-card border border-border bg-white">
        <ControlButton onClick={onZoomIn} label="Přiblížit">
          <ZoomIn className="w-4 h-4" />
        </ControlButton>
        <div className="h-px bg-border" />
        <ControlButton onClick={onZoomOut} label="Oddálit">
          <ZoomOut className="w-4 h-4" />
        </ControlButton>
      </div>

      {/* Locate button */}
      <button
        onClick={onLocate}
        aria-label="Moje poloha"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-xl',
          'bg-white hover:bg-surface text-foreground shadow-card border border-border',
          'cursor-pointer transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        )}
      >
        <Locate className="w-4 h-4" />
      </button>
    </div>
  )
}
