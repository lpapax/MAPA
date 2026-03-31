'use client'

import { useEffect, useState } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { Mail, Trash2 } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function AdminOdbery() {
  const [subs, setSubs] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const sb = getSupabaseRaw()
      if (!sb) { setLoading(false); return }
      const { data } = await sb
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false })
      setSubs((data as Subscriber[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function deleteSub(id: string) {
    if (!confirm('Opravdu smazat odběratele?')) return
    setDeleting(id)
    const sb = getSupabaseRaw()
    if (!sb) { setDeleting(null); return }
    await sb.from('subscribers').delete().eq('id', id)
    setSubs(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  const csvExport = () => {
    const rows = ['email,datum', ...subs.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString('cs')}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'odbery.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest">Odběratelé</h1>
          <p className="text-sm text-neutral-500 mt-1">{subs.length} emailů</p>
        </div>
        <button
          onClick={csvExport}
          disabled={subs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors disabled:opacity-40"
        >
          <Mail size={14} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
              <th className="px-4 py-3 font-medium text-neutral-500">Email</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Datum přihlášení</th>
              <th className="px-4 py-3 font-medium text-neutral-500 text-center">Akce</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-50">
                  <td colSpan={3} className="px-4 py-3">
                    <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : subs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-neutral-400 text-sm">
                  Žádní odběratelé
                </td>
              </tr>
            ) : subs.map(sub => (
              <tr key={sub.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-forest">{sub.email}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(sub.created_at).toLocaleDateString('cs', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => deleteSub(sub.id)}
                    disabled={deleting === sub.id}
                    className="text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Smazat"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
