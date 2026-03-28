'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
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

// ─── Floating product cards (right panel) ────────────────────────────────────

const CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=420&h=260&fit=crop&q=85',
    label: 'Zelenina',
    desc: 'Přímá z pole',
    badge: '842 farem',
    pos: { top: '7%', left: '2%' } as React.CSSProperties,
    rotateFrom: -8,
    rotateTo: -4,
    delay: 0.25,
    floatY: 9,
    floatDur: 4.8,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=420&h=260&fit=crop&q=85',
    label: 'Med & Byliny',
    desc: 'Přírodní včelí med',
    badge: '156 farem',
    pos: { top: '30%', right: '3%' } as React.CSSProperties,
    rotateFrom: 8,
    rotateTo: 3.5,
    delay: 0.45,
    floatY: 7,
    floatDur: 5.6,
  },
  {
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=420&h=260&fit=crop&q=85',
    label: 'Mléčné výrobky',
    desc: 'Čerstvé každý den',
    badge: '328 farem',
    pos: { bottom: '18%', left: '8%' } as React.CSSProperties,
    rotateFrom: -6,
    rotateTo: -2.5,
    delay: 0.65,
    floatY: 11,
    floatDur: 6.1,
  },
]

function ProductCard({
  card,
  reducedMotion,
}: {
  card: (typeof CARDS)[0]
  reducedMotion: boolean | null
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.75, rotate: card.rotateFrom, y: 30 }}
      animate={{ opacity: 1, scale: 1, rotate: card.rotateTo, y: 0 }}
      transition={{ delay: card.delay, type: 'spring', stiffness: 160, damping: 22 }}
      style={{ position: 'absolute', ...card.pos }}
      className="w-52 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.40)] border border-white/20 cursor-default"
    >
      {/* Continuous float */}
      <motion.div
        animate={reducedMotion ? {} : { y: [0, -card.floatY, 0] }}
        transition={{ duration: card.floatDur, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative h-28">
          <Image
            src={card.img}
            alt={card.label}
            fill
            className="object-cover"
            sizes="208px"
          />
        </div>
        <div className="bg-[#FDFCF9]/97 px-3.5 py-3">
          <p className="font-heading font-bold text-forest text-[13px] leading-tight">
            {card.label}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">{card.desc}</p>
          <span className="inline-block mt-1.5 text-[10px] bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full tracking-wide">
            {card.badge}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Czech Republic decorative map ───────────────────────────────────────────

function CzechMapDecoration({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, type: 'spring', stiffness: 140, damping: 20 }}
      className="absolute bottom-28 right-6 w-44 h-28"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Country fill */}
        <path
          d="M 8,92 C 5,75 8,58 18,45 C 28,32 42,22 60,14 C 78,6 100,2 122,0
             C 144,0 162,4 180,8 C 198,12 215,18 232,25 C 248,32 260,42 266,55
             C 270,65 268,75 260,83 C 252,92 240,98 226,104 C 212,110 196,115 180,118
             C 168,118 160,115 152,108 C 145,102 140,100 135,105
             C 128,110 118,112 108,110 C 92,108 72,104 55,95
             C 38,88 20,88 8,92 Z"
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.40)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Farm dots — major regions */}
        <circle cx="95"  cy="62"  r="4"   fill="rgba(134,239,172,0.85)" />
        <circle cx="183" cy="112" r="3.5" fill="rgba(134,239,172,0.75)" />
        <circle cx="248" cy="72"  r="2.5" fill="rgba(134,239,172,0.65)" />
        <circle cx="52"  cy="83"  r="2.5" fill="rgba(134,239,172,0.60)" />
        <circle cx="128" cy="18"  r="2"   fill="rgba(134,239,172,0.55)" />
        <circle cx="88"  cy="105" r="2"   fill="rgba(134,239,172,0.55)" />
        <circle cx="210" cy="92"  r="2"   fill="rgba(134,239,172,0.55)" />
        {/* Glow rings on Praha */}
        <circle cx="95"  cy="62"  r="8"   fill="none" stroke="rgba(134,239,172,0.25)" strokeWidth="1.5" />
        <circle cx="95"  cy="62"  r="13"  fill="none" stroke="rgba(134,239,172,0.12)" strokeWidth="1" />
        {/* Label */}
        <text
          x="140" y="152"
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="7.5"
          letterSpacing="2.5"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
        >
          ČESKÁ REPUBLIKA
        </text>
      </svg>
    </motion.div>
  )
}

