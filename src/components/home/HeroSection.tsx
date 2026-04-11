'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeUp } from '@/lib/motionVariants'

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
      <div className="relative z-10 flex flex-col justify-center grain bg-[#0b1e08] px-6 sm:px-10 lg:px-16 xl:px-20 pt-28 pb-16 lg:pt-0 lg:pb-0 order-2 lg:order-1">

        {/* Content — stagger orchestrated via variants */}
        <motion.div
          className="relative max-w-[560px] lg:max-w-none"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-700/60 text-primary-400 text-[11px] font-semibold tracking-widest uppercase">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              Farmářský adresář · Česká republika
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
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
            variants={fadeUp}
            className="text-white/50 text-base leading-relaxed mb-10 max-w-[42ch]"
          >
            Přes 3 960 ověřených farem v celé České republice.
            Čerstvé, lokální, poctivé — bez prostředníků.
          </motion.p>

          {/* Search form */}
          <motion.form
            variants={fadeUp}
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
                  'bg-white/10 text-white placeholder:text-white/30',
                  'border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500/50',
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
          <motion.div variants={fadeUp}>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 text-sm font-medium transition-colors duration-200 group"
            >
              Zobrazit interaktivní mapu farem
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust strip at the very bottom of left panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
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

      {/* ── Right panel — decorative pattern ────────────────── */}
      <div className="relative overflow-hidden order-1 lg:order-2 h-24 lg:h-auto min-h-0 bg-[#0b1e08]" aria-hidden="true">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#7bbf6e 1px, transparent 1px), linear-gradient(90deg, #7bbf6e 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Large decorative leaf / circle accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full hidden lg:block"
          style={{ background: 'radial-gradient(circle, rgba(122,191,110,0.07) 0%, transparent 70%)' }}
        />

        {/* Floating farm count badge */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-8 right-8 hidden lg:block"
        >
          <div className="flex items-center gap-3 bg-white/8 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-white text-sm leading-none">3 960+ farem</p>
              <p className="text-white/40 text-[11px] mt-0.5 leading-none">ve všech 14 krajích</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
