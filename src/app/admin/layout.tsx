'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LayoutDashboard, Tractor, FileText, Mail, Star, LogOut, ChevronRight, ClipboardList, BookOpen, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/farmy', label: 'Farmy', icon: Tractor },
  { href: '/admin/zadosti', label: 'Žádosti', icon: ClipboardList },
  { href: '/admin/claimy', label: 'Claimy', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/trhy', label: 'Trhy', icon: Store },
  { href: '/admin/odbery', label: 'Odběry', icon: Mail },
  { href: '/admin/recenze', label: 'Recenze', icon: Star },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, session, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user || !session) { router.replace('/prihlasit'); return }

    fetch('/api/admin/check', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(r => r.json())
      .then((data: { admin: boolean }) => {
        if (data.admin) setChecked(true)
        else router.replace('/')
      })
      .catch(() => router.replace('/'))
  }, [user, loading, session, router])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-surface">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 bg-forest text-white flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-white/10">
          <span className="font-heading text-lg font-bold text-white">Admin</span>
          <p className="text-xs text-white/50 mt-0.5 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                  active ? 'bg-white/15 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon size={15} />
                {label}
                {active && <ChevronRight size={13} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => signOut().then(() => router.replace('/'))}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={14} />
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
