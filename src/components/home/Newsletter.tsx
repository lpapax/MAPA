'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const BENEFITS = [
  'Nové farmy ve vašem kraji',
  'Sezónní tipy a recepty',
  'Jednou za měsíc — žádný spam',
]

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'error' | 'info'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setToast(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json() as { success: boolean; error?: string }
      if (res.status === 409) {
        setToast({ type: 'info', message: 'Tento e-mail je již přihlášen k odběru.' })
      } else if (!data.success) {
        setToast({ type: 'error', message: data.error ?? 'Něco se nepovedlo. Zkuste to znovu.' })
      } else {
        setSubmitted(true)
      }
    } catch {
      setToast({ type: 'error', message: 'Připojení se nezdařilo. Zkuste to znovu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="bg-newsletter grain relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Background farm photo — blended into the gradient */}
      <img
        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=60"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12] mix-blend-luminosity pointer-events-none select-none"
        loading="lazy"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Split layout: text left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — editorial text block */}
          <div>
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
              Newsletter
            </p>
            <h2
              id="newsletter-heading"
              className="font-heading font-bold text-white leading-tight tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Zůstaňte v&nbsp;obraze
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
              Novinky ze světa českých farem přímo do vaší schránky. Žádné reklamy, jen obsah, který vás zajímá.
            </p>

            {/* Benefit list */}
            <ul className="flex flex-col gap-3" aria-label="Co dostanete">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-primary-300 flex-shrink-0" aria-hidden="true" />
                  <span className="text-white/75 text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form block */}
          <div>
            <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1,    y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-4 px-7 py-5 rounded-2xl bg-white/12 border border-white/20 text-white font-semibold"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.12, type: 'spring', stiffness: 500, damping: 22 }}
                >
                  <CheckCircle className="w-6 h-6 text-primary-300 flex-shrink-0" aria-hidden="true" />
                </motion.div>
                <div>
                  <p className="font-heading font-semibold text-white">Přihlásili jste se úspěšně.</p>
                  <p className="text-white/55 text-sm font-normal mt-0.5">Těšte se na první vydání.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl bg-white/10 border border-white/10 p-7 lg:p-8"
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  aria-label="Přihlásit se k newsletteru"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="newsletter-email" className="text-white/70 text-sm font-medium">
                      Vaše e-mailová adresa
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="váš@email.cz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        'w-full px-5 py-3.5 rounded-xl bg-white/12 border border-white/25',
                        'text-white placeholder:text-white/35 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40',
                        'transition-[border-color,box-shadow] duration-200',
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-xl',
                      'bg-white text-forest font-semibold text-sm',
                      'hover:bg-primary-50 transition-[transform,background-color] duration-150 cursor-pointer',
                      'active:scale-[0.97] shadow-lg',
                      loading && 'opacity-70 cursor-not-allowed',
                    )}
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      : <Send className="w-4 h-4" aria-hidden="true" />
                    }
                    Odebírat novinky
                  </button>

                  {toast && (
                    <p
                      className={cn(
                        'text-sm font-medium',
                        toast.type === 'error' ? 'text-red-300' : 'text-white/70',
                      )}
                      role="alert"
                    >
                      {toast.message}
                    </p>
                  )}
                </form>

                <p className="text-white/30 text-xs mt-5">
                  Odesláním souhlasíte s{' '}
                  <a
                    href="/soukromi"
                    className="underline underline-offset-2 hover:text-white/55 transition-colors"
                  >
                    ochranou soukromí
                  </a>
                  . Odhlásit se lze kdykoliv.
                </p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
