'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Plus, Search, UserCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface SearchResult {
  id: string
  name: string
  slug: string
  city: string
  kraj: string
}

const NAV_LINKS = [
  { href: '/',          label: 'Farmy' },
  { href: '/mapa',      label: 'Mapa' },
  { href: '/trhy',      label: 'Trhy' },
  { href: '/zebricek',  label: 'Žebříček' },
  { href: '/blog',      label: 'Blog' },
]

export function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Scroll elevation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    if (searchOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [searchOpen])

  // Auto-focus + Escape to close search
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    } else {
      setSearchQuery('')
      setSearchResults([])
    }
  }, [searchOpen])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json() as SearchResult[]
        setSearchResults(Array.isArray(data) ? data : [])
      } catch { setSearchResults([]) }
      finally { setSearchLoading(false) }
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearchOpen(false)
    router.push(`/mapa?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      {/* ── Main bar ─────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-shadow duration-300',
          scrolled && 'shadow-[0_2px_24px_-6px_rgba(0,0,0,0.12)]',
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group dark:opacity-95"
            aria-label="Mapa Farem – domovská stránka"
          >
            <LeafLogo />
            <span className="font-heading font-bold text-[15px] text-forest dark:text-primary-300 leading-none tracking-tight">
              Mapa <span className="text-primary-600">Farem</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Hlavní navigace">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer',
                    active
                      ? 'text-forest dark:text-primary-300'
                      : 'text-neutral-600 hover:text-forest hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-primary-300 dark:hover:bg-neutral-800',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-primary-50 dark:bg-primary-900/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Hledat farmu"
              className="flex items-center justify-center w-11 h-11 rounded-md text-neutral-500 hover:text-forest hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-primary-300 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* User */}
            <Link
              href={user ? '/profil' : '/prihlasit'}
              aria-label={user ? 'Můj profil' : 'Přihlásit se'}
              className="flex items-center justify-center w-11 h-11 rounded-md text-neutral-500 hover:text-forest hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-primary-300 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
            >
              {user ? (
                <span className="w-7 h-7 rounded-full bg-forest flex items-center justify-center text-white text-xs font-bold">
                  {(user.email ?? '?').charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle2 className="w-4 h-4" aria-hidden="true" />
              )}
            </Link>

            {/* Add farm CTA */}
            <Link
              href="/pridat-farmu"
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-4 py-2 ml-1 rounded-md',
                'bg-forest hover:bg-primary-800 text-white text-sm font-semibold',
                'transition-[transform,background-color] duration-150 cursor-pointer active:scale-[0.97]',
              )}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Přidat farmu
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
              aria-expanded={open}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-md text-neutral-500 hover:text-forest hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pb-4 pt-2 space-y-0.5"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-forest hover:bg-neutral-50 dark:text-neutral-300 dark:hover:text-primary-300 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/pridat-farmu"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-forest text-white text-sm font-semibold transition-[transform,background-color] duration-150 cursor-pointer hover:bg-primary-800 active:scale-[0.97]"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  Přidat farmu
                </Link>
                <Link
                  href={user ? '/profil' : '/prihlasit'}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <UserCircle2 className="w-4 h-4" aria-hidden="true" />
                  {user ? 'Můj profil' : 'Přihlásit se'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Search overlay ────────────────────────────── */}
      <AnimatePresence initial={false}>
      {searchOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-black/40"
          aria-modal="true"
          role="dialog"
          aria-label="Vyhledávání farem"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex justify-center pt-20 px-4"
          >
            <div ref={searchRef} className="w-full max-w-xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hledat farmu nebo město…"
                  aria-label="Vyhledávání farem"
                  className="w-full pl-11 pr-12 py-4 rounded-lg bg-white dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 shadow-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 border border-neutral-200 dark:border-neutral-700"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 cursor-pointer"
                  aria-label="Zavřít hledání"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {(searchResults.length > 0 || searchLoading) && (
                <div className="mt-1 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-sm text-neutral-400">Hledám…</div>
                  ) : (
                    searchResults.map((r) => (
                      <Link
                        key={r.id}
                        href={`/farmy/${r.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-b border-neutral-50 dark:border-neutral-800 last:border-0 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 flex-shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-forest dark:text-primary-200 truncate">{r.name}</div>
                          <div className="text-xs text-neutral-400 dark:text-neutral-500">{r.city} · {r.kraj}</div>
                        </div>
                      </Link>
                    ))
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <button
                      onClick={() => { setSearchOpen(false); router.push(`/mapa?q=${encodeURIComponent(searchQuery.trim())}`) }}
                      className="w-full px-4 py-2.5 text-xs text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer text-left"
                    >
                      Zobrazit všechny výsledky pro &bdquo;{searchQuery}&ldquo; →
                    </button>
                  )}
                </div>
              )}

              {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                <div className="mt-1 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-100 dark:border-neutral-800 px-4 py-3 text-sm text-neutral-400 dark:text-neutral-500">
                  Žádné výsledky pro &bdquo;{searchQuery}&ldquo;
                </div>
              )}

              <p className="text-center text-white/50 text-xs mt-3">
                Enter — zobrazit na mapě · Esc — zavřít
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}

function LeafLogo() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <rect width="30" height="30" rx="6" fill="#1a4214" />
      <path
        d="M9 22C9 22 10.5 13 15 11C19.5 9 22 11 22 11C22 11 20.5 20 15 22C12 23.5 9 22 9 22Z"
        fill="white"
        fillOpacity="0.92"
      />
      <path
        d="M9 22L15 15"
        stroke="#1a4214"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
