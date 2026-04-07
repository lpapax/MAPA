'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PendingFarm {
  id: string
  name: string
  description: string
  categories: string[]
  address: string
  city: string
  kraj: string
  zip: string
  phone: string | null
  email: string | null
  web: string | null
  instagram: string | null
  facebook: string | null
  hours: Record<string, string> | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

type Filter = 'pending' | 'approved' | 'rejected' | 'all'

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Čeká', cls: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Schváleno', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Zamítnuto', cls: 'bg-red-100 text-red-700' },
}

export default function AdminZadosti() {
  const { session } = useAuth()
  const [farms, setFarms] = useState<PendingFarm[]>([])
  const [filter, setFilter] = useState<Filter>('pending')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const token = session?.access_token ?? ''

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch(`/api/admin/zadosti?status=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setFarms((json.data as PendingFarm[]) ?? [])
    setLoading(false)
  }, [token, filter])

  useEffect(() => { load() }, [load])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setSaving(id)
    const res = await fetch(`/api/admin/zadosti/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    })
    const json = await res.json()
    if (json.ok) {
      setFarms(prev => prev.filter(f => f.id !== id))
      setExpanded(null)
    }
    setSaving(null)
  }

  const filters: Filter[] = ['pending', 'approved', 'rejected', 'all']

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-forest">Žádosti o zápis farmy</h1>
        <p className="text-sm text-neutral-500 mt-1">Žádosti odeslané přes formulář /pridat-farmu</p>
      </div>

      <div className="flex gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            )}
          >
            {f === 'pending' ? 'Čeká' : f === 'approved' ? 'Schváleno' : f === 'rejected' ? 'Zamítnuto' : 'Vše'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 text-sm">Žádné záznamy</div>
      ) : (
        <div className="space-y-2">
          {farms.map(farm => (
            <div
              key={farm.id}
              className="bg-white rounded-xl shadow-card border border-neutral-100 overflow-hidden"
            >
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-forest text-sm">{farm.name}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', STATUS_BADGE[farm.status]?.cls)}>
                      {STATUS_BADGE[farm.status]?.label}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {farm.city}, {farm.kraj} · {new Date(farm.created_at).toLocaleDateString('cs-CZ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {farm.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(farm.id, 'approve')}
                        disabled={saving === farm.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {saving === farm.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle size={13} />}
                        Schválit
                      </button>
                      <button
                        onClick={() => handleAction(farm.id, 'reject')}
                        disabled={saving === farm.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle size={13} />
                        Zamítnout
                      </button>
                    </>
                  )}
                  {farm.status !== 'pending' && (
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      {farm.status === 'approved' ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-400" />}
                      {STATUS_BADGE[farm.status]?.label}
                    </div>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === farm.id ? null : farm.id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors"
                    aria-label="Zobrazit detail"
                  >
                    {expanded === farm.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === farm.id && (
                <div className="px-5 pb-5 pt-0 border-t border-neutral-100 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 mb-1">Popis</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{farm.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <DetailField label="Adresa" value={`${farm.address}, ${farm.zip} ${farm.city}`} />
                    <DetailField label="Kraj" value={farm.kraj} />
                    <DetailField label="Kategorie" value={farm.categories.join(', ') || '—'} />
                    {farm.phone && <DetailField label="Telefon" value={farm.phone} />}
                    {farm.email && <DetailField label="E-mail" value={farm.email} />}
                    {farm.web && (
                      <div>
                        <p className="text-neutral-400 mb-0.5">Web</p>
                        <a href={farm.web} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline inline-flex items-center gap-1">
                          {farm.web.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                    {farm.instagram && <DetailField label="Instagram" value={farm.instagram} />}
                    {farm.facebook && <DetailField label="Facebook" value={farm.facebook} />}
                  </div>

                  {farm.hours && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 mb-1">Otevírací doba</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-neutral-600">
                        {Object.entries(farm.hours).map(([day, time]) => (
                          <div key={day} className="flex gap-2">
                            <span className="text-neutral-400 w-16 shrink-0">{day}</span>
                            <span>{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {farm.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleAction(farm.id, 'approve')}
                        disabled={saving === farm.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {saving === farm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle size={16} />}
                        Schválit a přidat do katalogu
                      </button>
                      <button
                        onClick={() => handleAction(farm.id, 'reject')}
                        disabled={saving === farm.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Zamítnout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-neutral-400 mb-0.5">{label}</p>
      <p className="text-neutral-700 font-medium">{value}</p>
    </div>
  )
}
