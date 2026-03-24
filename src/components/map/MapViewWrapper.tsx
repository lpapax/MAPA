'use client'

import dynamic from 'next/dynamic'
import type { FarmMapMarker } from '@/types/farm'

// Mapbox GL must be loaded client-side only
const MapView = dynamic(() => import('./MapView').then((m) => ({ default: m.MapView })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground">Načítám mapu…</span>
      </div>
    </div>
  ),
})

interface MapViewWrapperProps {
  markers: FarmMapMarker[]
}

export function MapViewWrapper({ markers }: MapViewWrapperProps) {
  return <MapView markers={markers} />
}
