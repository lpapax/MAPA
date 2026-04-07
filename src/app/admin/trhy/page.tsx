'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketRow {
  id: number
  name: string
  city: string
  region: string
  schedule: string
  time: string
  vendors: number
  tags: string[]
  is_daily: boolean
  dow: number | null
  active: boolean
}

const EMPTY: Omit<MarketRow, 'id'> = {
  name: '', city: '', region: 'Hlavní město Praha',
  schedule: '', time: '', vendors: 0,
  tags: [], is_daily: false, dow: 6, active: true,
}

const REGIONS = [
  'Hlavní město Praha','Středočeský kraj','Jihočeský kraj','Plzeňský kraj',
  'Karlovarský kraj','Ústecký kraj','Liberecký kraj','Královéhradecký kraj',
  'Pardubický kraj','Kraj Vysočina','Jihomoravský kraj','Olomoucký kraj',
  'Zlínský kraj','Moravskoslezský kraj',
]

const DOW_LABELS = ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota']

export default function AdminTrhy() {
  const [markets, setMarkets]   = useState<MarketRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [editId, setEditId]     = useState<number | 'new' | null>(null)
  const [form, setForm]         = useState<Omit<MarketRow, 'id'>>(EMPTY)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const sb = getSupabaseRaw()
    if (!sb) { setLoading(false); return }
    const { data } = await sb.from('markets').select('*').order('id')
    setMarkets((data as MarketRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  function startNew() {
    setForm(EMPTY)
    setEditId('new')
  }

  function startEdit(m: MarketRow) {
    const { id, ...rest } = m
    void id
    setForm(rest)
    setEditId(m.id)
  }

  async function handleSave() {
    setSaving(true)
    const sb = getSupabaseRaw()
    if (!sb) { setSaving(false); return }

    const payload = {
      ...form,
      dow: form.is_daily ? null : form.dow,
    }

    if (editId === 'new') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from('markets') as any).insert([payload])
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from('markets') as any).update(payload).eq('id', editId)
    }

    setSaving(false)
    setEditId(null)
    void load()
  }

  async function handleDelete(id: number) {
    const sb = getSupabaseRaw()
    if (!sb) return
    await sb.from('markets').delete().eq('id', id)
    setDeleteId(null)
    void load()
  }

  async function toggleActive(m: MarketRow) {
    const sb = getSupabaseRaw()
    if (!sb) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from('markets') as any).update({ active: !m.active }).eq('id', m.id)
    void load()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-forest">Farmářské trhy</h1>
          <p className="text-sm text-neutral-400 mt-0.5">{markets.length} trhů v databázi</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Přidat trh
        </button>
      </div>

      {/* Form modal */}
      {editId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="font-heading font-bold text-forest text-lg mb-4">
              {editId === 'new' ? 'Nový trh' : 'Upravit trh'}
            </h2>
            <div className="space-y-3">
              <Field label="Název">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Město">
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
                </Field>
                <Field label="Kraj">
                  <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="input">
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Rozvrh (text)">
                <input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Každou sobotu" className="input" />
              </Field>
              <Field label="Čas">
                <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="8:00–13:00" className="input" />
              </Field>
              <Field label="Počet prodejců">
                <input type="number" value={form.vendors} onChange={(e) => setForm({ ...form, vendors: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Tagy (oddělené čárkou)">
                <input
                  value={form.tags.join(', ')}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  placeholder="BIO, Farmářský"
                  className="input"
                />
              </Field>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.is_daily}
                    onChange={(e) => setForm({ ...form, is_daily: e.target.checked })}
                    className="rounded"
                  />
                  Otevřeno denně
                </label>
              </div>
              {!form.is_daily && (
                <Field label="Den v týdnu">
                  <select value={form.dow ?? 6} onChange={(e) => setForm({ ...form, dow: Number(e.target.value) })} className="input">
                    {DOW_LABELS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                  </select>
                </Field>
              )}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded"
                  />
                  Aktivní (zobrazovat na webu)
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditId(null)}
                className="flex-1 px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl text-sm font-medium cursor-pointer hover:bg-neutral-50"
              >
                Zrušit
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.city}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Uložit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h2 className="font-heading font-bold text-forest text-lg mb-2">Smazat trh?</h2>
            <p className="text-sm text-neutral-500 mb-6">Tato akce je nevratná.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl text-sm cursor-pointer hover:bg-neutral-50">Zrušit</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold cursor-pointer">Smazat</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary-400" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Název</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Město / Kraj</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Rozvrh</th>
                <th className="text-center px-4 py-3">Aktivní</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {markets.map((m) => (
                <tr key={m.id} className={cn('hover:bg-neutral-50 transition-colors', !m.active && 'opacity-50')}>
                  <td className="px-4 py-3 font-medium text-forest">{m.name}</td>
                  <td className="px-4 py-3 text-neutral-500 hidden sm:table-cell">{m.city}<br /><span className="text-xs">{m.region}</span></td>
                  <td className="px-4 py-3 text-neutral-500 hidden md:table-cell">{m.schedule}<br /><span className="text-xs">{m.time}</span></td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(m)} className="cursor-pointer" aria-label={m.active ? 'Deaktivovat' : 'Aktivovat'}>
                      {m.active
                        ? <Check className="w-4 h-4 text-primary-600 mx-auto" />
                        : <X className="w-4 h-4 text-neutral-300 mx-auto" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-forest cursor-pointer transition-colors" aria-label="Upravit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors" aria-label="Smazat">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e0d8;
          border-radius: 10px;
          font-size: 14px;
          color: #1c1917;
          outline: none;
          transition: border-color 150ms;
        }
        .input:focus {
          border-color: #4a8c3f;
          box-shadow: 0 0 0 2px rgba(74,140,63,0.15);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
      {children}
    </div>
  )
}
