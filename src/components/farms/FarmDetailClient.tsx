'use client'

import { useState, useEffect } from 'react'
import {
  Send, ShoppingBasket, Check, Star, User, MapPin,
  ExternalLink, ShoppingCart,
} from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/farms'
import type { Farm } from '@/types/farm'
import { useRecentFarms } from '@/hooks/useRecentFarms'
import { useBedynka } from '@/hooks/useBedynka'
import { useReviews } from '@/hooks/useReviews'
import { useToast } from '@/components/ui/Toast'
import {
  SPRING_GENTLE,
  SPRING_BOUNCY,
  fadeUp,
  scaleIn,
  staggerContainer,
  tabSlide,
} from '@/lib/motionVariants'

const TABS = [
  { id: 'o-farme',  label: 'O farmě' },
  { id: 'produkty', label: 'Produkty' },
  { id: 'galerie',  label: 'Galerie' },
  { id: 'recenze',  label: 'Recenze' },
  { id: 'kontakt',  label: 'Kontakt' },
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

const GALLERY_HEIGHTS = ['h-48', 'h-32', 'h-40', 'h-36', 'h-44', 'h-32', 'h-40']

export function FarmDetailClient({ farm }: { farm: Farm }) {
  const [activeTab, setActiveTab] = useState<TabId>('o-farme')
  const [direction, setDirection] = useState(0)
  const [formState, setFormState] = useState({ name: '', email: '', message: '', sent: false })
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '', sent: false })
  const { addRecentFarm } = useRecentFarms()
  const { addItem, isInBedynka } = useBedynka()
  const { reviews, submitReview } = useReviews(farm.slug)
  const { show } = useToast()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    addRecentFarm(farm)
    fetch(`/api/farms/${farm.slug}/view`, { method: 'POST' }).catch(() => null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm.slug])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState((s) => ({ ...s, sent: true }))
  }

  const switchTab = (newTab: TabId) => {
    const from = TABS.findIndex((t) => t.id === activeTab)
    const to   = TABS.findIndex((t) => t.id === newTab)
    setDirection(to > from ? 1 : -1)
    setActiveTab(newTab)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ─── Tab navigation ─── */}
      <div
        className="flex gap-1.5 mb-8 overflow-x-auto scrollbar-none pb-0.5"
        role="tablist"
        aria-label="Sekce farmy"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => switchTab(tab.id)}
              className={cn(
                'relative px-5 py-2.5 text-sm font-semibold rounded-xl cursor-pointer',
                'whitespace-nowrap flex-shrink-0 active:scale-95 transition-colors duration-150',
                isActive ? 'text-primary-700' : 'text-gray-500 hover:text-forest border border-transparent',
              )}
            >
              {/* Sliding background pill */}
              {isActive && (
                <motion.div
                  layoutId="farm-tab-indicator"
                  className="absolute inset-0 bg-primary-50 border border-primary-200 rounded-xl shadow-sm"
                  transition={reducedMotion ? { duration: 0 } : SPRING_BOUNCY}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─── Tab panels ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-h-[320px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={reducedMotion ? undefined : tabSlide}
              initial={reducedMotion ? false : 'enter'}
              animate="center"
              exit={reducedMotion ? undefined : 'exit'}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >

              {/* ── O farmě ── */}
              {activeTab === 'o-farme' && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2
                    variants={fadeUp}
                    transition={SPRING_GENTLE}
                    className="font-heading text-xl font-bold text-forest mb-4"
                  >
                    O farmě
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    transition={SPRING_GENTLE}
                    className="text-gray-600 leading-relaxed mb-6"
                  >
                    {farm.description}
                  </motion.p>
                  <motion.div
                    variants={staggerContainer}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
                  >
                    {farm.categories.map((cat) => (
                      <motion.div
                        key={cat}
                        variants={scaleIn}
                        transition={SPRING_BOUNCY}
                        className="flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm font-medium text-primary-700">{CATEGORY_LABELS[cat]}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div
                    variants={fadeUp}
                    transition={SPRING_GENTLE}
                    className="flex items-center gap-2 p-4 rounded-xl bg-surface border border-gray-100"
                  >
                    <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-600 flex-1">
                      {farm.location.address}, {farm.location.city}
                    </span>
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
                  </motion.div>
                </motion.div>
              )}

              {/* ── Produkty ── */}
              {activeTab === 'produkty' && (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2
                    variants={fadeUp}
                    transition={SPRING_GENTLE}
                    className="font-heading text-xl font-bold text-forest mb-2"
                  >
                    Produkty
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    transition={SPRING_GENTLE}
                    className="text-xs text-gray-400 mb-6"
                  >
                    Přesné ceny a dostupnost zjistíte přímo u farmáře. Přidejte si zájem do bedýnky.
                  </motion.p>
                  <div className="space-y-4">
                    {farm.categories.map((cat) => {
                      const itemId = `${farm.slug}__${cat}`
                      const added = isInBedynka(itemId)
                      return (
                        <motion.div
                          key={cat}
                          variants={fadeUp}
                          transition={SPRING_GENTLE}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0"
                                aria-hidden="true"
                              >
                                <ShoppingBasket className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-heading font-semibold text-forest text-sm">
                                  {CATEGORY_LABELS[cat]}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Dostupnost a cenu upřesní farmář
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileTap={reducedMotion ? {} : { scale: 0.93 }}
                              onClick={() => {
                                if (!added) {
                                  addItem({
                                    farmSlug: farm.slug,
                                    farmName: farm.name,
                                    productId: cat,
                                    productName: CATEGORY_LABELS[cat],
                                    price: '',
                                    unit: '',
                                  })
                                }
                              }}
                              aria-label={
                                added
                                  ? `${CATEGORY_LABELS[cat]} přidáno do bedýnky`
                                  : `Přidat ${CATEGORY_LABELS[cat]} do bedýnky`
                              }
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0',
                                added
                                  ? 'bg-primary-50 text-primary-700 border border-primary-200 cursor-default'
                                  : 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer',
                              )}
                            >
                              {added ? (
                                <><Check className="w-3.5 h-3.5" aria-hidden="true" />V bedýnce</>
                              ) : (
                                <><ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />Do bedýnky</>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Galerie ── */}
              {activeTab === 'galerie' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-forest mb-4">Fotogalerie</h2>
                  <motion.div
                    className="columns-2 sm:columns-3 gap-3 space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {GALLERY_GRADIENTS.map((gradient, i) => (
                      <motion.div
                        key={i}
                        variants={scaleIn}
                        transition={SPRING_BOUNCY}
                        className={cn(
                          'w-full rounded-xl overflow-hidden bg-gradient-to-br break-inside-avoid',
                          'cursor-pointer group relative',
                          gradient,
                          GALLERY_HEIGHTS[i],
                        )}
                        role="img"
                        aria-label={`Foto z farmy ${farm.name} ${i + 1}`}
                        whileHover={reducedMotion ? {} : { scale: 1.02 }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* ── Recenze ── */}
              {activeTab === 'recenze' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-forest mb-6">
                    Recenze zákazníků
                  </h2>

                  {reviews.length === 0 ? (
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={SPRING_GENTLE}
                      className="flex flex-col items-center justify-center py-10 text-center text-gray-400 mb-6"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-10 h-10 mb-3 text-gray-200 fill-gray-200"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-500 mb-1">Zatím žádné recenze.</p>
                      <p className="text-xs">Buďte první, kdo ohodnotí tuto farmu.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-4 mb-8"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          variants={fadeUp}
                          transition={SPRING_GENTLE}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                              <User className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-heading font-semibold text-forest text-sm">
                                  {review.name}
                                </span>
                                {review.city && (
                                  <span className="text-xs text-gray-400">· {review.city}</span>
                                )}
                                <span className="text-xs text-gray-300">
                                  ·{' '}
                                  {new Date(review.date).toLocaleDateString('cs-CZ', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div
                                className="flex gap-0.5 my-1.5"
                                aria-label={`${review.rating} z 5 hvězd`}
                              >
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={cn(
                                      'w-3.5 h-3.5',
                                      idx < review.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-200 fill-gray-200',
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Review form */}
                  <div className={cn('pt-6 border-t border-gray-100', reviews.length > 0 && 'mt-4')}>
                    <h3 className="font-heading font-semibold text-forest mb-4">Napsat recenzi</h3>
                    {reviewForm.sent ? (
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={SPRING_BOUNCY}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium"
                      >
                        <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        Děkujeme za vaši recenzi! Bude zobrazena okamžitě.
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          const { name, city, rating, text } = reviewForm
                          if (!name.trim() || !text.trim()) return
                          const { error } = await submitReview({ name, city, rating, text })
                          if (error) {
                            show(error, 'error')
                          } else {
                            setReviewForm((s) => ({ ...s, sent: true }))
                          }
                        }}
                        className="space-y-4"
                        aria-label="Formulář pro recenzi"
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField id="review-name" label="Vaše jméno" required>
                            <input
                              id="review-name"
                              type="text"
                              required
                              placeholder="Jana N."
                              value={reviewForm.name}
                              onChange={(e) => setReviewForm((s) => ({ ...s, name: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                            />
                          </FormField>
                          <FormField id="review-city" label="Město">
                            <input
                              id="review-city"
                              type="text"
                              placeholder="Praha"
                              value={reviewForm.city}
                              onChange={(e) => setReviewForm((s) => ({ ...s, city: e.target.value }))}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                            />
                          </FormField>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-forest mb-1.5">Hodnocení</div>
                          <div className="flex gap-1" role="group" aria-label="Hodnocení hvězdičkami">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={reducedMotion ? {} : { scale: 1.2 }}
                                whileTap={reducedMotion ? {} : { scale: 0.9 }}
                                onClick={() => setReviewForm((s) => ({ ...s, rating: star }))}
                                aria-label={`${star} hvězd`}
                                aria-pressed={reviewForm.rating >= star}
                                className="cursor-pointer"
                              >
                                <Star
                                  className={cn(
                                    'w-6 h-6 transition-colors',
                                    reviewForm.rating >= star
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-200 fill-gray-200',
                                  )}
                                  aria-hidden="true"
                                />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        <FormField id="review-text" label="Recenze" required>
                          <textarea
                            id="review-text"
                            required
                            minLength={20}
                            rows={3}
                            placeholder="Popište svou zkušenost s farmou…"
                            value={reviewForm.text}
                            onChange={(e) => setReviewForm((s) => ({ ...s, text: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                          />
                        </FormField>
                        <motion.button
                          type="submit"
                          whileHover={reducedMotion ? {} : { scale: 1.02 }}
                          whileTap={reducedMotion ? {} : { scale: 0.97 }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" aria-hidden="true" />
                          Odeslat recenzi
                        </motion.button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* ── Kontakt ── */}
              {activeTab === 'kontakt' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-forest mb-6">
                    Kontaktujte farmáře
                  </h2>
                  {formState.sent ? (
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={SPRING_BOUNCY}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                        <Send className="w-6 h-6 text-primary-600" aria-hidden="true" />
                      </div>
                      <h3 className="font-heading font-bold text-forest text-lg mb-2">
                        Zpráva odeslána!
                      </h3>
                      <p className="text-sm text-gray-500">Farmář se vám brzy ozve.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleFormSubmit}
                      className="space-y-4"
                      aria-label="Kontaktní formulář"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={fadeUp} transition={SPRING_GENTLE} className="grid sm:grid-cols-2 gap-4">
                        <FormField id="contact-name" label="Vaše jméno" required>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            placeholder="Jana Nováková"
                            value={formState.name}
                            onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                          />
                        </FormField>
                        <FormField id="contact-email" label="E-mail" required>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            placeholder="jana@email.cz"
                            value={formState.email}
                            onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                          />
                        </FormField>
                      </motion.div>
                      <motion.div variants={fadeUp} transition={SPRING_GENTLE}>
                        <FormField id="contact-message" label="Zpráva" required>
                          <textarea
                            id="contact-message"
                            required
                            rows={5}
                            placeholder="Dobrý den, rád bych se zeptal na..."
                            value={formState.message}
                            onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                          />
                        </FormField>
                      </motion.div>
                      <motion.div variants={fadeUp} transition={SPRING_GENTLE}>
                        <motion.button
                          type="submit"
                          whileHover={reducedMotion ? {} : { scale: 1.02 }}
                          whileTap={reducedMotion ? {} : { scale: 0.97 }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <Send className="w-4 h-4" aria-hidden="true" />
                          Odeslat zprávu
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  )}

                  {/* Map placeholder */}
                  <div className="mt-8">
                    <h3 className="font-heading font-semibold text-forest text-sm mb-3">
                      Jak se k nám dostat
                    </h3>
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...SPRING_GENTLE, delay: 0.2 }}
                      className="h-48 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 border border-primary-200 flex items-center justify-center mb-3"
                      role="img"
                      aria-label={`Mapa polohy farmy ${farm.name}`}
                    >
                      <div className="text-center text-sm text-primary-600">
                        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-2">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-white fill-white"
                            aria-hidden="true"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                          </svg>
                        </div>
                        <p className="font-medium">{farm.location.address}</p>
                        <p className="text-xs text-primary-400 mt-0.5">
                          {farm.location.city}, {farm.location.kraj}
                        </p>
                      </div>
                    </motion.div>
                    <a
                      href={`https://maps.google.com/?q=${farm.location.lat},${farm.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors duration-200 shadow-sm"
                      aria-label={`Navigovat k farmě ${farm.name} v Google Maps`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 fill-white"
                        aria-hidden="true"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Navigovat v Google Maps
                    </a>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5" aria-label="Informace o farmě">
          <FarmInfoCard farm={farm} />
        </aside>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FormField({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-forest mb-1.5">
        {label}
        {required && (
          <span className="text-red-400 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function FarmInfoCard({ farm }: { farm: Farm }) {
  const { contact, location, openingHours } = farm
  const DAY_LABELS: Record<string, string> = {
    po: 'Po', út: 'Út', st: 'St', čt: 'Čt', pá: 'Pá', so: 'So', ne: 'Ne',
  }
  const DAY_ORDER = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_GENTLE}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
    >
      {/* Contact info */}
      <div className="p-5 space-y-3">
        <h3 className="font-heading font-bold text-forest text-sm">Kontakt</h3>
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 10.7a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.14a16 16 0 006.91 6.91l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {contact.phone}
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {contact.email}
          </a>
        )}
        {contact.web && (
          <a
            href={contact.web}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path
                  d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-primary-600 fill-primary-600"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </span>
          <span>
            {location.address}, {location.city}
            <br />
            {location.zip} · {location.kraj}
          </span>
        </div>
      </div>

      {/* Opening hours */}
      {openingHours && (
        <div className="border-t border-gray-50 px-5 py-4">
          <h4 className="font-heading font-semibold text-forest text-xs uppercase tracking-wider mb-3">
            Otevírací doba
          </h4>
          <table className="w-full text-xs" aria-label="Otevírací doba">
            <tbody>
              {DAY_ORDER.map((day) => {
                const hours = openingHours[day as keyof typeof openingHours]
                return (
                  <tr key={day} className="border-b border-gray-50 last:border-0">
                    <td className="py-1 font-medium text-gray-600 w-8">{DAY_LABELS[day]}</td>
                    <td className="py-1 text-right text-gray-500">
                      {hours ? (
                        `${hours.open}–${hours.close}`
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
