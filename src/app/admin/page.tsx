'use client'

import { useEffect, useState } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { Tractor, Mail, Star, FileText, Eye, TrendingUp } from 'lucide-react'

interface Stats {
  farms: number
  verified: number
  subscribers: number
  reviews: number
  claims: number
  totalViews: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = getSupabaseRaw()
      if (!sb) { setLoading(false); return }

      const [farmsRes, subsRes, reviewsRes, claimsRes] = await Promise.all([
        sb.from('farms').select('verified, view_count'),
        sb.from('subscribers').select('id', { count: 'exact', head: true }),
        sb.from('reviews').select('id', { count: 'exact', head: true }),
        sb.from('farm_claims').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      const farms = farmsRes.data ?? []
      const verified = farms.filter((f: { verified: boolean }) => f.verified).length
      const totalViews = farms.reduce((sum: number, f: { view_count: number }) => sum + (f.view_count ?? 0), 0)

      setStats({
        farms: farms.length,
        verified,
        subscribers: subsRes.count ?? 0,
        reviews: reviewsRes.count ?? 0,
        claims: claimsRes.count ?? 0,
        totalViews,
      })
      setLoading(false)
    }
    load()
  }, [])

  const cards = stats ? [
    { label: 'Celkem farem', value: stats.farms, sub: `${stats.verified} ověřených`, icon: Tractor, color: 'text-primary-600 bg-primary-50' },
    { label: 'Zobrazení celkem', value: stats.totalViews.toLocaleString('cs'), sub: 'přes všechny farmy', icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { label: 'Odběratelé', value: stats.subscribers, sub: 'newsletter', icon: Mail, color: 'text-violet-600 bg-violet-50' },
    { label: 'Recenze', value: stats.reviews, sub: 'celkem', icon: Star, color: 'text-earth-600 bg-earth-50' },
    { label: 'Čekající claimy', value: stats.claims, sub: 'ke schválení', icon: FileText, color: stats.claims > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50' },
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-forest">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Přehled Mapa Farem</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-card">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${color} mb-3`}>
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-forest">{value}</div>
              <div className="text-sm font-medium text-neutral-700 mt-0.5">{label}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-primary-500" />
          <h2 className="font-semibold text-forest">Rychlé akce</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/farmy', label: 'Spravovat farmy' },
            { href: '/admin/claimy', label: 'Claimy' },
            { href: '/admin/odbery', label: 'Odběratelé' },
            { href: '/admin/recenze', label: 'Recenze' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-center py-3 px-4 rounded-lg bg-surface hover:bg-primary-50 text-sm font-medium text-forest transition-colors border border-neutral-100 hover:border-primary-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
