'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Send, Check, Star, User, MapPin, ExternalLink, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, CATEGORY_META, isFarmOpenNow } from '@/lib/farms'
import type { Farm } from '@/types/farm'
import { useRecentFarms } from '@/hooks/useRecentFarms'
import { useReviews } from '@/hooks/useReviews'
import { useToast } from '@/components/ui/Toast'

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url: string
  relative_time_description: string
}

const REVIEW_TAGS = [
  { emoji: '👍', label: 'Skvělá kvalita' },
  { emoji: '🌿', label: 'Opravdu bio' },
  { emoji: '😊', label: 'Přátelský farmář' },
  { emoji: '💰', label: 'Dobrá cena' },
  { emoji: '🚀', label: 'Rychlé vyřízení' },
  { emoji: '🔄', label: 'Vrátím se' },
]

const TABS = [
  { id: 'o-farme', label: 'O farmě' },
  { id: 'produkty', label: 'Produkty' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'recenze', label: 'Recenze' },
  { id: 'kontakt', label: 'Kontakt' },
] as const

type TabId = (typeof TABS)[number]['id']

const GALLERY_GRADIENTS = [
  'from-emerald-300 to-teal-400',
  'from-green-400 to-lime-400',
  'from-teal-300 to-cyan-500',
  'from-lime-300 to-green-400',
  'from-emerald-400 to-green-600',
  'from-cyan-300 to-teal-500',
  'from-green-300 to-emerald-500',
]


