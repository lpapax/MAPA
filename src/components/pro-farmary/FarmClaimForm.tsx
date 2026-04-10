'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, UserCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getSupabaseRaw } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

export function FarmClaimForm() {
  const { user } = useAuth()
  const { show } = useToast()
  const [farmSlug, setFarmSlug] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <UserCircle2 className="w-7 h-7 text-primary-600" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Přihlašte se</h2>
        <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
          Ke správě farmy musíte být přihlášeni. Přihlášení trvá jen chvíli — žádné heslo není třeba.
        </p>
        <Link
          href="/prihlasit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          Přihlásit se
        </Link>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-primary-600" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Žádost odeslána</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Vaši žádost o správu farmy jsme přijali. Ozveme se vám na e-mail{' '}
          <strong>{user.email}</strong> do 48 hodin.
        </p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!farmSlug.trim() || submitting) return
    setSubmitting(true)

    const supabase = getSupabaseRaw()
    if (!supabase) {
      show('Supabase není dostupný.', 'error')
      setSubmitting(false)
      return
    }

    const slug = farmSlug.trim().toLowerCase().replace(/\s+/g, '-')
    const { error } = await supabase.from('farm_claims').insert({
      user_id: user.id,
      farm_slug: slug,
      message: message.trim(),
    })

    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        show('Žádost o tuto farmu již existuje.', 'error')
      } else {
        show(error.message, 'error')
      }
    } else {
      setSent(true)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 max-w-md mx-auto">
      <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-earth-50 border border-earth-100">
        <AlertCircle className="w-4 h-4 text-earth-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-earth-700 leading-relaxed">
          Nárokování farmy slouží k ověření jejího provozovatele. Po schválení budete moci spravovat informace o farmě.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="farm-slug" className="block text-sm font-medium text-forest mb-1.5">
            Slug farmy (z URL adresy) <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id="farm-slug"
            type="text"
            required
            placeholder="napr. farma-u-lesa"
            value={farmSlug}
            onChange={(e) => setFarmSlug(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-[border-color,box-shadow]"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Najdete jej v URL: mapafarem.cz/farmy/<strong>zde-je-slug</strong>
          </p>
        </div>

        <div>
          <label htmlFor="claim-message" className="block text-sm font-medium text-forest mb-1.5">
            Doplňující informace
          </label>
          <textarea
            id="claim-message"
            rows={4}
            placeholder="Jsem provozovatel farmy Jana Nováková, IČO 12345678…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition-[border-color,box-shadow]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !farmSlug.trim()}
          className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          {submitting ? 'Odesílám…' : 'Odeslat žádost o správu'}
        </button>
      </form>
    </div>
  )
}
