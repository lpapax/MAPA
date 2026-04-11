'use client'

import { useState } from 'react'
import { FarmList } from './FarmList'
import { MapViewWrapper } from '@/components/map/MapViewWrapper'
import { MobileToggle } from './MobileToggle'
import { cn } from '@/lib/utils'
import type { Farm, FarmMapMarker } from '@/types/farm'

interface MainLayoutProps {
  farms: Farm[]
  markers: FarmMapMarker[]
}

export function MainLayout({ farms, markers }: MainLayoutProps) {
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map')

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* Desktop: side-by-side | Mobile: stacked with toggle */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar — 30% on desktop, full on mobile list view */}
        <div
          className={cn(
            'flex-none overflow-hidden',
            // Desktop
            'lg:w-[360px] lg:flex lg:flex-col lg:border-r lg:border-border',
            // Mobile
            mobileView === 'list' ? 'flex flex-col w-full' : 'hidden',
          )}
        >
          <FarmList farms={farms} />
        </div>

        {/* Map — fills remaining space on desktop, full on mobile map view */}
        <div
          className={cn(
            'flex-1 overflow-hidden',
            // Mobile
            mobileView === 'map' ? 'flex' : 'hidden lg:flex',
          )}
        >
          <MapViewWrapper markers={markers} />
        </div>
      </div>

      {/* Mobile toggle bar */}
      <div className="lg:hidden flex items-center justify-center py-2.5 px-4 bg-white dark:bg-card border-t border-border">
        <MobileToggle view={mobileView} onChange={setMobileView} />
      </div>
    </div>
  )
}
