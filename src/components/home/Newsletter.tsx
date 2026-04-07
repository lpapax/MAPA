'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const BENEFITS = ['Nové farmy v okolí', 'Sezónní tipy a recepty', 'Jednou za měsíc']

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
      className="py-20 bg-newsletter relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Organic blob decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" aria-hidden="true" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/[0.04] -translate-y-1/2" aria-hidden="true" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Icon badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/25 mb-6 mx-auto">
          <Mail className="w-6 h-6 text-white" aria-hidden="true" />
        </div>

        <h2
          id="newsletter-heading"
          className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Zůstaňte v obraze
        </h2>

        <p className="text-white/65 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Novinky ze světa českých farem přímo do vaší schránky.
        </p>

        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" aria-label="Co dostanete">
          {BENEFITS.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 border border-white/20 text-white/80 text-xs font-medium"
            >
              <CheckCircle className="w-3 h-3 text-primary-300" aria-hidden="true" />
              {b}
            </span>
          ))}
        </div>

        {submitted ? (
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/18 border border-white/28 text-white font-semibold">
            <CheckCircle className="w-5 h-5 text-primary-300" aria-hidden="true" />
            Přihlášení proběhlo úspěšně. Těšte se na novinky!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Přihlásit se k newsletteru"
          >
            <label htmlFor="newsletter-email" className="sr-only">
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
                'flex-1 px-5 py-3.5 rounded-xl bg-white/12 border border-white/28',
                'text-white placeholder:text-white/45 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-white/35 focus:border-white/45',
                'backdrop-blur-sm transition-all duration-200',
              )}
            />
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl',
                'bg-white text-forest font-semibold text-sm',
                'hover:bg-primary-50 transition-all duration-200 cursor-pointer active:scale-95',
                'shadow-lg hover:shadow-xl flex-shrink-0',
                loading && 'opacity-70 cursor-not-allowed',
              )}
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                : <Send className="w-4 h-4" aria-hidden="true" />
              }
              Odebírat
            </button>
          </form>
        )}

        {toast && (
          <p className={cn('text-sm mt-4 font-medium', toast.type === 'error' ? 'text-red-300' : 'text-white/75')}>
            {toast.message}
          </p>
        )}

        <p className="text-white/35 text-xs mt-5">
          Odesláním souhlasíte s{' '}
          <a
            href="/soukromi"
            className="underline underline-offset-2 hover:text-white/60 transition-colors cursor-pointer"
          >
            ochranou soukromí
          </a>
          . Odhlásit se lze kdykoliv.
        </p>
      </div>
    </section>
  )
}
