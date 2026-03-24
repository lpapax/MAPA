'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Farmy' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/blog', label: 'Blog' },
  { href: '/o-projektu', label: 'O projektu' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300',
          scrolled
            ? 'glass shadow-navbar'
            : 'bg-white/70 backdrop-blur-sm border border-white/40 shadow-glass',
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer" aria-label="Mapa Farem – domovská stránka">
            <LeafLogo />
            <span className="font-heading font-700 text-base text-forest leading-none">
              Mapa <span className="text-primary-600">Farem</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Hlavní navigace">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-forest/70 hover:text-forest hover:bg-primary-50 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/pridat-farmu"
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl',
                'bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold',
                'transition-colors duration-200 cursor-pointer',
                'shadow-sm hover:shadow-md',
              )}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Přidat farmu
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
              aria-expanded={open}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-forest hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/40 px-5 pb-4 pt-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-forest/80 hover:text-forest hover:bg-primary-50 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/pridat-farmu"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 mt-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Přidat farmu
            </Link>
          </div>
        )}
      </header>

      {/* Spacer so content starts below the floating navbar */}
      <div className="h-20" aria-hidden="true" />
    </>
  )
}

function LeafLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <circle cx="14" cy="14" r="14" fill="#059669" />
      <path
        d="M9 19C9 19 10 12 14 10C18 8 20 10 20 10C20 10 19 17 14 19C11.5 20 9 19 9 19Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M9 19L14 13"
        stroke="#059669"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
