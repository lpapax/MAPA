'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Plus, Search, UserCircle2 } from 'lucide-react'
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
  { href: '/', label: 'Farmy' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/blog', label: 'Blog' },
  { href: '/o-projektu', label: 'O projektu' },
]

export function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Auto-focus input when overlay opens + Escape to close
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

  // Debounced search fetch
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
            <span className="font-heading font-bold text-base text-forest leading-none">
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
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Hledat farmu"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-forest hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            <Link
              href={user ? '/profil' : '/prihlasit'}
              aria-label={user ? 'Můj profil' : 'Přihlásit se'}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-forest hover:bg-primary-50 transition-colors duration-200 cursor-pointer"
            >
              {user ? (
                <span className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.email ?? '?').charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle2 className="w-4 h-4" aria-hidden="true" />
              )}
            </Link>

            <Link
              href="/pridat-farmu"
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl',
                'bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold',
                'transition-all duration-200 cursor-pointer active:scale-95',
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
            <Link
              href={user ? '/profil' : '/prihlasit'}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-forest text-sm font-medium transition-colors duration-200 cursor-pointer hover:bg-surface"
            >
              <UserCircle2 className="w-4 h-4" aria-hidden="true" />
              {user ? 'Můj profil' : 'Přihlásit se'}
            </Link>
          </div>
        )}
      </header>

      {/* Spacer so content starts below the floating navbar */}
      <div className="h-20" aria-hidden="true" />

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" aria-modal="true" role="dialog" aria-label="Vyhledávání farem">
          <div className="flex justify-center pt-24 px-4">
            <div ref={searchRef} className="w-full max-w-lg">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hledat farmu nebo město…"
                  aria-label="Vyhledávání farem"
                  className="w-full pl-11 pr-12 py-4 rounded-xl bg-white shadow-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 border border-neutral-100"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 cursor-pointer" aria-label="Zavřít hledání">
                  <X className="w-4 h-4" />
                </button>
              </form>

              {(searchResults.length > 0 || searchLoading) && (
                <div className="mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-sm text-neutral-400">Hledám…</div>
                  ) : (
                    searchResults.map((r) => (
                      <Link
                        key={r.id}
                        href={`/farmy/${r.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors border-b border-neutral-50 last:border-0 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-forest truncate">{r.name}</div>
                          <div className="text-xs text-neutral-400">{r.city} · {r.kraj}</div>
                        </div>
                      </Link>
                    ))
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <button
                      onClick={() => { setSearchOpen(false); router.push(`/mapa?q=${encodeURIComponent(searchQuery.trim())}`) }}
                      className="w-full px-4 py-2.5 text-xs text-primary-600 font-medium hover:bg-primary-50 transition-colors cursor-pointer text-left"
                    >
                      Zobrazit všechny výsledky pro &bdquo;{searchQuery}&ldquo; →
                    </button>
                  )}
                </div>
              )}

              {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                <div className="mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 px-4 py-3 text-sm text-neutral-400">
                  Žádné výsledky pro &bdquo;{searchQuery}&ldquo;
                </div>
              )}

              <p className="text-center text-white/60 text-xs mt-3">Stiskněte Enter pro zobrazení na mapě · Esc pro zavření</p>
            </div>
          </div>
        </div>
      )}
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
