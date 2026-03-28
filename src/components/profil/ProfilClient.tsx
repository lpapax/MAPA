'use client'

import Link from 'next/link'
import { Moon, Sun, Map, List, AlignJustify, LayoutGrid, Star, Clock, History, ChevronRight } from 'lucide-react'
import { useUserPrefs } from '@/hooks/useUserPrefs'
import { CATEGORY_LABELS } from '@/lib/farms'
import { cn } from '@/lib/utils'
import type { FarmCategory, KrajCode } from '@/types/farm'

const UNIQUE_CATEGORIES: FarmCategory[] = [
  'zelenina', 'ovoce', 'maso', 'mléko', 'vejce', 'med', 'byliny', 'sýry', 'víno', 'ryby', 'chléb', 'ostatní',
]

const KRAJ_OPTIONS: KrajCode[] = [
  'Praha', 'Středočeský', 'Jihočeský', 'Plzeňský', 'Karlovarský',
  'Ústecký', 'Liberecký', 'Královéhradecký', 'Pardubický',
  'Vysočina', 'Jihomoravský', 'Olomoucký', 'Moravskoslezský', 'Zlínský',
]

const BEDYNKA_OPTIONS = [
  { value: null, label: 'Bez připomínek' },
  { value: 'weekly', label: 'Každý týden' },
  { value: 'biweekly', label: 'Každé 2 týdny' },
  { value: 'monthly', label: 'Každý měsíc' },
] as const

export function ProfilClient() {
  const { prefs, update, reset } = useUserPrefs()

  const toggleCategory = (cat: FarmCategory) => {
    const next = prefs.categories.includes(cat)
      ? prefs.categories.filter((c) => c !== cat)
      : [...prefs.categories, cat]
    update({ categories: next })
  }

  return (
    <div className="space-y-6">

      {/* Quick links */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-heading font-semibold text-forest text-base">Moje data</h2>
        </div>
        <div className="divide-y divide-gray-50">
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
                <p className="text-xs text-gray-400">Recenze, které jste napsali</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" aria-hidden="true" />
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
                <p className="text-xs text-gray-400">Naposledy zobrazené farmy</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" aria-hidden="true" />
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
                <p className="text-xs text-gray-400">Uložené farmy pro rychlý přístup</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-5">
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
              <p className="text-xs text-gray-400">Tmavé pozadí šetří oči v noci</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={prefs.darkMode}
            aria-label="Přepnout tmavý režim"
            onClick={() => update({ darkMode: !prefs.darkMode })}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 cursor-pointer',
              prefs.darkMode ? 'bg-primary-600' : 'bg-gray-200',
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
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
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
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
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
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
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
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300',
              )}
            >
              <AlignJustify className="w-4 h-4" aria-hidden="true" />
              Kompaktní
            </button>
          </div>
        </div>
      </section>

      {/* Map preferences */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-5">
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
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white text-forest focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
          >
            <option value="">Celá ČR</option>
            {KRAJ_OPTIONS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Mapa se automaticky zaměří na váš kraj</p>
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
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>5 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Preferred categories */}
        <div>
          <p className="text-sm font-medium text-forest mb-2">Oblíbené kategorie</p>
          <p className="text-xs text-gray-400 mb-3">Tyto kategorie budou předvybrány při otevření mapy</p>
          <div className="flex flex-wrap gap-2">
            {UNIQUE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                  prefs.categories.includes(cat)
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700',
                )}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bedynka frequency */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
        <h2 className="font-heading font-semibold text-forest text-base mb-4">Bedýnka</h2>
        <p className="text-sm font-medium text-forest mb-2">Frekvence připomínek</p>
        <p className="text-xs text-gray-400 mb-3">Jak často vám připomínat, abyste si vyřídili bedýnku</p>
        <div className="flex flex-wrap gap-2">
          {BEDYNKA_OPTIONS.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => update({ bedynkaFrequency: opt.value })}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                prefs.bedynkaFrequency === opt.value
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {prefs.bedynkaFrequency && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-primary-50 border border-primary-100">
            <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-primary-700">
              Připomínky jsou zatím pouze vizuální — notifikace přijdou v příští verzi.
            </p>
          </div>
        )}
      </section>

      {/* Reset */}
      <div className="flex justify-end pb-4">
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer underline underline-offset-2"
        >
          Obnovit výchozí nastavení
        </button>
      </div>
    </div>
  )
}
