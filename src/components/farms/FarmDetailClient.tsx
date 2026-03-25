'use client'

import { useState, useEffect } from 'react'
import { Send, ShoppingBasket, Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/farms'
import type { Farm, FarmCategory } from '@/types/farm'
import { useRecentFarms } from '@/hooks/useRecentFarms'
import { useBedynka } from '@/hooks/useBedynka'

const TABS = [
  { id: 'o-farme', label: 'O farmě' },
  { id: 'produkty', label: 'Produkty' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'recenze', label: 'Recenze' },
  { id: 'kontakt', label: 'Kontakt' },
] as const

type TabId = (typeof TABS)[number]['id']

interface MockProduct {
  id: string
  name: string
  price: string
  unit: string
  category: FarmCategory
  gradient: string
  available: boolean
}

// Mock product data — in production these come from the farm's data
const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Čerstvé vejce (10 ks)', price: '65', unit: 'krt', category: 'vejce', gradient: 'from-amber-100 to-yellow-200', available: true },
  { id: 'p2', name: 'Zahrádkářský salát', price: '28', unit: 'ks', category: 'zelenina', gradient: 'from-green-100 to-emerald-200', available: true },
  { id: 'p3', name: 'Rajčata cherry (250g)', price: '45', unit: 'bal', category: 'zelenina', gradient: 'from-red-100 to-rose-200', available: true },
  { id: 'p4', name: 'Lesní med (500g)', price: '180', unit: 'skl', category: 'med', gradient: 'from-amber-200 to-orange-200', available: false },
  { id: 'p5', name: 'Bedýnka zeleniny', price: '290', unit: 'ks', category: 'zelenina', gradient: 'from-teal-100 to-green-200', available: true },
  { id: 'p6', name: 'Okurky salátové (1kg)', price: '38', unit: 'kg', category: 'zelenina', gradient: 'from-lime-100 to-green-200', available: true },
]

const GALLERY_GRADIENTS = [
  'from-emerald-300 to-teal-400',
  'from-green-400 to-lime-400',
  'from-teal-300 to-cyan-500',
  'from-lime-300 to-green-400',
  'from-emerald-400 to-green-600',
  'from-cyan-300 to-teal-500',
  'from-green-300 to-emerald-500',
]

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Lenka B.', city: 'Praha', rating: 5, date: 'Březen 2025', comment: 'Výborná zelenina, vždy čerstvá a plná chuti. Doporučuji bedýnku na celý týden!' },
  { id: 'r2', name: 'Jakub H.', city: 'Brno', rating: 5, date: 'Únor 2025', comment: 'Pan farmář je vždy ochotný a poradí, co je zrovna v sezóně. Vejce jsou luxusní.' },
  { id: 'r3', name: 'Petra S.', city: 'Ostrava', rating: 4, date: 'Leden 2025', comment: 'Skvělá farma, vše bylo čerstvé. Objednávka proběhla rychle a bez problémů.' },
]