export function FarmDetailClient({ farm, similarFarms = [] }: { farm: Farm; similarFarms?: Farm[] }) {
  const [activeTab, setActiveTab] = useState<TabId>('o-farme')
  const [formState, setFormState] = useState({ name: '', email: '', message: '', sent: false })
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '', tags: [] as string[], sent: false, loading: false })
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([])
  const [googleLoading, setGoogleLoading] = useState(false)
  const { addRecentFarm } = useRecentFarms()
  const { reviews, submitReview } = useReviews(farm.slug)
  const { show } = useToast()

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevPhoto = useCallback(() => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length } : null), [])
  const nextPhoto = useCallback(() => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.photos.length } : null), [])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, closeLightbox, prevPhoto, nextPhoto])

  // Record this page view in the recently viewed list + increment server counter
  useEffect(() => {
    addRecentFarm(farm)
    fetch(`/api/farms/${farm.slug}/view`, { method: 'POST' }).catch(() => null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm.slug])

  // Fetch Google reviews when recenze tab is opened
  useEffect(() => {
    if (activeTab !== 'recenze' || googleReviews.length > 0 || googleLoading) return
    setGoogleLoading(true)
    const name = encodeURIComponent(farm.name)
    const city = encodeURIComponent(farm.location?.city ?? '')
    fetch(`/api/farms/${farm.slug}/google-reviews?name=${name}&city=${city}`)
      .then(r => r.json())
      .then((data: { reviews: GoogleReview[] }) => {
        setGoogleReviews(data.reviews ?? [])
      })
      .catch(() => null)
      .finally(() => setGoogleLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState((s) => ({ ...s, sent: true }))
  }

  return (
    <>
    {/* Lightbox */}
    {lightbox && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Fotogalerie"
        onClick={closeLightbox}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lightbox.photos[lightbox.index]}
          alt={`${farm.name} foto ${lightbox.index + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button onClick={closeLightbox} aria-label="Zavřít" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
          <X className="w-5 h-5" />
        </button>
        {lightbox.photos.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prevPhoto() }} aria-label="Předchozí foto" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextPhoto() }} aria-label="Další foto" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightbox.index + 1} / {lightbox.photos.length}
            </div>
          </>
        )}
      </div>
    )}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab nav */}
      <div className="flex gap-1.5 mb-8 overflow-x-auto scrollbar-none pb-0.5" role="tablist" aria-label="Sekce farmy">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 active:scale-95',
              activeTab === tab.id
                ? 'text-primary-700 bg-primary-50 border border-primary-200 shadow-sm'
                : 'text-neutral-500 hover:text-forest hover:bg-surface border border-transparent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* O farmě */}
          {activeTab === 'o-farme' && (
            <div role="tabpanel" id="panel-o-farme" aria-labelledby="tab-o-farme">
              <h2 className="font-heading text-xl font-bold text-forest mb-4">O farmě</h2>
              <p className="text-neutral-600 leading-relaxed mb-6">{farm.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {farm.categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100">
                    <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-primary-700">{CATEGORY_LABELS[cat]}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-surface border border-neutral-100">
                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-neutral-600 flex-1">{farm.location.address}, {farm.location.city}</span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${farm.location.lat},${farm.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors flex-shrink-0"
                  aria-label={`Naplánovat cestu k farmě ${farm.name}`}
                >
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  Naplánovat cestu
                </a>
              </div>
            </div>
          )}

          {/* Produkty */}
          {activeTab === 'produkty' && (
            <div role="tabpanel" id="panel-produkty" aria-labelledby="tab-produkty">
              <h2 className="font-heading text-xl font-bold text-forest mb-2">Produkty</h2>
              <p className="text-xs text-neutral-400 mb-6">Přesné ceny a dostupnost zjistíte přímo u farmáře.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {farm.categories.map((cat) => {
                  const meta = CATEGORY_META[cat]
                  return (
                    <div key={cat} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{meta.emoji}</span>
                      <div>
                        <h3 className="font-heading font-semibold text-forest text-sm">{CATEGORY_LABELS[cat]}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Cenu a dostupnost upřesní farmář</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Galerie */}
          {activeTab === 'galerie' && (
            <div role="tabpanel" id="panel-galerie" aria-labelledby="tab-galerie">
              <h2 className="font-heading text-xl font-bold text-forest mb-4">Fotogalerie</h2>
              {(() => {
                const realPhotos = (farm.images ?? []).filter(
                  (url) => url && !url.includes('placeholder') && url.startsWith('http'),
                )
                if (realPhotos.length > 0) {
                  return (
                    <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                      {realPhotos.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setLightbox({ photos: realPhotos, index: i })}
                          className="break-inside-avoid rounded-xl overflow-hidden bg-neutral-100 block w-full cursor-zoom-in group relative"
                          aria-label={`Zobrazit foto ${i + 1} z farmy ${farm.name}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`${farm.name} – foto ${i + 1}`}
                            className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )
                }
                return (
                  <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                    {GALLERY_GRADIENTS.map((gradient, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-full rounded-xl overflow-hidden bg-gradient-to-br break-inside-avoid',
                          gradient,
                          i % 3 === 0 ? 'h-48' : i % 3 === 1 ? 'h-32' : 'h-40',
                        )}
                        role="img"
                        aria-label={`Foto z farmy ${farm.name} ${i + 1}`}
                      />
                    ))}
                  </div>
                )
              })()}
            </div>
          )}

          {/* Recenze */}
          {activeTab === 'recenze' && (
            <div role="tabpanel" id="panel-recenze" aria-labelledby="tab-recenze">
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Recenze zákazníků</h2>

              {/* Google reviews */}
              {googleLoading && (
                <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Načítám recenze z Google…
                </div>
              )}
              {!googleLoading && googleReviews.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-semibold text-forest">Recenze z Google</span>
                    <span className="text-xs text-neutral-400">({googleReviews.length})</span>
                  </div>
                  <div className="space-y-4">
                    {googleReviews.map((gr, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                        <div className="flex items-start gap-3">
                          {gr.profile_photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={gr.profile_photo_url}
                              alt={gr.author_name}
                              className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                              {gr.author_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-heading font-semibold text-forest text-sm">{gr.author_name}</span>
                              <span className="text-xs text-neutral-300">· {gr.relative_time_description}</span>
                            </div>
                            <div className="flex gap-0.5 my-1.5" aria-label={`${gr.rating} z 5 hvězd`}>
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star key={idx} className={cn('w-3.5 h-3.5', idx < gr.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 fill-neutral-200')} aria-hidden="true" />
                              ))}
                            </div>
                            {gr.text && <p className="text-sm text-neutral-600 leading-relaxed">{gr.text}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing reviews */}
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400 mb-6">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 mb-3 text-neutral-200 fill-neutral-200" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <p className="text-sm font-medium text-neutral-500 mb-1">Zatím žádné recenze.</p>
                  <p className="text-xs">Buďte první, kdo ohodnotí tuto farmu.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                          <User className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-semibold text-forest text-sm">{review.name}</span>
                            {review.city && <span className="text-xs text-neutral-400">· {review.city}</span>}
                            <span className="text-xs text-neutral-300">· {new Date(review.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="flex gap-0.5 my-1.5" aria-label={`${review.rating} z 5 hvězd`}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={cn('w-3.5 h-3.5', idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 fill-neutral-200')} aria-hidden="true" />
                            ))}
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              <div className={cn('pt-6 border-t border-neutral-100', reviews.length > 0 && 'mt-4')}>
                <h3 className="font-heading font-semibold text-forest mb-4">Napsat recenzi</h3>
                {reviewForm.sent ? (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium">
                    <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    Děkujeme za vaši recenzi! Bude zobrazena okamžitě.
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const { name, city, rating, text } = reviewForm
                      if (!name.trim() || !text.trim()) return
                      setReviewForm((s) => ({ ...s, loading: true }))
                      const { error } = await submitReview({ name, city, rating, text })
                      if (error) {
                        show(error, 'error')
                        setReviewForm((s) => ({ ...s, loading: false }))
                      } else {
                        setReviewForm((s) => ({ ...s, sent: true, loading: false }))
                      }
                    }}
                    className="space-y-4"
                    aria-label="Formulář pro recenzi"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField id="review-name" label="Vaše jméno" required>
                        <input id="review-name" type="text" required placeholder="Jana N." value={reviewForm.name} onChange={(e) => setReviewForm((s) => ({ ...s, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      </FormField>
                      <FormField id="review-city" label="Město">
                        <input id="review-city" type="text" placeholder="Praha" value={reviewForm.city} onChange={(e) => setReviewForm((s) => ({ ...s, city: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      </FormField>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-forest mb-1.5">Hodnocení</div>
                      <div className="flex gap-1" role="group" aria-label="Hodnocení hvězdičkami">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm((s) => ({ ...s, rating: star }))}
                            aria-label={`${star} hvězd`}
                            aria-pressed={reviewForm.rating >= star}
                            className="cursor-pointer"
                          >
                            <Star className={cn('w-6 h-6 transition-colors', reviewForm.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 fill-neutral-200')} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Quick tags */}
                    <div>
                      <div className="text-xs font-semibold text-forest mb-2">Rychlé hodnocení</div>
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Rychlé štítky">
                        {REVIEW_TAGS.map((tag) => {
                          const active = reviewForm.tags.includes(tag.label)
                          return (
                            <button
                              key={tag.label}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setReviewForm((s) => ({
                                ...s,
                                tags: active ? s.tags.filter((t) => t !== tag.label) : [...s.tags, tag.label],
                              }))}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                                active
                                  ? 'bg-primary-600 border-primary-600 text-white'
                                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-400',
                              )}
                            >
                              <span>{tag.emoji}</span>
                              {tag.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <FormField id="review-text" label="Recenze" required>
                      <textarea id="review-text" required minLength={20} rows={3} placeholder="Popište svou zkušenost s farmou…" value={reviewForm.text} onChange={(e) => setReviewForm((s) => ({ ...s, text: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                    </FormField>
                    <button
                      type="submit"
                      disabled={reviewForm.loading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {reviewForm.loading
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        : <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      }
                      Odeslat recenzi
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Kontakt */}
          {activeTab === 'kontakt' && (
            <div role="tabpanel" id="panel-kontakt" aria-labelledby="tab-kontakt">
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Kontaktujte farmáře</h2>
              {formState.sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-bold text-forest text-lg mb-2">Zpráva odeslána!</h3>
                  <p className="text-sm text-neutral-500">Farmář se vám brzy ozve.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4" aria-label="Kontaktní formulář">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField id="contact-name" label="Vaše jméno" required>
                      <input id="contact-name" type="text" required placeholder="Jana Nováková" value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
                    </FormField>
                    <FormField id="contact-email" label="E-mail" required>
                      <input id="contact-email" type="email" required placeholder="jana@email.cz" value={formState.email} onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
                    </FormField>
                  </div>
                  <FormField id="contact-message" label="Zpráva" required>
                    <textarea id="contact-message" required rows={5} placeholder="Dobrý den, rád bych se zeptal na..." value={formState.message} onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
                  </FormField>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md">
                    <Send className="w-4 h-4" aria-hidden="true" />
                    Odeslat zprávu
                  </button>
                </form>
              )}

              {/* Jak se k nám dostat */}
              <div className="mt-8">
                <h3 className="font-heading font-semibold text-forest text-sm mb-3">Jak se k nám dostat</h3>
                <div className="h-48 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 border border-primary-200 flex items-center justify-center mb-3" role="img" aria-label={`Mapa polohy farmy ${farm.name}`}>
                  <div className="text-center text-sm text-primary-600">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-2">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-white" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <p className="font-medium">{farm.location.address}</p>
                    <p className="text-xs text-primary-400 mt-0.5">{farm.location.city}, {farm.location.kraj}</p>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${farm.location.lat},${farm.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors duration-200 shadow-sm"
                  aria-label={`Navigovat k farmě ${farm.name} v Google Maps`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Navigovat v Google Maps
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5" aria-label="Informace o farmě">
          <FarmInfoCard farm={farm} />
          {similarFarms.length > 0 && (
            <SimilarFarms farms={similarFarms} currentKraj={farm.location.kraj} />
          )}
        </aside>
      </div>
    </div>
    </>
  )
}

function FormField({ id, label, required, children }: { id: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-forest mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  )
}

function FarmInfoCard({ farm }: { farm: Farm }) {
  const { contact, location, openingHours } = farm
  const DAY_LABELS: Record<string, string> = { po: 'Po', út: 'Út', st: 'St', čt: 'Čt', pá: 'Pá', so: 'So', ne: 'Ne' }
  const DAY_ORDER = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne']
  const isOpen = openingHours ? isFarmOpenNow(farm) : null
  const primaryMeta = CATEGORY_META[farm.categories[0]] ?? CATEGORY_META.ostatní

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
      {/* Open/closed status + category */}
      {isOpen !== null && (
        <div
          className={cn('px-5 py-3 flex items-center justify-between', isOpen ? 'bg-green-50 border-b border-green-100' : 'bg-neutral-50 border-b border-neutral-100')}
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn('w-2 h-2 rounded-full flex-shrink-0', isOpen ? 'bg-green-500 animate-pulse' : 'bg-neutral-400')}
              aria-hidden="true"
            />
            <span className={cn('text-xs font-semibold', isOpen ? 'text-green-700' : 'text-neutral-500')}>
              {isOpen ? 'Nyní otevřeno' : 'Nyní zavřeno'}
            </span>
          </div>
          <span className="text-lg" aria-label={primaryMeta.label}>{primaryMeta.emoji}</span>
        </div>
      )}
      {/* Contact info */}
      <div className="p-5 space-y-3">
        <h3 className="font-heading font-bold text-forest text-sm">Kontakt</h3>
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 10.7a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.14a16 16 0 006.91 6.91l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {contact.email}
          </a>
        )}
        {contact.web && (
          <a href={contact.web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {contact.web.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      {/* Address */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-start gap-2.5 text-sm text-neutral-600">
          <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-600 fill-primary-600" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </span>
          <span>{location.address}, {location.city}<br />{location.zip} · {location.kraj}</span>
        </div>
      </div>

      {/* Opening hours */}
      {openingHours && (
        <div className="border-t border-neutral-50 px-5 py-4">
          <h4 className="font-heading font-semibold text-forest text-xs uppercase tracking-wider mb-3">Otevírací doba</h4>
          <table className="w-full text-xs" aria-label="Otevírací doba">
            <tbody>
              {DAY_ORDER.map((day) => {
                const hours = openingHours[day as keyof typeof openingHours]
                return (
                  <tr key={day} className="border-b border-neutral-50 last:border-0">
                    <td className="py-1 font-medium text-neutral-600 w-8">{DAY_LABELS[day]}</td>
                    <td className="py-1 text-right text-neutral-500">{hours ? `${hours.open}–${hours.close}` : <span className="text-neutral-300">—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SimilarFarms({ farms, currentKraj }: { farms: Farm[]; currentKraj: string }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-heading font-bold text-forest text-sm mb-0.5">Podobné farmy</h3>
        <p className="text-xs text-neutral-400">{currentKraj}</p>
      </div>
      <div className="divide-y divide-neutral-50">
        {farms.map((f) => {
          const meta = CATEGORY_META[f.categories[0] ?? 'ostatní'] ?? CATEGORY_META.ostatní
          const img = f.images?.[0] ?? ''
          const photo = img.startsWith('http') && !img.includes('placeholder') ? img : null
          return (
            <Link
              key={f.slug}
              href={`/farmy/${f.slug}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors group cursor-pointer"
              aria-label={`Přejít na farmu ${f.name}`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50 flex items-center justify-center">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                ) : (
                  <span className="text-lg" aria-hidden="true">{meta.emoji}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-forest truncate group-hover:text-primary-600 transition-colors">
                  {f.name}
                </div>
                <div className="text-xs text-neutral-400 truncate">{f.location.city}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" aria-hidden="true" />
            </Link>
          )
        })}
      </div>
      <div className="px-5 pb-4 pt-2">
        <Link
          href={`/mapa?kraj=${encodeURIComponent(currentKraj)}`}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          Zobrazit všechny farmy v kraji →
        </Link>
      </div>
    </div>
  )
}
