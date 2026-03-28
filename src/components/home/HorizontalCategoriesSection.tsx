'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// ─── Data — only verified Unsplash IDs from mockData ─────────────────────────

const PANELS = [
  {
    label: 'ZELENINA',
    sub: 'Přímá z pole',
    href: '/mapa?q=zelenina',
    img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1600&h=900&fit=crop&q=85',
    accent: 'from-emerald-950/80 via-emerald-900/40',
  },
  {
    label: 'OVOCE',
    sub: 'Sezónní sklizeň',
    href: '/mapa?q=ovoce',
    img: 'https://images.unsplash.com/photo-1486328228599-85db4443971f?w=1600&h=900&fit=crop&q=85',
    accent: 'from-orange-950/80 via-orange-900/40',
  },
  {
    label: 'MLÉČNÉ',
    sub: 'Čerstvé každý den',
    href: '/mapa?q=mléko',
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&h=900&fit=crop&q=85',
    accent: 'from-sky-950/75 via-sky-900/35',
  },
  {
    label: 'MASO',
    sub: 'Volný chov',
    href: '/mapa?q=maso',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop&q=85',
    accent: 'from-red-950/80 via-red-900/40',
  },
  {
    label: 'MED',
    sub: 'Přírodní med',
    href: '/mapa?q=med',
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1600&h=900&fit=crop&q=85',
    accent: 'from-yellow-950/80 via-yellow-900/40',
  },
]

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileCategories() {
  return (
    <section className="bg-forest py-12 px-4 lg:hidden" aria-label="Kategorie produktů">
      <h2 className="font-heading text-2xl font-bold text-white mb-6 text-center tracking-tight">
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
              <p className="font-heading font-black text-white text-base leading-tight">{p.label}</p>
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

  // Spring-smoothed progress → removes the choppy frame-by-frame feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const x = useTransform(
    reducedMotion ? scrollYProgress : smoothProgress,
    [0, 1],
    ['0%', `${-(PANELS.length - 1) * (100 / PANELS.length)}%`],
  )

  return (
    <>
      <MobileCategories />

      {/* Desktop — sticky horizontal scroll */}
      <div
        ref={containerRef}
        style={{ height: `${PANELS.length * 100}vh` }}
        className="relative hidden lg:block"
        aria-label="Kategorie produktů"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* GPU-accelerated track */}
          <motion.div
            style={{
              x: reducedMotion ? 0 : x,
              width: `${PANELS.length * 100}%`,
              willChange: 'transform',
            }}
            className="flex h-full"
          >
            {PANELS.map((panel, i) => (
              <div
                key={panel.label}
                style={{ width: `${100 / PANELS.length}%` }}
                className="relative h-full flex-shrink-0 flex items-end"
              >
                {/* Photo */}
                <Image
                  src={panel.img}
                  alt={panel.label}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i < 2}
                />

                {/* Left gradient for text legibility */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${panel.accent} to-transparent`}
                />
                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Ghost number */}
                <span
                  className="absolute top-8 right-10 font-heading font-black text-white/[0.07] text-[16vw] leading-none select-none pointer-events-none"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>

                {/* Text content */}
                <div className="relative z-10 p-12 lg:p-16 xl:p-24 pb-20">
                  <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase font-bold mb-5">
                    {panel.sub}
                  </p>
                  <h2 className="font-heading font-black text-white text-[6vw] leading-[0.9] tracking-tighter mb-10">
                    {panel.label}
                  </h2>
                  <Link
                    href={panel.href}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/20 transition-colors duration-300 group"
                  >
                    Zobrazit farmy
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-8 right-10 flex gap-2 items-center">
                  {PANELS.map((_, j) => (
                    <div
                      key={j}
                      className={`rounded-full transition-all duration-300 ${
                        j === i ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/25'
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
