'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { Check, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/farms'
import type { FarmCategory } from '@/types/farm'

const CATEGORIES: FarmCategory[] = [
  'zelenina','ovoce','maso','mléko','vejce','med','chléb','sýry','víno','byliny','ryby','ostatní',
]

const DAYS = [
  { key: 'po', label: 'Pondělí' },
  { key: 'út', label: 'Úterý' },
  { key: 'st', label: 'Středa' },
  { key: 'čt', label: 'Čtvrtek' },
  { key: 'pá', label: 'Pátek' },
  { key: 'so', label: 'Sobota' },
  { key: 'ne', label: 'Neděle' },
]

interface FarmData {
  id: string
  slug: string
  name: string
  description: string
  categories: FarmCategory[]
  city: string
  kraj: string
  images: string[]
  verified: boolean
  bio: boolean
  delivery: boolean
  pick_your_own: boolean
  tier: string
  opening_hours: Record<string, { open: string; close: string }> | null
  contact: {
    phone?: string
    email?: string
    web?: string
    instagram?: string
    facebook?: string
  } | null
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white'

export default function ProfilFarmaPage() {
  const { user, session, loading: authLoading } = useAuth()
  const router = useRouter()
  const [farm, setFarm] = useState<FarmData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable fields
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<FarmCategory[]>([])
  const [bio, setBio] = useState(false)
  const [delivery, setDelivery] = useState(false)
  const [pickYourOwn, setPickYourOwn] = useState(false)
  const [contact, setContact] = useState({ phone: '', email: '', web: '', instagram: '', facebook: '' })
  const [hours, setHours] = useState<Record<string, { enabled: boolean; open: string; close: string }>>({})
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  const token = session?.access_token ?? ''

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch('/api/farms/mine', { headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    const farms = (json.farms ?? []) as FarmData[]
    if (farms.length > 0) {
      const f = farms[0]
      setFarm(f)
      setDescription(f.description ?? '')
      setCategories(f.categories ?? [])
      setBio(f.bio ?? false)
      setDelivery(f.delivery ?? false)
      setPickYourOwn(f.pick_your_own ?? false)
      setImages(f.images ?? [])
      const c = f.contact ?? {}
      setContact({ phone: c.phone ?? '', email: c.email ?? '', web: c.web ?? '', instagram: c.instagram ?? '', facebook: c.facebook ?? '' })

      // Build hours state
      const h: Record<string, { enabled: boolean; open: string; close: string }> = {}
      for (const day of DAYS) {
        const existing = f.opening_hours?.[day.key]
        h[day.key] = existing
          ? { enabled: true, open: existing.open ?? '08:00', close: existing.close ?? '17:00' }
          : { enabled: false, open: '08:00', close: '17:00' }
      }
      setHours(h)
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/prihlasit')
  }, [authLoading, user, router])

  useEffect(() => {
    if (token) load()
  }, [token, load])

  async function handleSave() {
    if (!farm) return
    setSaving(true)
    setSaved(false)

    const opening_hours = Object.fromEntries(
      DAYS.filter(d => hours[d.key]?.enabled)
        .map(d => [d.key, { open: hours[d.key].open, close: hours[d.key].close }])
    )

    await fetch(`/api/farms/${farm.slug}/edit`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        description,
        categories,
        bio,
        delivery,
        pick_your_own: pickYourOwn,
        contact,
        opening_hours: Object.keys(opening_hours).length > 0 ? opening_hours : null,
        images,
      }),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function toggleCat(cat: FarmCategory) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function addImage() {
    const url = newImageUrl.trim()
    if (!url || !url.startsWith('http')) return
    setImages(prev => [...prev, url])
    setNewImageUrl('')
  }

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-24 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </main>
        <Footer />
      </>
    )
  }

