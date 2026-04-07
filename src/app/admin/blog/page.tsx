'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, Loader2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticleRow {
  id: string
  slug: string
  title: string
  category: string
  draft: boolean
  published_at: string
  author: string
  read_time: string
}

interface ArticleForm {
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  cover_gradient: string
  category: string
  author: string
  author_initials: string
  read_time: string
  published_at: string
  draft: boolean
}

const EMPTY_FORM: ArticleForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  cover_gradient: 'from-primary-400 to-teal-500',
  category: 'Průvodce',
  author: 'Redakce Mapa Farem',
  author_initials: 'MF',
  read_time: '5 min čtení',
  published_at: new Date().toISOString().slice(0, 10),
  draft: false,
}

const CATEGORIES = ['Průvodce', 'Recepty', 'Sezóna', 'Trhy', 'Farmáři', 'Obecné']

export default function AdminBlog() {
  const { session } = useAuth()
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM)
  const [loadingEdit, setLoadingEdit] = useState(false)

  const token = session?.access_token ?? ''

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch('/api/admin/blog', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setArticles((json.data as ArticleRow[]) ?? [])
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  function slugify(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function openNew() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  async function openEdit(id: string) {
    setLoadingEdit(true)
    setShowForm(true)
    setEditId(id)
    const res = await fetch(`/api/admin/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (json.data) {
      const d = json.data
      setForm({
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        content: d.content,
        cover_image: d.cover_image ?? '',
        cover_gradient: d.cover_gradient ?? 'from-primary-400 to-teal-500',
        category: d.category,
        author: d.author,
        author_initials: d.author_initials ?? 'MF',
        read_time: d.read_time ?? '5 min čtení',
        published_at: d.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        draft: d.draft,
      })
    }
    setLoadingEdit(false)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      published_at: new Date(form.published_at).toISOString(),
    }

    const url = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog'
    const method = editId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Smazat článek? Tato akce je nevratná.')) return
    setDeleting(id)
    await fetch(`/api/admin/blog/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(null)
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  const f = (field: keyof ArticleForm, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-forest">Blog</h1>
          <p className="text-sm text-neutral-500 mt-1">{articles.length} článků</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} />
          Nový článek
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                <th className="px-4 py-3 font-medium text-neutral-500">Název</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Kategorie</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Datum</th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-center">Stav</th>
                <th className="px-4 py-3 font-medium text-neutral-500 text-center">Akce</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-forest truncate max-w-[280px]">{a.title}</div>
                    <div className="text-xs text-neutral-400">{a.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{a.category}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(a.published_at).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.draft
                      ? <span className="inline-flex items-center gap-1 text-xs text-amber-600"><EyeOff size={12} /> Koncept</span>
                      : <span className="inline-flex items-center gap-1 text-xs text-green-600"><Eye size={12} /> Publikováno</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(a.id)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-primary-600 transition-colors"
                        title="Upravit"
                      >
                        <Pencil size={14} />
                      </button>
                      <a
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-primary-600 transition-colors"
                        title="Zobrazit"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Smazat"
                      >
                        {deleting === a.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {articles.length === 0 && (
            <div className="text-center py-12 text-neutral-400 text-sm">Zatím žádné články</div>
          )}
        </div>
      )}

      {/* Edit/Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="font-heading font-bold text-forest text-lg">
                {editId ? 'Upravit článek' : 'Nový článek'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {loadingEdit ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Název článku" required>
                    <input
                      value={form.title}
                      onChange={e => { f('title', e.target.value); if (!editId) f('slug', slugify(e.target.value)) }}
                      className={inputCls}
                      placeholder="Jak nakupovat přímo od farmářů"
                    />
                  </Field>
                  <Field label="Slug (URL)">
                    <input value={form.slug} onChange={e => f('slug', e.target.value)} className={inputCls} placeholder="jak-nakupovat-od-farmaru" />
                  </Field>
                </div>

                <Field label="Perex (excerpt)" required>
                  <textarea
                    value={form.excerpt}
                    onChange={e => f('excerpt', e.target.value)}
                    rows={2}
                    className={inputCls}
                    placeholder="Krátký popis článku zobrazený v přehledu…"
                  />
                </Field>

                <Field label="Obsah (Markdown)" required>
                  <textarea
                    value={form.content}
                    onChange={e => f('content', e.target.value)}
                    rows={14}
                    className={cn(inputCls, 'font-mono text-xs')}
                    placeholder="## Nadpis&#10;&#10;Text článku v Markdown formátu…"
                  />
                </Field>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Kategorie">
                    <select value={form.category} onChange={e => f('category', e.target.value)} className={inputCls}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Autor">
                    <input value={form.author} onChange={e => f('author', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Čas čtení">
                    <input value={form.read_time} onChange={e => f('read_time', e.target.value)} className={inputCls} placeholder="5 min čtení" />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="URL titulního obrázku">
                    <input value={form.cover_image} onChange={e => f('cover_image', e.target.value)} className={inputCls} placeholder="https://…" />
                  </Field>
                  <Field label="Datum publikace">
                    <input type="date" value={form.published_at} onChange={e => f('published_at', e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.draft} onChange={e => f('draft', e.target.checked)} className="rounded" />
                  <span className="text-sm text-neutral-600">Uložit jako koncept (nezveřejňovat)</span>
                </label>

                <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                    Zrušit
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.title.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    {editId ? 'Uložit změny' : 'Vytvořit článek'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white'

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
