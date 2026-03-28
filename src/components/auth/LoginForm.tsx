'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Leaf, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'

export function LoginForm() {
  const { user, loading, signInWithMagicLink } = useAuth()
  const { show } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/profil')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || submitting) return
    setSubmitting(true)
    const { error } = await signInWithMagicLink(email.trim())
    setSubmitting(false)
    if (error) {
      show(error, 'error')
    } else {
      setSent(true)
    }
  }

  if (loading) return null

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-card p-8 border border-neutral-100">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-heading font-bold text-xl text-forest">
            Mapa <span className="text-primary-600">Farem</span>
          </span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-primary-600" aria-hidden="true" />
            </div>
            <h2 className="font-heading font-bold text-forest text-xl mb-2">Zkontrolujte e-mail</h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              Poslali jsme magický odkaz na{' '}
              <strong className="text-forest">{email}</strong>.
              Odkaz platí 1 hodinu.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
            >
              Zadat jiný e-mail
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-heading font-bold text-forest text-2xl mb-2 text-center">Přihlásit se</h1>
            <p className="text-neutral-500 text-sm text-center mb-8">
              Zadejte e-mail a zašleme vám přihlašovací odkaz. Žádné heslo není třeba.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-forest mb-1.5">
                  E-mailová adresa
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="vas@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                {submitting ? 'Odesílám…' : 'Poslat magický odkaz'}
                {!submitting && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
              </button>
            </form>

            <div className="mt-6 space-y-2">
              {['Synchronizujte oblíbené farmy', 'Ukládejte recenze trvale', 'Pracujte ze všech zařízení'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-xs text-neutral-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
