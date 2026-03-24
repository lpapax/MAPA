'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: wire to API
    setSubmitted(true)
  }

  return (
    <section
      className="py-20 bg-newsletter relative overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3"
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/80 text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
          Newsleter zdarma
        </span>

        <h2
          id="newsletter-heading"
          className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Zůstaňte v obraze
        </h2>

        <p className="text-white/70 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Nové farmy, sezónní tipy a recepty přímo do vaší schránky. Jednou za měsíc, bez spamu.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-white/20 border border-white/30 text-white font-medium">
            <CheckCircle className="w-5 h-5 text-primary-300" aria-hidden="true" />
            Výborně! Brzy vám napíšeme.
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
                'flex-1 px-5 py-3.5 rounded-xl bg-white/15 border border-white/30',
                'text-white placeholder:text-white/50 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50',
                'backdrop-blur-sm transition-all duration-200',
              )}
            />
            <button
              type="submit"
              className={cn(
                'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl',
                'bg-white text-forest font-semibold text-sm',
                'hover:bg-primary-50 transition-colors duration-200 cursor-pointer',
                'shadow-lg hover:shadow-xl flex-shrink-0',
              )}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Odebírat
            </button>
          </form>
        )}

        <p className="text-white/40 text-xs mt-4">
          Odesláním souhlasíte s{' '}
          <a
            href="/soukromi"
            className="underline underline-offset-2 hover:text-white/70 transition-colors cursor-pointer"
          >
            ochranou soukromí
          </a>
          . Odhlásit se lze kdykoliv.
        </p>
      </div>
    </section>
  )
}