  if (!farm) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-24 pb-20">
          <div className="max-w-xl mx-auto px-4 text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🌾</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-forest mb-3">Nemáte žádnou farmu</h1>
            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
              Ke správě farmy nejprve pošlete žádost o nárokování. Tým Mapa Farem ji ověří a přidělí vám přístup.
            </p>
            <a
              href="/pro-farmary/narokovat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
            >
              Nárokovat farmu
            </a>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl font-bold text-forest">{farm.name}</h1>
                {farm.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">Ověřeno</span>
                )}
                {farm.tier !== 'free' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">{farm.tier}</span>
                )}
              </div>
              <p className="text-sm text-neutral-500">{farm.city}, {farm.kraj}</p>
            </div>
            <a
              href={`/farmy/${farm.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary-600 hover:underline shrink-0 mt-1"
            >
              <ExternalLink size={13} /> Zobrazit stránku
            </a>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <Card title="Popis">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className={cn(inputCls, 'resize-none')}
                placeholder="Popište vaši farmu…"
              />
            </Card>

            {/* Categories */}
            <Card title="Kategorie produktů">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCat(cat)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-medium border transition-[border-color,background-color,color] duration-150 text-left',
                      categories.includes(cat)
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-primary-200 bg-white',
                    )}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </Card>

            {/* Features */}
            <Card title="Vlastnosti farmy">
              <div className="space-y-3">
                {([
                  { key: 'bio', label: 'Bio / Eko certifikace', hint: 'Farma má certifikaci ekologického zemědělství', value: bio, set: setBio },
                  { key: 'delivery', label: 'Nabízí rozvoz', hint: 'Doručení přímo k zákazníkovi nebo zásilkový prodej', value: delivery, set: setDelivery },
                  { key: 'pickYourOwn', label: 'Samosběr', hint: 'Zákazníci si mohou sami sbírat produkty', value: pickYourOwn, set: setPickYourOwn },
                ] as const).map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.set(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary-600 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-forest group-hover:text-primary-700 transition-colors">{item.label}</p>
                      <p className="text-xs text-neutral-400">{item.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Contact */}
            <Card title="Kontakt">
              <div className="grid sm:grid-cols-2 gap-3">
                {(['phone','email','web','instagram','facebook'] as const).map(field => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-neutral-500 block mb-1 capitalize">{field}</label>
                    <input
                      value={contact[field]}
                      onChange={e => setContact(prev => ({ ...prev, [field]: e.target.value }))}
                      className={inputCls}
                      placeholder={field === 'phone' ? '+420 …' : field === 'web' ? 'https://…' : ''}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Opening hours */}
            <Card title="Otevírací doba">
              <div className="space-y-2">
                {DAYS.map(day => {
                  const h = hours[day.key] ?? { enabled: false, open: '08:00', close: '17:00' }
                  return (
                    <div key={day.key} className="flex items-center gap-3">
                      <label className="flex items-center gap-2 w-28 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={h.enabled}
                          onChange={e => setHours(prev => ({ ...prev, [day.key]: { ...prev[day.key], enabled: e.target.checked } }))}
                          className="w-4 h-4 rounded accent-primary-600"
                        />
                        <span className={cn('text-sm font-medium', h.enabled ? 'text-forest' : 'text-neutral-300')}>{day.label}</span>
                      </label>
                      {h.enabled && (
                        <div className="flex items-center gap-2">
                          <input type="time" value={h.open} onChange={e => setHours(prev => ({ ...prev, [day.key]: { ...prev[day.key], open: e.target.value } }))} className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                          <span className="text-neutral-400">–</span>
                          <input type="time" value={h.close} onChange={e => setHours(prev => ({ ...prev, [day.key]: { ...prev[day.key], close: e.target.value } }))} className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                        </div>
                      )}
                      {!h.enabled && <span className="text-neutral-300 text-sm italic">Zavřeno</span>}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Photos */}
            <Card title="Fotografie">
              <div className="space-y-2 mb-3">
                {images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={url}
                      onChange={e => setImages(prev => prev.map((u, idx) => idx === i ? e.target.value : u))}
                      className={cn(inputCls, 'flex-1 text-xs')}
                    />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addImage()}
                  placeholder="https://… (URL fotografie)"
                  className={cn(inputCls, 'flex-1 text-xs')}
                />
                <button
                  onClick={addImage}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-medium transition-colors"
                >
                  <Plus size={13} /> Přidat
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-2">Přidejte URL fotografií vaší farmy (JPG, PNG).</p>
            </Card>

            {/* Save */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-primary-600">
                  <Check size={15} /> Uloženo
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Uložit změny
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-neutral-50">
        <h2 className="font-heading font-semibold text-forest text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
