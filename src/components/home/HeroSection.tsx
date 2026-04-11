'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const TRUST_ITEMS = [
  'Zelenina',
  'Čerstvé maso',
  'Mléčné výrobky',
  'Med',
  'Vejce',
  'Byliny',
  'Víno',
  'Pečivo',
]

export function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(query.trim() ? `/mapa?q=${encodeURIComponent(query.trim())}` : '/mapa')
  }

  return (
    <section
      className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-[58fr_42fr] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ── Left panel — dark green content ─────────────────── */}
      <div className="relative z-10 flex flex-col justify-center bg-[#0b1e08] px-6 sm:px-10 lg:px-16 xl:px-20 pt-28 pb-16 lg:pt-0 lg:pb-0 order-2 lg:order-1">

        {/* Subtle noise grain on content panel */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: '200px 200px' }}
          aria-hidden="true"
        />

        <div className="relative max-w-[560px] lg:max-w-none">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-700/60 text-primary-400 text-[11px] font-semibold tracking-widest uppercase">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              Farmářský adresář · Česká republika
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
            className="font-heading font-bold text-white leading-[1.0] tracking-tight mb-7"
            style={{ fontSize: 'clamp(3.25rem, 6.5vw, 6rem)' }}
          >
            Nakupujte
            <br />
            přímo od
            <br />
            <em className="not-italic" style={{ color: '#7bbf6e' }}>farmářů</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/50 text-base leading-relaxed mb-10 max-w-[42ch]"
          >
            Přes 3 960 ověřených farem v celé České republice.
            Čerstvé, lokální, poctivé — bez prostředníků.
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
            onSubmit={handleSearch}
            className="flex gap-2 mb-6 max-w-[480px]"
            aria-label="Vyhledat farmu"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hledat farmu nebo produkt…"
                aria-label="Hledat farmu"
                className={cn(
                  'w-full pl-10 pr-4 py-3.5 rounded-xl text-sm',
                  'bg-white/8 text-white placeholder:text-white/30',
                  'border border-white/12 focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/50',
                  'transition-[border-color,box-shadow] duration-150',
                )}
              />
            </div>
            <button
              type="submit"
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 rounded-xl',
                'bg-primary-500 hover:bg-primary-400 text-white font-semibold text-sm',
                'transition-[transform,background-color] duration-150 cursor-pointer flex-shrink-0',
                'active:scale-[0.97]',
              )}
            >
              Hledat
            </button>
          </motion.form>

          {/* Map CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          >
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm font-medium transition-colors duration-200 group"
            >
              Zobrazit interaktivní mapu farem
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        {/* Trust strip at the very bottom of left panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 lg:px-16 xl:px-20 py-5 border-t border-white/6 hidden lg:flex items-center gap-4 overflow-x-auto scrollbar-none"
        >
          <span className="text-white/20 text-[10px] font-semibold whitespace-nowrap flex-shrink-0 uppercase tracking-widest">
            Najdete u nás
          </span>
          {TRUST_ITEMS.map((item) => (
            <span key={item} className="text-white/35 text-[11px] whitespace-nowrap flex-shrink-0">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel — photo ──────────────────────────────── */}
      <div className="relative overflow-hidden order-1 lg:order-2 h-[52vw] sm:h-64 lg:h-auto min-h-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&h=1800&fit=crop&q=85"
            alt="Čerstvé produkty z farmy"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </motion.div>

        {/* Diagonal left edge — feathers into panel boundary */}
        <div
          className="absolute inset-y-0 left-0 w-24 hidden lg:block"
          style={{
            background: 'linear-gradient(to right, #0b1e08 0%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom fade on mobile into content below */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 lg:hidden"
          style={{ background: 'linear-gradient(to top, #0b1e08 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Floating farm count badge */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-8 right-6 hidden lg:block"
        >
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl">
            <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-heading font-bold text-forest text-sm leading-none">3 960+ farem</p>
              <p className="text-neutral-400 text-[11px] mt-0.5 leading-none">ve všech 14 krajích</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