// ─── Right visual panel ───────────────────────────────────────────────────────

function HeroVisuals({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <div className="absolute inset-y-0 left-[54%] right-0 hidden lg:block pointer-events-none">
      {CARDS.map((card) => (
        <ProductCard key={card.label} card={card} reducedMotion={reducedMotion} />
      ))}
      <CzechMapDecoration reducedMotion={reducedMotion} />
    </div>
  )
}

// ─── CountUpStat ─────────────────────────────────────────────────────────────

function CountUpStat({
  target, suffix, label, isLast,
}: { target: number; suffix: string; label: string; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const reducedMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    if (reducedMotion) { setValue(target); return }
    const dur = 1600
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      setValue(Math.round((1 - (1 - t) ** 3) * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target, reducedMotion])

  return (
    <div ref={ref} className={cn('px-6 py-4 text-center', !isLast && 'border-r border-white/[0.18]')}>
      <div className="font-heading font-bold text-2xl text-white leading-tight tabular-nums">
        {value.toLocaleString('cs-CZ')}{suffix}
      </div>
      <div className="text-[11px] text-white/55 mt-0.5 font-medium tracking-widest uppercase">
        {label}
      </div>
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
    router.push(query.trim() ? `/mapa?q=${encodeURIComponent(query.trim())}` : '/mapa')
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1, delayChildren: reducedMotion ? 0 : 0.1 } },
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
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&q=85"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* Overlays — heavier left (text), lighter right (cards visible) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest/92 via-forest/72 to-forest/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35"
        aria-hidden="true"
      />

      {/* Floating product cards + Czech map */}
      <HeroVisuals reducedMotion={reducedMotion} />

      {/* Left content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <motion.div
          className="max-w-2xl lg:max-w-[50%]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} transition={SPRING_GENTLE}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-8 backdrop-blur-sm tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse" aria-hidden="true" />
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
            className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-lg"
          >
            Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé —
            bez prostředníků.
          </motion.p>

          {/* Search */}
          <motion.div variants={itemVariants} transition={SPRING_GENTLE}>
            <form
              onSubmit={handleSearch}
              className="flex gap-2 mb-6 max-w-lg"
              aria-label="Vyhledat farmu"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hledat farmu nebo produkt…"
                  aria-label="Hledat farmu"
                  className={cn(
                    'w-full pl-11 pr-4 py-3.5 rounded-xl text-sm',
                    'bg-white/12 border border-white/25 text-white placeholder:text-white/45',
                    'backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-white/40 transition-all duration-200',
                  )}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={reducedMotion ? {} : { scale: 1.03 }}
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer shadow-lg flex-shrink-0"
              >
                <Map className="w-4 h-4" aria-hidden="true" />
                Hledat
              </motion.button>
            </form>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            transition={SPRING_GENTLE}
            className="flex flex-wrap items-center gap-3 mb-14"
          >
            <Link
              href="/mapa"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200 group"
            >
              Zobrazit mapu farem
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
            <span className="text-white/25 text-sm">·</span>
            <Link
              href="/pridat-farmu"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <Tractor className="w-3.5 h-3.5" aria-hidden="true" />
              Přidat svoji farmu
            </Link>
          </motion.div>

          {/* Stats */}
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
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
        <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium">Scroll</span>
      </motion.div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-16 sm:h-20 lg:h-24" fill="#F4F1EC" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,90 C180,30 360,65 540,45 C720,25 900,70 1080,50 C1260,30 1380,60 1440,45 L1440,90 Z" />
        </svg>
      </div>
    </section>
  )
}
