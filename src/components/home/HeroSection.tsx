'use client'

import Link from 'next/link'
import { ArrowRight, Map, Tractor } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATS = [
  { value: '247', label: 'farem' },
  { value: '14', label: 'krajů' },
  { value: '1 200', label: 'produktů' },
]

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Map-like background */}
      <div className="absolute inset-0 bg-hero-map" aria-hidden="true" />

      {/* Topographic SVG overlay */}
      <TopoOverlay />

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse" aria-hidden="true" />
            247 farem aktuálně online
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
          >
            Nakupujte přímo
            <br />
            <span className="text-primary-300">od farmářů</span>
            <br />
            z celé ČR
          </h1>

          <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
            Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/mapa"
              className={cn(
                'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl',
                'bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm',
                'transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl',
                'hover:-translate-y-0.5',
              )}
            >
              <Map className="w-4 h-4" aria-hidden="true" />
              Najít farmu
              <ArrowRight className="w-4 h-4 ml-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/pridat-farmu"
              className={cn(
                'inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl',
                'border-2 border-white/40 hover:border-white/70 text-white font-semibold text-sm',
                'bg-white/10 hover:bg-white/15 backdrop-blur-sm',
                'transition-all duration-200 cursor-pointer',
                'hover:-translate-y-0.5',
              )}
            >
              <Tractor className="w-4 h-4" aria-hidden="true" />
              Jsem farmář
            </Link>
          </div>

          {/* Stats */}
          <div className="inline-flex items-center gap-0 glass rounded-2xl overflow-hidden">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'px-5 py-3 text-center',
                  i < STATS.length - 1 && 'border-r border-white/20',
                )}
              >
                <div className="font-heading font-bold text-xl text-white leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-white/65 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
        <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" aria-hidden="true" />
        </div>
        <span className="text-white/50 text-[10px] tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}

function TopoOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="topo" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="55" fill="none" stroke="white" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="white" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="25" fill="none" stroke="white" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="10" fill="none" stroke="white" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  )
}
