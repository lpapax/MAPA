'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Map, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Domů', icon: Home },
  { href: '/hledat', label: 'Hledat', icon: Search },
  { href: '/mapa', label: 'Mapa', icon: Map },
  { href: '/oblibene', label: 'Oblíbené', icon: Heart },
  { href: '/profil', label: 'Profil', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobilní navigace"
    >
      <ul className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center justify-center w-full h-full gap-1 cursor-pointer',
                  'transition-colors duration-200 active:scale-95',
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <Icon
                  className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-medium leading-none">{label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-600 rounded-full" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
