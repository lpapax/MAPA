'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FarmCategory } from '@/types/farm'

const CATEGORIES: { value: FarmCategory; label: string }[] = [
  { value: 'zelenina', label: 'Zelenina' },
  { value: 'ovoce', label: 'Ovoce' },
  { value: 'maso', label: 'Maso' },
  { value: 'mléko', label: 'Mléko a mléčné výrobky' },
  { value: 'vejce', label: 'Vejce' },
  { value: 'med', label: 'Med' },
  { value: 'chléb', label: 'Pečivo a chléb' },
  { value: 'sýry', label: 'Sýry' },
  { value: 'víno', label: 'Víno' },
  { value: 'byliny', label: 'Bylinky' },
  { value: 'ryby', label: 'Ryby' },
  { value: 'ostatní', label: 'Ostatní' },
]

const KRAJE = [
  'Hlavní město Praha',
  'Středočeský kraj',
  'Jihočeský kraj',
  'Plzeňský kraj',
  'Karlovarský kraj',
  'Ústecký kraj',
  'Liberecký kraj',
  'Královéhradecký kraj',
  'Pardubický kraj',
  'Kraj Vysočina',
  'Jihomoravský kraj',
  'Olomoucký kraj',
  'Zlínský kraj',
  'Moravskoslezský kraj',
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

interface FormData {
  name: string
  description: string
  categories: FarmCategory[]
  address: string
  city: string
  kraj: string
  zip: string
  phone: string
  email: string
  web: string
  instagram: string
  facebook: string
  hours: Record<string, { open: boolean; from: string; to: string }>
}

const INITIAL_HOURS = Object.fromEntries(
  DAYS.map((d) => [d.key, { open: d.key !== 'ne', from: '08:00', to: '17:00' }]),
)

const INITIAL_DATA: FormData = {
  name: '',
  description: '',
  categories: [],
  address: '',
  city: '',
  kraj: '',
  zip: '',
  phone: '',
  email: '',
  web: '',
  instagram: '',
  facebook: '',
  hours: INITIAL_HOURS,
}

const STEPS = [
  { id: 1, label: 'Základní info' },
  { id: 2, label: 'Adresa' },
  { id: 3, label: 'Kontakt' },
  { id: 4, label: 'Otevírací doba' },
  { id: 5, label: 'Náhled' },
]

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

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-white'

export function AddFarmForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(INITIAL_DATA)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: keyof FormData, value: unknown) =>
    setData((prev) => ({ ...prev, [field]: value }))

  const toggleCategory = (cat: FarmCategory) =>
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))

  const updateHour = (day: string, field: 'open' | 'from' | 'to', value: boolean | string) =>
    setData((prev) => ({
      ...prev,
      hours: { ...prev.hours, [day]: { ...prev.hours[day], [field]: value } },
    }))

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (step === 1) {
      if (!data.name.trim()) errs.name = 'Vyplňte název farmy'
      if (!data.description.trim()) errs.description = 'Vyplňte popis farmy'
      if (data.categories.length === 0) errs.categories = 'Vyberte alespoň jednu kategorii'
    }
    if (step === 2) {
      if (!data.address.trim()) errs.address = 'Vyplňte adresu'
      if (!data.city.trim()) errs.city = 'Vyplňte město'
      if (!data.kraj) errs.kraj = 'Vyberte kraj'
      if (!data.zip.trim()) errs.zip = 'Vyplňte PSČ'
    }
    if (step === 3) {
      if (!data.phone.trim() && !data.email.trim()) errs.phone = 'Vyplňte alespoň telefon nebo e-mail'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, 5))
  }
  const prev = () => { setErrors({}); setStep((s) => Math.max(s - 1, 1)) }

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/farms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json() as { success: boolean; error?: string }
      if (!result.success) {
        setSubmitError(result.error ?? 'Nastala chyba. Zkuste to prosím znovu.')
        setSubmitting(false)
        return
      }
    } catch {
      setSubmitError('Nastala chyba. Zkuste to prosím znovu.')
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-primary-600" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-forest mb-3">Žádost přijata!</h2>
        <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">
          Vaši farmu jsme zaevidovali. Náš tým ji během 3–5 pracovních dnů ověří a aktivuje.
          Potvrzení zašleme na <strong>{data.email || 'váš e-mail'}</strong>.
        </p>
        <button
          onClick={() => { setSubmitted(false); setStep(1); setData(INITIAL_DATA) }}
          className="mt-8 text-primary-600 text-sm hover:underline cursor-pointer"
        >
          Přidat další farmu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                  step > s.id
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : step === s.id
                      ? 'bg-white border-primary-600 text-primary-600'
                      : 'bg-white border-neutral-200 text-neutral-300',
                )}
                aria-current={step === s.id ? 'step' : undefined}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 hidden sm:block text-center',
                  step === s.id ? 'text-primary-600 font-semibold' : 'text-neutral-400',
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 sm:p-8">
        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-forest mb-1">Základní informace</h2>
            <FormField id="farm-name" label="Název farmy" required>
              <input
                id="farm-name"
                type="text"
                value={data.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ekofarma Novák"
                className={cn(inputCls, errors.name && 'border-red-300 focus:ring-red-300')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </FormField>
            <FormField id="farm-desc" label="Popis farmy" required>
              <textarea
                id="farm-desc"
                rows={4}
                value={data.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Stručně popište vaši farmu, co pěstujete a jak hospodaříte…"
                className={cn(inputCls, 'resize-none', errors.description && 'border-red-300')}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </FormField>
            <div>
              <p className="text-xs font-semibold text-forest mb-2">
                Kategorie produktů <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all',
                      data.categories.includes(cat.value)
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-200',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={data.categories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                    />
                    <span
                      className={cn(
                        'w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0',
                        data.categories.includes(cat.value) ? 'bg-primary-600 border-primary-600' : 'border-neutral-300',
                      )}
                      aria-hidden="true"
                    >
                      {data.categories.includes(cat.value) && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    {cat.label}
                  </label>
                ))}
              </div>
              {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-forest mb-1">Adresa farmy</h2>
            <FormField id="farm-address" label="Ulice a číslo popisné" required>
              <input
                id="farm-address"
                type="text"
                value={data.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Farmářská 12"
                className={cn(inputCls, errors.address && 'border-red-300')}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField id="farm-city" label="Město / obec" required>
                <input
                  id="farm-city"
                  type="text"
                  value={data.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="České Budějovice"
                  className={cn(inputCls, errors.city && 'border-red-300')}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </FormField>
              <FormField id="farm-zip" label="PSČ" required>
                <input
                  id="farm-zip"
                  type="text"
                  value={data.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  placeholder="370 01"
                  maxLength={6}
                  className={cn(inputCls, errors.zip && 'border-red-300')}
                />
                {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
              </FormField>
            </div>
            <FormField id="farm-kraj" label="Kraj" required>
              <select
                id="farm-kraj"
                value={data.kraj}
                onChange={(e) => update('kraj', e.target.value)}
                className={cn(inputCls, errors.kraj && 'border-red-300')}
              >
                <option value="">— Vyberte kraj —</option>
                {KRAJE.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {errors.kraj && <p className="text-red-500 text-xs mt-1">{errors.kraj}</p>}
            </FormField>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-forest mb-1">Kontaktní údaje</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField id="farm-phone" label="Telefon">
                <input
                  id="farm-phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+420 123 456 789"
                  className={cn(inputCls, errors.phone && 'border-red-300')}
                />
              </FormField>
              <FormField id="farm-email" label="E-mail">
                <input
                  id="farm-email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="info@mojefarma.cz"
                  className={inputCls}
                />
              </FormField>
            </div>
            {errors.phone && <p className="text-red-500 text-xs -mt-3">{errors.phone}</p>}
            <FormField id="farm-web" label="Webové stránky">
              <input
                id="farm-web"
                type="url"
                value={data.web}
                onChange={(e) => update('web', e.target.value)}
                placeholder="https://mojefarma.cz"
                className={inputCls}
              />
            </FormField>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField id="farm-ig" label="Instagram (uživatelské jméno)">
                <input
                  id="farm-ig"
                  type="text"
                  value={data.instagram}
                  onChange={(e) => update('instagram', e.target.value)}
                  placeholder="@mojefarma"
                  className={inputCls}
                />
              </FormField>
              <FormField id="farm-fb" label="Facebook (uživatelské jméno)">
                <input
                  id="farm-fb"
                  type="text"
                  value={data.facebook}
                  onChange={(e) => update('facebook', e.target.value)}
                  placeholder="mojefarma"
                  className={inputCls}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Step 4: Opening hours */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-lg font-bold text-forest mb-5">Otevírací doba</h2>
            <div className="space-y-3">
              {DAYS.map((day) => {
                const h = data.hours[day.key]
                return (
                  <div key={day.key} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                    <label className="flex items-center gap-2 w-28 flex-shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={h.open}
                        onChange={(e) => updateHour(day.key, 'open', e.target.checked)}
                        className="w-4 h-4 rounded accent-primary-600"
                      />
                      <span className={cn('text-sm font-medium', h.open ? 'text-forest' : 'text-neutral-300')}>
                        {day.label}
                      </span>
                    </label>
                    {h.open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={h.from}
                          onChange={(e) => updateHour(day.key, 'from', e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          aria-label={`${day.label} otevření`}
                        />
                        <span className="text-neutral-400 text-sm">–</span>
                        <input
                          type="time"
                          value={h.to}
                          onChange={(e) => updateHour(day.key, 'to', e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                          aria-label={`${day.label} zavření`}
                        />
                      </div>
                    ) : (
                      <span className="text-neutral-300 text-sm italic">Zavřeno</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {step === 5 && (
          <div>
            <h2 className="font-heading text-lg font-bold text-forest mb-5">Náhled a potvrzení</h2>
            <div className="space-y-4 text-sm">
              <Section title="Základní informace">
                <Row label="Název" value={data.name} />
                <Row label="Popis" value={data.description} />
                <Row label="Kategorie" value={data.categories.join(', ') || '—'} />
              </Section>
              <Section title="Adresa">
                <Row label="Ulice" value={data.address} />
                <Row label="Město" value={data.city} />
                <Row label="Kraj" value={data.kraj} />
                <Row label="PSČ" value={data.zip} />
              </Section>
              <Section title="Kontakt">
                {data.phone && <Row label="Telefon" value={data.phone} />}
                {data.email && <Row label="E-mail" value={data.email} />}
                {data.web && <Row label="Web" value={data.web} />}
                {data.instagram && <Row label="Instagram" value={data.instagram} />}
                {data.facebook && <Row label="Facebook" value={data.facebook} />}
              </Section>
              <Section title="Otevírací doba">
                {DAYS.map((d) => {
                  const h = data.hours[d.key]
                  return (
                    <Row
                      key={d.key}
                      label={d.label}
                      value={h.open ? `${h.from} – ${h.to}` : 'Zavřeno'}
                    />
                  )
                })}
              </Section>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Po odeslání bude žádost zkontrolována naším týmem. Aktivace trvá 3–5 pracovních dnů.
            </div>
          </div>
        )}

        {/* Navigation */}
        {submitError && (
          <p className="mt-4 text-sm text-red-600 text-center">{submitError}</p>
        )}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
          {step > 1 ? (
            <button
              onClick={prev}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Zpět
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              Pokračovat
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              {submitting ? 'Odesílám…' : 'Odeslat žádost'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden">
      <div className="bg-neutral-50 px-4 py-2 text-xs font-semibold text-forest uppercase tracking-wider">
        {title}
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 px-4 py-2.5">
      <span className="text-neutral-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-forest font-medium flex-1 break-all">{value || '—'}</span>
    </div>
  )
}