export function FarmDetailClient({ farm }: { farm: Farm }) {
  const [activeTab, setActiveTab] = useState<TabId>('o-farme')
  const [formState, setFormState] = useState({ name: '', email: '', message: '', sent: false })
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '', sent: false })
  const { addRecentFarm } = useRecentFarms()
  const { isInBedynka, addItem } = useBedynka()

  // Record this page view in the recently viewed list
  useEffect(() => {
    addRecentFarm(farm)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm.slug])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState((s) => ({ ...s, sent: true }))
  }

  return (
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
                : 'text-gray-500 hover:text-forest hover:bg-surface border border-transparent',
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
              <p className="text-gray-600 leading-relaxed mb-6">{farm.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {farm.categories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100">
                    <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-primary-700">{CATEGORY_LABELS[cat]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Produkty */}
          {activeTab === 'produkty' && (
            <div role="tabpanel" id="panel-produkty" aria-labelledby="tab-produkty">
              <h2 className="font-heading text-xl font-bold text-forest mb-4">Produkty</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_PRODUCTS.map((product) => {
                  const inBedynka = isInBedynka(`${farm.slug}__${product.id}`)
                  return (
                    <div key={product.id} className={cn('relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5', !product.available && 'opacity-60')}>
                      <div className={cn('h-28 bg-gradient-to-br relative', product.gradient)} aria-hidden="true">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-heading font-semibold text-forest text-sm leading-tight">{product.name}</h3>
                          <div className="text-right flex-shrink-0">
                            <span className="font-bold text-earth-700 text-base">{product.price} Kč</span>
                            <span className="text-xs text-gray-400 block">/{product.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-semibold', product.available ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'bg-gray-100 text-gray-400')}>
                            {product.available ? 'Dostupné' : 'Nedostupné'}
                          </span>
                          {product.available && (
                            <button
                              onClick={() => addItem({ productId: product.id, productName: product.name, price: product.price, unit: product.unit, farmSlug: farm.slug, farmName: farm.name })}
                              disabled={inBedynka}
                              aria-label={inBedynka ? 'Již v bedýnce' : `Přidat ${product.name} do bedýnky`}
                              className={cn(
                                'flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer',
                                inBedynka ? 'bg-primary-50 border-primary-200 text-primary-600 cursor-default' : 'bg-white border-gray-200 text-gray-500 hover:border-primary-400 hover:text-primary-600',
                              )}
                            >
                              {inBedynka ? <Check className="w-3 h-3" aria-hidden="true" /> : <ShoppingBasket className="w-3 h-3" aria-hidden="true" />}
                              {inBedynka ? 'V bedýnce' : '+ Bedýnka'}
                            </button>
                          )}
                        </div>
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
              {/* CSS columns masonry */}
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
            </div>
          )}

          {/* Recenze */}
          {activeTab === 'recenze' && (
            <div role="tabpanel" id="panel-recenze" aria-labelledby="tab-recenze">
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Recenze zákazníků</h2>
              {/* Rating summary */}
              <div className="flex items-center gap-5 p-5 rounded-2xl bg-primary-50 border border-primary-100 mb-6">
                <div className="text-center">
                  <div className="font-heading font-bold text-5xl text-forest">4.9</div>
                  <div className="flex justify-center gap-0.5 my-1" aria-label="4.9 z 5 hvězd" role="img">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">128 recenzí</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 1 : 1
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-3">{star}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-right">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                          {review.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-forest">{review.name}</div>
                          <div className="text-xs text-gray-400">{review.city} · {review.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5" aria-label={`${review.rating} hvězd`} role="img">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={cn('w-3.5 h-3.5', i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')} viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Review form */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-heading font-semibold text-forest mb-4">Napsat recenzi</h3>
                {reviewForm.sent ? (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium">
                    <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    Děkujeme za vaši recenzi!
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const { name, city, rating, text } = reviewForm
                      if (!name.trim() || !text.trim()) return
                      // Save to localStorage as fallback
                      const key = `mf_reviews_${farm.slug}`
                      const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[]
                      localStorage.setItem(key, JSON.stringify([...existing, { name, city, rating, text, date: new Date().toISOString() }]))
                      setReviewForm((s) => ({ ...s, sent: true }))
                    }}
                    className="space-y-4"
                    aria-label="Formulář pro recenzi"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField id="review-name" label="Vaše jméno" required>
                        <input id="review-name" type="text" required placeholder="Jana N." value={reviewForm.name} onChange={(e) => setReviewForm((s) => ({ ...s, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                      </FormField>
                      <FormField id="review-city" label="Město">
                        <input id="review-city" type="text" placeholder="Praha" value={reviewForm.city} onChange={(e) => setReviewForm((s) => ({ ...s, city: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
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
                            <Star className={cn('w-6 h-6 transition-colors', reviewForm.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200')} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <FormField id="review-text" label="Recenze" required>
                      <textarea id="review-text" required rows={3} placeholder="Popište svou zkušenost s farmou…" value={reviewForm.text} onChange={(e) => setReviewForm((s) => ({ ...s, text: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" />
                    </FormField>
                    <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors cursor-pointer">
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
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
                  <p className="text-sm text-gray-500">Farmář se vám brzy ozve.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4" aria-label="Kontaktní formulář">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField id="contact-name" label="Vaše jméno" required>
                      <input id="contact-name" type="text" required placeholder="Jana Nováková" value={formState.name} onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
                    </FormField>
                    <FormField id="contact-email" label="E-mail" required>
                      <input id="contact-email" type="email" required placeholder="jana@email.cz" value={formState.email} onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
                    </FormField>
                  </div>
                  <FormField id="contact-message" label="Zpráva" required>
                    <textarea id="contact-message" required rows={5} placeholder="Dobrý den, rád bych se zeptal na..." value={formState.message} onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all" />
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
        </aside>
      </div>
    </div>
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Contact info */}
      <div className="p-5 space-y-3">
        <h3 className="font-heading font-bold text-forest text-sm">Kontakt</h3>
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 10.7a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.14a16 16 0 006.91 6.91l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
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
          <a href={contact.web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
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
        <div className="flex items-start gap-2.5 text-sm text-gray-600">
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
        <div className="border-t border-gray-50 px-5 py-4">
          <h4 className="font-heading font-semibold text-forest text-xs uppercase tracking-wider mb-3">Otevírací doba</h4>
          <table className="w-full text-xs" aria-label="Otevírací doba">
            <tbody>
              {DAY_ORDER.map((day) => {
                const hours = openingHours[day as keyof typeof openingHours]
                return (
                  <tr key={day} className="border-b border-gray-50 last:border-0">
                    <td className="py-1 font-medium text-gray-600 w-8">{DAY_LABELS[day]}</td>
                    <td className="py-1 text-right text-gray-500">{hours ? `${hours.open}–${hours.close}` : <span className="text-gray-300">—</span>}</td>
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
