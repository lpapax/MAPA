'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { Search, Map, ArrowRight, Tractor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SPRING_GENTLE } from '@/lib/motionVariants'

const STATS = [
  { target: 3960, suffix: '+', label: 'farem' },
  { target: 14, suffix: '', label: 'krajů' },
]

// Hardcoded to avoid SSR/hydration mismatch — positioned in the right half
// where the overlay is lighter so they're actually visible
const PARTICLES = [
  { x: 74, y: 62, size: 2,   delay: 0,    dur: 9    },
  { x: 87, y: 28, size: 1.5, delay: 1.3,  dur: 11.5 },
  { x: 91, y: 55, size: 2.5, delay: 2.8,  dur: 9    },
  { x: 79, y: 77, size: 1,   delay: 0.5,  dur: 13   },
  { x: 95, y: 18, size: 2,   delay: 3.6,  dur: 10   },
  { x: 69, y: 40, size: 1.5, delay: 1.8,  dur: 12   },
  { x: 83, y: 84, size: 2,   delay: 4.2,  dur: 8.5  },
  { x: 88, y: 10, size: 1,   delay: 0.4,  dur: 14   },
  { x: 76, y: 68, size: 2.5, delay: 2.1,  dur: 9.5  },
  { x: 94, y: 48, size: 1.5, delay: 3.0,  dur: 11.5 },
  { x: 71, y: 35, size: 2,   delay: 5.0,  dur: 10.5 },
  { x: 80, y: 88, size: 1,   delay: 1.5,  dur: 13.5 },
]

// ─── CountUpStat ─────────────────────────────────────────────────────────────

function CountUpStat({
  target,
  suffix,
  label,
  isLast,
}: {
  target: number
  suffix: string
  label: string
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    if (reducedMotion) {
      setValue(target)
      return
    }
    const dur = 1600
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(eased * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, reducedMotion])

  return (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 text-center',
        !isLast && 'border-r border-white/[0.18]',
      )}
    >
      <div className="font-heading font-bold text-2xl text-white leading-tight tabular-nums">
        {value.toLocaleString('cs-CZ')}{suffix}
      </div>
      <div className="text-[11px] text-white/55 mt-0.5 font-medium tracking-widest uppercase">
        {label}
      </div>
    </div>
  )
}

// ─── FarmParallax ─────────────────────────────────────────────────────────────
// Three SVG silhouette layers (hills → trees → foreground barn) that shift at
// different depths based on mouse position, creating a 3-D parallax illusion.

