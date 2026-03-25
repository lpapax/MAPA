'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const SUBJECTS = [
  'Obecný dotaz',
  'Technický problém',
  'Registrace farmy',
  'Reklamace nebo stížnost',
  'Partnerství a spolupráce',
  'Tiskový dotaz',
  'Jiné',
]

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const newErrors: Partial<FormData> = {}
    if (!form.name.trim()) newErrors.name = 'Vyplňte jméno'
    if (!form.email.trim()) newErrors.email = 'Vyplňte e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Neplatný e-mail'
    if (!form.subject) newErrors.subject = 'Vyberte předmět'
    if (!form.message.trim()) newErrors.message = 'Napište zprávu'
    else if (form.message.trim().length < 20) newErrors.message = 'Zpráva je příliš krátká (min. 20 znaků)'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // localStorage mock — upgrade to API when ready
    await new Promise((r) => setTimeout(r, 600))
    try {
      const existing = JSON.parse(localStorage.getItem('mf_contact_messages') ?? '[]') as unknown[]
      localStorage.setItem(
        'mf_contact_messages',
        JSON.stringify([...existing, { ...form, sentAt: new Date().toISOString() }]),
      )
    } catch {
      // ignore storage errors
    }
    setLoading(false)
    setSubmitted(true)
  }

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-primary-600" aria-hidden="true" />
        </div>
        <h3 className="font-heading font-bold text-forest text-xl mb-2">Zpráva odeslána!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Děkujeme za vaši zprávu. Odpovíme na váš e-mail do 24 hodin v pracovní dny.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="mt-6 text-sm text-primary-600 hover:underline cursor-pointer"
        >
          Odeslat další zprávu
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold text-forest mb-1.5 uppercase tracking-wide">
          Jméno <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Jana Nováková"
          autoComplete="name"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-400'
          }`}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && <p id="contact-name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-xs font-semibold text-forest mb-1.5 uppercase tracking-wide">
          E-mail <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="jana@example.cz"
          autoComplete="email"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-400'
          }`}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && <p id="contact-email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-forest mb-1.5 uppercase tracking-wide">
          Předmět <span className="text-red-400">*</span>
        </label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white cursor-pointer ${
            errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-400'
          }`}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        >
          <option value="">Vyberte předmět…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <p id="contact-subject-error" className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-forest mb-1.5 uppercase tracking-wide">
          Zpráva <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Napište nám, jak vám můžeme pomoci…"
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none ${
            errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-primary-400'
          }`}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && <p id="contact-message-error" className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        {loading ? 'Odesílám…' : 'Odeslat zprávu'}
      </button>
    </form>
  )
}
