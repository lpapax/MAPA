'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeUp, fadeIn } from '@/lib/motionVariants'

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
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background photo */}
      <motion.div
        className="absolute inset-0"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop&q=85"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient overlay — deeper on left for legibility, fades to transparent right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0a1a07]/95 via-[#1a4214]/70 to-[#1a4214]/20"
        aria-hidden="true"
      />
      {/* Bottom fade into surface */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf7f0] to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-32">
        <motion.div
          className="max-w-[640px]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-7">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-primary-300 text-xs font-semibold tracking-widest uppercase">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              Farmářský adresář · Česká republika
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="font-heading font-bold text-white leading-[1.02] mb-6 tracking-tight"
            style={{ fontSize: 'clamp(3.25rem, 8vw, 6.5rem)' }}
          >
            Nakupujte přímo
            <br />
            <em className="not-italic text-primary-300">od farmářů</em>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-white/65 text-lg mb-10 leading-relaxed max-w-[480px]">
            Propojujeme vás s místními farmáři. Čerstvé, lokální, poctivé&nbsp;— bez&nbsp;prostředníků.
          </motion.p>

          {/* Search form */}
          <motion.form
            variants={fadeUp}
            onSubmit={handleSearch}
            className="flex gap-2 mb-8 max-w-[480px]"
            aria-label="Vyhledat farmu"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
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
                  'bg-white text-neutral-900 placeholder:text-neutral-400',
                  'border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-400',
                  'transition-[border-color,box-shadow] duration-150 shadow-sm',
                )}
              />
            </div>
            <button
              type="submit"
              className={cn(
                'flex items-center gap-2 px-5 py-3.5 rounded-xl',
                'bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm',
                'transition-[transform,background-color] duration-150 cursor-pointer flex-shrink-0',
                'active:scale-[0.97] shadow-sm',
              )}
            >
              Hledat
            </button>
          </motion.form>

          {/* Map CTA */}
          <motion.div variants={fadeUp}>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors duration-150 group"
            >
              Zobrazit interaktivní mapu farem
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust bar — inline strip, no absolute positioning over wave */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 bg-black/25 backdrop-blur-sm border-t border-white/10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.45, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-5 overflow-x-auto scrollbar-none">
          <span className="text-white/30 text-[10px] font-semibold whitespace-nowrap flex-shrink-0 uppercase tracking-widest">
            Najdete u nás
          </span>
          <span className="w-px h-4 bg-white/15 flex-shrink-0" aria-hidden="true" />
          {TRUST_ITEMS.map((item, i) => (
            <div key={item} className="flex items-center gap-5 flex-shrink-0">
              {i > 0 && <span className="w-px h-3 bg-white/12" aria-hidden="true" />}
              <span className="text-white/55 text-xs whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