function FarmParallax() {
  const reducedMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring — high damping so it feels weighty, not jittery
  const cfg = { stiffness: 42, damping: 18, mass: 1 }
  const sx = useSpring(mouseX, cfg)
  const sy = useSpring(mouseY, cfg)

  // Each layer gets a different maximum offset (further = slower = less offset)
  const x1 = useTransform(sx, [-0.5, 0.5], [-16, 16])
  const y1 = useTransform(sy, [-0.5, 0.5], [-6,  6 ])
  const x2 = useTransform(sx, [-0.5, 0.5], [-32, 32])
  const y2 = useTransform(sy, [-0.5, 0.5], [-12, 12])
  const x3 = useTransform(sx, [-0.5, 0.5], [-52, 52])
  const y3 = useTransform(sy, [-0.5, 0.5], [-20, 20])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5)
      mouseY.set(e.clientY / window.innerHeight - 0.5)
    },
    [mouseX, mouseY],
  )

  useEffect(() => {
    if (reducedMotion) return
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove, reducedMotion])

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Floating pollen/seed particles — right half only where overlay is lighter */}
      {!reducedMotion && PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-100/50"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [-8, -52], opacity: [0, 0.55, 0] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* ── Layer 1: distant hills (slowest) ───────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 w-[112%] -left-[6%]"
        style={reducedMotion ? {} : { x: x1, y: y1 }}
      >
        <svg
          viewBox="0 0 1584 160"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-36 lg:h-48"
        >
          <path
            d="M0,160 L0,88 C132,58 264,75 396,62 C528,48 660,65 792,50
               C924,34 1056,48 1188,36 C1320,24 1452,40 1584,28 L1584,160 Z"
            fill="rgba(52,211,153,0.14)"
          />
        </svg>
      </motion.div>

      {/* ── Layer 2: mid hills with faint field rows (medium) ──────────────── */}
      <motion.div
        className="absolute bottom-0 w-[112%] -left-[6%]"
        style={reducedMotion ? {} : { x: x2, y: y2 }}
      >
        <svg
          viewBox="0 0 1584 220"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-48 lg:h-60"
        >
          <path
            d="M0,220 L0,138 C110,108 220,122 330,110
               C440,98 550,112 660,96 C770,80 880,95 990,82
               C1100,68 1210,84 1320,70 C1430,56 1508,70 1584,58
               L1584,220 Z"
            fill="rgba(16,185,129,0.20)"
          />
          {/* Subtle crop rows */}
          {[155, 164, 173, 182].map((y) => (
            <line
              key={y}
              x1="300" y1={y} x2="1584" y2={y + 4}
              stroke="rgba(134,239,172,0.07)"
              strokeWidth="4"
            />
          ))}
        </svg>
      </motion.div>

      {/* ── Layer 3: foreground — trees + barn (fastest) ────────────────────── */}
      <motion.div
        className="absolute bottom-0 w-[112%] -left-[6%]"
        style={reducedMotion ? {} : { x: x3, y: y3 }}
      >
        <svg
          viewBox="0 0 1584 330"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="w-full h-60 lg:h-80"
        >
          {/* Ground fill */}
          <path
            d="M0,330 L0,235 C176,220 352,226 528,218
               C704,210 880,218 1056,210 C1232,202 1408,210 1584,203
               L1584,330 Z"
            fill="rgba(6,78,59,0.48)"
          />

          {/* ── Left pine cluster ── */}
          <polygon points="52,235 74,285 30,285"  fill="rgba(3,40,30,0.88)" />
          <polygon points="52,216 77,270 27,270"  fill="rgba(3,40,30,0.88)" />
          <polygon points="52,200 80,254 24,254"  fill="rgba(3,40,30,0.88)" />
          <rect x="47" y="283" width="9"  height="22" fill="rgba(3,40,30,0.88)" />

          <polygon points="105,240 124,285 86,285"  fill="rgba(3,40,30,0.85)" />
          <polygon points="105,222 127,272 83,272"  fill="rgba(3,40,30,0.85)" />
          <rect x="100" y="283" width="8" height="22" fill="rgba(3,40,30,0.85)" />

          {/* ── Left deciduous trees ── */}
          <rect x="238" y="252" width="10" height="55" fill="rgba(3,40,30,0.78)" />
          <circle cx="243" cy="238" r="28" fill="rgba(3,40,30,0.72)" />
          <rect x="300" y="258" width="9"  height="50" fill="rgba(3,40,30,0.78)" />
          <circle cx="304" cy="246" r="21" fill="rgba(3,40,30,0.72)" />

          {/* ── Barn ── */}
          <rect    x="970"  y="220" width="112" height="72" fill="rgba(3,40,30,0.78)" />
          <polygon points="963,220 1088,220 1026,176" fill="rgba(3,40,30,0.88)" />
          {/* Door */}
          <rect x="998" y="248" width="32" height="44" fill="rgba(1,18,10,0.68)" />
          {/* Windows */}
          <rect x="975" y="232" width="15" height="14" fill="rgba(1,18,10,0.55)" />
          <rect x="1042" y="232" width="15" height="14" fill="rgba(1,18,10,0.55)" />

          {/* ── Silo next to barn ── */}
          <rect x="1094" y="198" width="14" height="94" fill="rgba(3,40,30,0.78)" />
          <ellipse cx="1101" cy="196" rx="16" ry="10" fill="rgba(3,40,30,0.80)" />

          {/* ── Right deciduous trees ── */}
          <rect x="1180" y="248" width="10" height="60" fill="rgba(3,40,30,0.78)" />
          <circle cx="1185" cy="234" r="30" fill="rgba(3,40,30,0.72)" />
          <rect x="1240" y="254" width="9"  height="54" fill="rgba(3,40,30,0.78)" />
          <circle cx="1244" cy="242" r="22" fill="rgba(3,40,30,0.72)" />

          {/* ── Right pine cluster ── */}
          <polygon points="1390,234 1412,285 1368,285"  fill="rgba(3,40,30,0.88)" />
          <polygon points="1390,215 1415,268 1365,268"  fill="rgba(3,40,30,0.88)" />
          <polygon points="1390,198 1418,252 1362,252"  fill="rgba(3,40,30,0.88)" />
          <rect x="1385" y="283" width="9"  height="22" fill="rgba(3,40,30,0.88)" />

          <polygon points="1450,238 1470,285 1430,285"  fill="rgba(3,40,30,0.85)" />
          <polygon points="1450,220 1474,270 1426,270"  fill="rgba(3,40,30,0.85)" />
          <rect x="1444" y="283" width="9"  height="22" fill="rgba(3,40,30,0.85)" />
        </svg>
      </motion.div>
    </div>
  )
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const reducedMotion = useReducedMotion()

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 110])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/mapa?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/mapa')
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Parallax photo background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: bgY }}>
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop&q=85"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* Dark gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/70 to-forest/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"
        aria-hidden="true"
      />

      {/* Interactive farm silhouette parallax */}
      <FarmParallax />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} transition={SPRING_GENTLE}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-8 backdrop-blur-sm tracking-wide uppercase">
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse"
                aria-hidden="true"
              />
              Farmy z celé České republiky
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            transition={SPRING_GENTLE}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
          >
            Nakupujte přímo
            <br />
            <span className="text-primary-300 italic">od farmářů</span>
            <br />
            z celé ČR
          </motion.h1>

          <motion.p
            variants={itemVariants}
            transition={SPRING_GENTLE}
            className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-xl"
          >
            Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé —
            bez prostředníků.
          </motion.p>

          {/* Search bar */}
          <motion.div variants={itemVariants} transition={SPRING_GENTLE}>
            <form
              onSubmit={handleSearch}
              className="flex gap-2 mb-6 max-w-lg"
              aria-label="Vyhledat farmu"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hledat farmu nebo produkt…"
                  aria-label="Hledat farmu"
                  className={cn(
                    'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm',
                    'bg-white/12 border border-white/25 text-white placeholder:text-white/45',
                    'backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-white/40',
                    'transition-all duration-200',
                  )}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={reducedMotion ? {} : { scale: 1.03 }}
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                className={cn(
                  'flex items-center gap-2 px-5 py-3.5 rounded-xl',
                  'bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm',
                  'transition-colors duration-200 cursor-pointer shadow-lg flex-shrink-0',
                )}
              >
                <Map className="w-4 h-4" aria-hidden="true" />
                Hledat
              </motion.button>
            </form>
          </motion.div>

          {/* Secondary CTAs */}
          <motion.div
            variants={itemVariants}
            transition={SPRING_GENTLE}
            className="flex flex-wrap items-center gap-3 mb-14"
          >
            <Link
              href="/mapa"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200 cursor-pointer group"
            >
              Zobrazit mapu farem
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
            <span className="text-white/25 text-sm">·</span>
            <Link
              href="/pridat-farmu"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200 cursor-pointer group"
            >
              <Tractor className="w-3.5 h-3.5" aria-hidden="true" />
              Přidat svoji farmu
            </Link>
          </motion.div>

          {/* Stats with count-up */}
          <motion.div variants={itemVariants} transition={SPRING_GENTLE}>
            <div className="inline-flex items-stretch gap-0 rounded-2xl overflow-hidden border border-white/[0.18] backdrop-blur-md bg-black/20">
              {STATS.map((stat, i) => (
                <CountUpStat
                  key={stat.label}
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  isLast={i === STATS.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
        <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium">
          Scroll
        </span>
      </motion.div>

      {/* Wave divider */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 lg:h-24"
          fill="#F4F1EC"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,90 C180,30 360,65 540,45 C720,25 900,70 1080,50 C1260,30 1380,60 1440,45 L1440,90 Z" />
        </svg>
      </div>
    </section>
  )
}
