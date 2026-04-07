'use client'

import Link from 'next/link'
import { Moon, Sun, Map, List, AlignJustify, LayoutGrid, Star, History, ChevronRight, Tractor } from 'lucide-react'
import { useUserPrefs } from '@/hooks/useUserPrefs'
import { CATEGORY_LABELS } from '@/lib/farms'
import { cn } from '@/lib/utils'
import type { FarmCategory, KrajCode } from '@/types/farm'
import type { DietPreference } from '@/hooks/useUserPrefs'
import { AuthSection } from './AuthSection'
import { SavedSearchesSection } from './SavedSearchesSection'

const DIET_OPTIONS: { value: DietPreference; label: string; emoji: string; hint: string }[] = [
  { value: 'vegetarian', label: 'Vegetarián', emoji: '🥦', hint: 'Bez masa' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', hint: 'Bez živočišných produktů' },
  { value: 'carnivore', label: 'Masožravec', emoji: '🥩', hint: 'Maso, živočišné produkty' },
  { value: 'pescatarian', label: 'Pescetarián', emoji: '🐟', hint: 'Ryby, bez červeného masa' },
  { value: 'paleo', label: 'Paleo', emoji: '🦴', hint: 'Maso, zelenina, bez obilovin' },
  { value: 'keto', label: 'Keto', emoji: '🧈', hint: 'Nízkosacharidová strava' },
  { value: 'gluten-free', label: 'Bezlepkový', emoji: '🌾', hint: 'Celiakie nebo intolerance' },
  { value: 'lactose-free', label: 'Bezlaktózový', emoji: '🥛', hint: 'Intolerance laktózy' },
  { value: 'organic', label: 'Bio/Eko', emoji: '♻️', hint: 'Preferuji certifikované bio' },
  { value: 'local', label: 'Lokální', emoji: '📍', hint: 'Jen z mého kraje' },
]

const UNIQUE_CATEGORIES: FarmCategory[] = [
  'zelenina', 'ovoce', 'maso', 'mléko', 'vejce', 'med', 'byliny', 'sýry', 'víno', 'ryby', 'chléb', 'ostatní',
]

const KRAJ_OPTIONS: KrajCode[] = [
  'Praha', 'Středočeský', 'Jihočeský', 'Plzeňský', 'Karlovarský',
  'Ústecký', 'Liberecký', 'Královéhradecký', 'Pardubický',
  'Vysočina', 'Jihomoravský', 'Olomoucký', 'Moravskoslezský', 'Zlínský',
]

export function ProfilClient() {
  const { prefs, update, reset } = useUserPrefs()

  const toggleDiet = (d: DietPreference) => {
    const next = prefs.diet.includes(d)
      ? prefs.diet.filter((x) => x !== d)
      : [...prefs.diet, d]
    update({ diet: next })
  }

  const toggleCategory = (cat: FarmCategory) => {
    const next = prefs.categories.includes(cat)
      ? prefs.categories.filter((c) => c !== cat)
      : [...prefs.categories, cat]
    update({ categories: next })
  }

  return (
    <div className="space-y-6">

      {/* Account (auth) */}
      <AuthSection />

      {/* Saved searches */}
      <SavedSearchesSection />

      {/* Quick links */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-50">
          <h2 className="font-heading font-semibold text-forest text-base">Moje data</h2>
        </div>
        <div className="divide-y divide-gray-50">
          <Link
            href="/profil/farma"
            className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <Tractor className="w-4 h-4 text-primary-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Moje farma</p>
                <p className="text-xs text-neutral-400">Spravujte informace o vaší farmě</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" aria-hidden="true" />
          </Link>
          <Link
            href="/profil/recenze"
            className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-earth-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-earth-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Moje recenze</p>
                <p className="text-xs text-neutral-400">Recenze, které jste napsali</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" aria-hidden="true" />
          </Link>
          <Link
            href="/profil/historie"
            className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <History className="w-4 h-4 text-primary-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Historie návštěv</p>
                <p className="text-xs text-neutral-400">Naposledy zobrazené farmy</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" aria-hidden="true" />
          </Link>
          <Link
            href="/oblibene"
            className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Oblíbené farmy</p>
                <p className="text-xs text-neutral-400">Uložené farmy pro rychlý přístup</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Diet preferences */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-4">
        <div>
          <h2 className="font-heading font-semibold text-forest text-base">Stravovací preference</h2>
          <p className="text-xs text-neutral-400 mt-1">Ovlivní doporučení a filtry na mapě</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DIET_OPTIONS.map((opt) => {
            const active = prefs.diet.includes(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => toggleDiet(opt.value)}
                className={cn(
                  'flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all cursor-pointer',
                  active
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300',
                )}
              >
                <span className="text-lg leading-none mt-0.5" aria-hidden="true">{opt.emoji}</span>
                <div>
                  <p className={cn('text-xs font-semibold leading-tight', active ? 'text-primary-700' : 'text-forest')}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{opt.hint}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-5">
        <h2 className="font-heading font-semibold text-forest text-base">Vzhled</h2>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {prefs.darkMode
              ? <Moon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              : <Sun className="w-4 h-4 text-earth-500" aria-hidden="true" />
            }
            <div>
              <p className="text-sm font-medium text-forest">Tmavý režim</p>
              <p className="text-xs text-neutral-400">Tmavé pozadí šetří oči v noci</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={prefs.darkMode}
            aria-label="Přepnout tmavý režim"
            onClick={() => update({ darkMode: !prefs.darkMode })}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 cursor-pointer',
              prefs.darkMode ? 'bg-primary-600' : 'bg-neutral-200',
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                prefs.darkMode ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </button>
        </div>

        {/* Default view */}
        <div>
          <p className="text-sm font-medium text-forest mb-2">Výchozí zobrazení na mapě</p>
          <div className="flex gap-2">
            <button
              onClick={() => update({ defaultView: 'map' })}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer',
                prefs.defaultView === 'map'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300',
              )}
            >
              <Map className="w-4 h-4" aria-hidden="true" />
              Mapa
            </button>
            <button
              onClick={() => update({ defaultView: 'list' })}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer',
                prefs.defaultView === 'list'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300',
              )}
            >
              <List className="w-4 h-4" aria-hidden="true" />
              Seznam
            </button>
          </div>
        </div>

        {/* Card size */}
        <div>
          <p className="text-sm font-medium text-forest mb-2">Velikost karet farem</p>
          <div className="flex gap-2">
            <button
              onClick={() => update({ cardSize: 'full' })}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer',
                prefs.cardSize === 'full'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300',
              )}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              Normální
            </button>
            <button
              onClick={() => update({ cardSize: 'compact' })}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer',
                prefs.cardSize === 'compact'
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300',
              )}
            >
              <AlignJustify className="w-4 h-4" aria-hidden="true" />
              Kompaktní
            </button>
          </div>
        </div>
      </section>

      {/* Map preferences */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-5">
        <h2 className="font-heading font-semibold text-forest text-base">Preference na mapě</h2>

        {/* Preferred kraj */}
        <div>
          <label htmlFor="pref-kraj" className="text-sm font-medium text-forest block mb-2">
            Váš kraj
          </label>
          <select
            id="pref-kraj"
            value={prefs.kraj ?? ''}
            onChange={(e) => update({ kraj: (e.target.value as KrajCode) || null })}
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-sm bg-white text-forest focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
          >
            <option value="">Celá ČR</option>
            {KRAJ_OPTIONS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <p className="text-xs text-neutral-400 mt-1">Mapa se automaticky zaměří na váš kraj</p>
        </div>

        {/* Search radius */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="pref-radius" className="text-sm font-medium text-forest">
              Preferovaný dosah hledání
            </label>
            <span className="text-sm font-semibold text-primary-600">{prefs.searchRadius} km</span>
          </div>
          <input
            id="pref-radius"
            type="range"
            min={5}
            max={100}
            step={5}
            value={prefs.searchRadius}
            onChange={(e) => update({ searchRadius: Number(e.target.value) })}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-neutral-400 mt-0.5">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Preferred categories */}
        <div>
          <p className="text-sm font-medium text-forest mb-2">Oblíbené kategorie</p>
          <p className="text-xs text-neutral-400 mb-3">Tyto kategorie budou předvybrány při otevření mapy</p>
          <div className="flex flex-wrap gap-2">
            {UNIQUE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                  prefs.categories.includes(cat)
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700',
                )}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reset */}
      <div className="flex justify-end pb-4">
        <button
          onClick={reset}
          className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer underline underline-offset-2"
        >
          Obnovit výchozí nastavení
        </button>
      </div>
    </div>
  )
}
