'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Claim {
  id: string
  user_id: string
  farm_slug: string
  message: string | null
  status: string
  created_at: string
}

type Filter = 'pending' | 'approved' | 'rejected' | 'all'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: 'Čeká', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Schváleno', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Zamítnuto', color: 'bg-red-100 text-red-700' },
}

export default function AdminClaimy() {
  const { session } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [filter, setFilter] = useState<Filter>('pending')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const token = session?.access_token ?? ''

  const load = useCallback(async () => {
    setLoading(true)
    const sb = getSupabaseRaw()
    if (!sb) { setLoading(false); return }

    let query = sb
      .from('farm_claims')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setClaims((data as Claim[]) ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    if (!token) return
    setSaving(id)
    await fetch(`/api/admin/claimy/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    setSaving(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-forest">Claimy farem</h1>
        <p className="text-sm text-neutral-500 mt-1">Žádosti farmářů o správu své farmy</p>
      </div>

      <div className="flex gap-1 mb-4">
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map(v => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm transition-colors',
              filter === v ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            )}
          >
            {v === 'pending' ? 'Čekající' : v === 'approved' ? 'Schválené' : v === 'rejected' ? 'Zamítnuté' : 'Vše'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-24 animate-pulse shadow-card" />
          ))
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-card">
            <Clock size={32} className="text-neutral-200 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm">Žádné claimy v tomto stavu</p>
          </div>
        ) : claims.map(claim => {
          const s = STATUS_LABEL[claim.status] ?? STATUS_LABEL.pending
          return (
            <div key={claim.id} className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={`/farmy/${claim.farm_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-forest hover:text-primary-600 flex items-center gap-1"
                    >
                      {claim.farm_slug}
                      <ExternalLink size={12} />
                    </a>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', s.color)}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">
                    User: {claim.user_id.slice(0, 8)}… · {new Date(claim.created_at).toLocaleDateString('cs')}
                  </p>
                  {claim.message && (
                    <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg px-3 py-2">
                      {claim.message}
                    </p>
                  )}
                </div>
                {claim.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(claim.id, 'approved')}
                      disabled={saving === claim.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Schválit
                    </button>
                    <button
                      onClick={() => updateStatus(claim.id, 'rejected')}
                      disabled={saving === claim.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Zamítnout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
