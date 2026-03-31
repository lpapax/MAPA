'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { Search, CheckCircle, Circle, Eye, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FarmRow {
  id: string
  slug: string
  name: string
  city: string
  kraj: string
  categories: string[]
  verified: boolean
  view_count: number
}

const PAGE = 50

export default function AdminFarmy() {
  const [farms, setFarms] = useState<FarmRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [filterVerified, setFilterVerified] = useState<'all' | 'yes' | 'no'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const sb = getSupabaseRaw()
    if (!sb) { setLoading(false); return }

    let query = sb
      .from('farms')
      .select('id,slug,name,city,kraj,categories,verified,view_count', { count: 'exact' })
      .order('view_count', { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1)

    if (q) query = query.ilike('name', `%${q}%`)
    if (filterVerified === 'yes') query = query.eq('verified', true)
    if (filterVerified === 'no') query = query.eq('verified', false)

    const { data, count } = await query
    setFarms((data as FarmRow[]) ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }, [page, q, filterVerified])

  useEffect(() => { load() }, [load])

  async function toggleVerified(farm: FarmRow) {
    setSaving(farm.id)
    const sb = getSupabaseRaw()
    if (!sb) { setSaving(null); return }
    await sb.from('farms').update({ verified: !farm.verified }).eq('id', farm.id)
    setFarms(prev => prev.map(f => f.id === farm.id ? { ...f, verified: !f.verified } : f))
    setSaving(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest">Farmy</h1>
          <p className="text-sm text-neutral-500 mt-1">{total} celkem</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(0) }}
            placeholder="Hledat farmu..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'yes', 'no'] as const).map(v => (
            <button
              key={v}
              onClick={() => { setFilterVerified(v); setPage(0) }}
              className={cn(
                'px-3 py-2 rounded-lg text-sm transition-colors',
                filterVerified === v ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              )}
            >
              {v === 'all' ? 'Vše' : v === 'yes' ? 'Ověřené' : 'Neověřené'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-neutral-500">Název</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Kraj</th>
              <th className="px-4 py-3 font-medium text-neutral-500 text-center">Zobrazení</th>
              <th className="px-4 py-3 font-medium text-neutral-500 text-center">Ověřeno</th>
              <th className="px-4 py-3 font-medium text-neutral-500 text-center">Akce</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : farms.map(farm => (
              <tr key={farm.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-forest truncate max-w-[200px]">{farm.name}</div>
                  <div className="text-xs text-neutral-400">{farm.city}</div>
                </td>
                <td className="px-4 py-3 text-neutral-600">{farm.kraj}</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-neutral-500">
                    <Eye size={12} />
                    {farm.view_count ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleVerified(farm)}
                    disabled={saving === farm.id}
                    className="inline-flex items-center justify-center transition-opacity disabled:opacity-50"
                    title={farm.verified ? 'Zrušit ověření' : 'Ověřit farmu'}
                  >
                    {farm.verified
                      ? <CheckCircle size={18} className="text-primary-500" />
                      : <Circle size={18} className="text-neutral-300" />
                    }
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <a
                    href={`/farmy/${farm.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-neutral-400 hover:text-primary-500 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
          <span className="text-xs text-neutral-400">
            {page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} z {total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
            >
              Předchozí
            </button>
            <button
              disabled={(page + 1) * PAGE >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition-colors"
            >
              Další
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
