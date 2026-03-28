'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const PANELS = [
  {
    label: 'ZELENINA',
    sub: 'Přímá z pole',
    href: '/mapa?q=zelenina',
    img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1400&h=900&fit=crop&q=85',
    accent: 'from-emerald-900/70',
  },
  {
    label: 'OVOCE',
    sub: 'Sezónní sklizeň',
    href: '/mapa?q=ovoce',
    img: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=1400&h=900&fit=crop&q=85',
    accent: 'from-amber-900/70',
  },
  {
    label: 'MLÉČNÉ',
    sub: 'Denní dojení',
    href: '/mapa?q=mléko',
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1400&h=900&fit=crop&q=85',
    accent: 'from-sky-900/60',
  },
  {
    label: 'MASO',
    sub: 'Volný chov',
    href: '/mapa?q=maso',
    img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1400&h=900&fit=crop&q=85',
    accent: 'from-red-900/65',
  },
  {
    label: 'MED',
    sub: 'Přírodní med',
    href: '/mapa?q=med',
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1400&h=900&fit=crop&q=85',
    accent: 'from-yellow-900/65',
  },
]

// ─── Mobile fallback — simple vertical grid ───────────────────────────────

function MobileCategories() {
  return (
    <section className="bg-forest py-12 px-4 lg:hidden" aria-label="Kategorie produktů">
      <h2 className="font-heading text-2xl font-bold text-white mb-8 text-center tracking-tight">
        Co hledáš?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {PANELS.map((p) => (
          <Link
            key={p.label}
            href={p.href}
            className="relative h-44 rounded-2xl overflow-hidden group"
          >
            <Image
              src={p.img}
              alt={p.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="50vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${p.accent} to-transparent`} />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="font-heading font-black text-white text-base leading-tight">
                {p.label}
              </p>
              <p className="text-white/60 text-xs mt-0.5">{p.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── HorizontalCategoriesSection ─────────────────────────────────────────────

export function HorizontalCategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Translate the track: at progress=0 → x=0; at progress=1 → x=-(n-1)*100vw
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vw', `${-(PANELS.length - 1) * 100}vw`],
  )

  return (
    <>
      {/* Mobile */}
      <MobileCategories />

      {/* Desktop — horizontal scroll via sticky */}
      <div
        ref={containerRef}
        // Height = number of panels × 100vh (each panel gets one screen of scroll)
        style={{ height: `${PANELS.length * 100}vh` }}
        className="relative hidden lg:block bg-forest"
        aria-label="Kategorie produktů"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Horizontal track */}
          <motion.div
            style={{
              width: `${PANELS.length * 100}vw`,
              ...(reducedMotion ? {} : { x }),
            }}
            className="flex h-full"
          >
            {PANELS.map((panel, i) => (
              <div
                key={panel.label}
                className="relative w-screen h-full flex-shrink-0 flex items-end"
              >
                {/* Full-bleed photo */}
                <Image
                  src={panel.img}
                  alt={panel.label}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${panel.accent} to-transparent`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Panel number */}
                <span
                  className="absolute top-8 right-10 font-heading font-black text-white/10 text-[14vw] leading-none select-none"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>

                {/* Content */}
                <div className="relative z-10 p-12 lg:p-16 xl:p-20 max-w-xl">
                  <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-semibold mb-4">
                    {panel.sub}
                  </p>
                  <h2 className="font-heading font-black text-white text-[8vw] leading-none tracking-tighter mb-8">
                    {panel.label}
                  </h2>
                  <Link
                    href={panel.href}
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white text-sm font-semibold tracking-wide backdrop-blur-sm hover:bg-white/20 transition-colors duration-300 group"
                  >
                    Zobrazit farmy
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Scroll hint (first panel only) */}
                {i === 0 && (
                  <div className="absolute right-10 bottom-10 flex flex-col items-center gap-2 text-white/30">
                    <span className="text-[10px] tracking-widest uppercase font-medium rotate-90 origin-center mb-4">
                      scroll
                    </span>
                    <div className="w-px h-12 bg-white/20" />
                  </div>
                )}

                {/* Progress dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                  {PANELS.map((_, j) => (
                    <div
                      key={j}
                      className={`rounded-full transition-all duration-300 ${
                        j === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}
