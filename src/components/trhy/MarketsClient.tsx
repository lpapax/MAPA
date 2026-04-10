'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapPin, Calendar, Users, Navigation, Share2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { haversineKm, formatDistance } from '@/lib/geo'

interface Market {
  id: number
  name: string
  city: string
  region: string
  lat: number
  lng: number
  schedule: string
  time: string
  vendors: number
  tags: string[]
  photo: string
  is_daily: boolean
  dow: number | null
  nextDate: Date
}

interface MarketRow {
  id: number
  name: string
  city: string
  region: string
  lat: number
  lng: number
  schedule: string
  time: string
  vendors: number
  tags: string[]
  photo: string
  is_daily: boolean
  dow: number | null
}

function getNextWeekday(dow: number): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const diff = (dow - d.getDay() + 7) % 7
  d.setDate(d.getDate() + diff)
  return d
}

function rowToMarket(row: MarketRow): Market {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return {
    ...row,
    nextDate: row.is_daily
      ? new Date(today)
      : row.dow !== null
        ? getNextWeekday(row.dow)
        : new Date(today),
  }
}

const ALL_REGIONS = [
  'Všechny kraje',
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

const TIME_FILTERS = [
  { id: 'all',     label: 'Vše' },
  { id: 'weekend', label: 'Tento víkend' },
  { id: 'week',    label: 'Tento týden' },
  { id: 'month',   label: 'Tento měsíc' },
]

function getCountdown(nextDate: Date, isDaily?: boolean): { text: string; color: string } {
  if (isDaily) return { text: 'Otevřeno denně', color: '#059669' }
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const nextDay = new Date(nextDate); nextDay.setHours(0, 0, 0, 0)
  const diffDays = Math.round((nextDay.getTime() - today.getTime()) / 86400000)
  if (diffDays < 0)   return { text: 'Skončil',    color: '#9CA3AF' }
  if (diffDays === 0) return { text: 'Dnes',       color: '#059669' }
  if (diffDays === 1) return { text: 'Zítra',      color: '#C8963E' }
  return { text: `Za ${diffDays} dní`, color: '#4a8c3f' }
}

function parseTimeForICS(timeStr: string): [string, string] {
  const parts = timeStr.split('–')
  if (parts.length < 2) return ['080000', '140000']
  const fmt = (t: string) => {
    const [h, m] = t.trim().split(':')
    return `${(h ?? '08').padStart(2, '0')}${(m ?? '00').padStart(2, '0')}00`
  }
  return [fmt(parts[0]), fmt(parts[1])]
}

function generateICS(market: Market) {
  const d = market.nextDate
  const pad = (n: number) => String(n).padStart(2, '0')
  const dt = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const [tStart, tEnd] = parseTimeForICS(market.time)
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MapaFarem.cz//CS',
    'BEGIN:VEVENT',
    `DTSTART:${dt}T${tStart}`,
    `DTEND:${dt}T${tEnd}`,
    `SUMMARY:${market.name}`,
    `DESCRIPTION:${market.schedule} · ${market.vendors} prodejců · mapafarem.cz`,
    `LOCATION:${market.city}\\, Česká republika`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${market.name.replace(/[^a-zA-Z0-9\-_ ]/g, '')}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function czechPlural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one
  if (n >= 2 && n <= 4) return few
  return many
}

const TAG_STYLES: Record<string, string> = {
  BIO:        'bg-primary-50 text-primary-700 border border-primary-200',
  Farmářský:  'bg-earth-50 text-earth-700 border border-earth-200',
  Řemeslný:   'bg-orange-50 text-orange-700 border border-orange-200',
  Tradiční:   'bg-sky-50 text-sky-700 border border-sky-200',
}

function photoUrl(photo: string): string {
  if (photo.startsWith('http')) return photo
  return `https://images.unsplash.com/photo-${photo}?w=160&h=160&fit=crop&q=80`
}

export function MarketsClient() {
  const [markets, setMarkets]             = useState<Market[]>([])
  const [loading, setLoading]             = useState(true)
  const [timeFilter, setTimeFilter]       = useState('all')
  const [regionFilter, setRegionFilter]   = useState('Všechny kraje')
  const [copiedId, setCopiedId]           = useState<number | null>(null)
  const [sortByDistance, setSortByDistance] = useState(false)
  const [userPos, setUserPos]             = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading]       = useState(false)
  const [geoError, setGeoError]           = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/markets')
      .then((r) => r.json())
      .then((rows: MarketRow[]) => setMarkets(rows.map(rowToMarket)))
      .catch(() => setMarkets([]))
      .finally(() => setLoading(false))
  }, [])

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])

  const handleNearMe = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Geolokace není podporována vaším prohlížečem.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSortByDistance(true)
        setGeoLoading(false)
      },
      () => {
        setGeoError('Polohu nelze zjistit. Zkontrolujte oprávnění.')
        setGeoLoading(false)
      },
      { timeout: 8000 },
    )
  }, [])

  const filtered = useMemo(() => {
    let list = markets

    if (regionFilter !== 'Všechny kraje') {
      list = list.filter((m) => m.region === regionFilter)
    }

    if (timeFilter === 'weekend') {
      const satStr = getNextWeekday(6).toDateString()
      const sunStr = getNextWeekday(0).toDateString()
      list = list.filter((m) => {
        if (m.is_daily) return true
        const s = m.nextDate.toDateString()
        return s === satStr || s === sunStr
      })
    } else if (timeFilter === 'week') {
      const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7)
      list = list.filter((m) => m.is_daily || (m.nextDate >= today && m.nextDate <= weekEnd))
    } else if (timeFilter === 'month') {
      const monthEnd = new Date(today); monthEnd.setDate(today.getDate() + 30)
      list = list.filter((m) => m.is_daily || (m.nextDate >= today && m.nextDate <= monthEnd))
    }

    if (sortByDistance && userPos) {
      list = [...list].sort((a, b) =>
        haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) -
        haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
      )
    }

    return list
  }, [markets, timeFilter, regionFilter, today, sortByDistance, userPos])

  function handleShare(market: Market) {
    const text = `${market.name} — ${market.schedule}, ${market.time}, ${market.city}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: market.name, text, url: 'https://mapafarem.cz/trhy' }).catch(() => null)
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(market.id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  const totalVendors = markets.reduce((s, m) => s + m.vendors, 0)

  return (
    <div>
      {/* Hero */}
      <AnimatedSection className="bg-gradient-to-br from-forest via-primary-800 to-teal-700 py-14 mb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
            Farmářské trhy
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3">
            Trhy v celé republice
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Najděte farmářský trh ve svém kraji a nakupte čerstvě přímo od pěstitelů.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { label: 'Trhů',    value: markets.length },
              { label: 'Krajů',   value: new Set(markets.map((m) => m.region)).size },
              { label: 'Prodejců', value: `${totalVendors}+` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-white">{s.value}</div>
                <div className="text-white/60 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Filter bar */}
      <div className="bg-white border-b border-neutral-100 shadow-sm sticky top-[72px] z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium border transition-[border-color,background-color,color] duration-150 cursor-pointer active:scale-[0.97]',
                  timeFilter === f.id
                    ? 'bg-earth-500 border-earth-500 text-white shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-earth-300 hover:text-earth-700',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label="Filtrovat podle kraje"
          >
            {ALL_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={handleNearMe}
            disabled={geoLoading}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer disabled:opacity-60',
              sortByDistance && userPos
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-primary-300 text-primary-700 bg-white hover:bg-primary-50',
            )}
            aria-label="Seřadit trhy podle vzdálenosti od mé polohy"
          >
            {geoLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              : <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            }
            {sortByDistance && userPos ? 'Řazeno dle vzdálenosti' : 'Kolem mě'}
          </button>

          <span className="text-xs text-neutral-400 font-medium ml-auto">
            {loading ? '…' : `${filtered.length} ${czechPlural(filtered.length, 'trh', 'trhy', 'trhů')}`}
          </span>
        </div>
        {geoError && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 text-xs text-red-500">
            {geoError}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="font-semibold text-neutral-600">Žádné trhy neodpovídají filtru</p>
            <p className="text-sm mt-1">Zkuste jiný kraj nebo časové období</p>
            <button
              onClick={() => { setTimeFilter('all'); setRegionFilter('Všechny kraje') }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold cursor-pointer hover:bg-primary-700 transition-colors"
            >
              Zobrazit všechny trhy
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((market) => {
              const countdown = getCountdown(market.nextDate, market.is_daily)
              const distKm = userPos ? haversineKm(userPos.lat, userPos.lng, market.lat, market.lng) : null
              return (
                <article
                  key={market.id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden flex hover:shadow-card-hover transition-shadow"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl(market.photo)}
                    alt={`${market.name} — farmářský trh`}
                    width={120}
                    height={120}
                    className="w-[120px] sm:w-[140px] object-cover flex-shrink-0 self-stretch min-h-[140px]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    loading="lazy"
                  />

                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h2 className="font-heading font-bold text-forest text-base leading-tight flex-1 min-w-0">
                        {market.name}
                      </h2>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: countdown.color }}>
                        {countdown.text}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {market.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TAG_STYLES[tag] ?? 'bg-neutral-100 text-neutral-600 border border-neutral-200')}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                      <span>{market.city} · {market.region}</span>
                      {distKm !== null && (
                        <span className="ml-1 text-primary-600 font-medium">· {formatDistance(distKm)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-700 mb-1">
                      <Calendar className="w-3 h-3 text-primary-500 flex-shrink-0" aria-hidden="true" />
                      {market.schedule} · {market.time}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-700 mb-3">
                      <Users className="w-3 h-3 text-earth-500 flex-shrink-0" aria-hidden="true" />
                      cca {market.vendors} prodejců
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => generateICS(market)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-300 text-primary-700 text-xs font-semibold bg-white hover:bg-primary-50 transition-colors cursor-pointer min-h-[44px]"
                        aria-label={`Přidat ${market.name} do kalendáře`}
                      >
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        Přidat do kalendáře
                      </button>
                      <button
                        onClick={() => handleShare(market)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 text-xs font-semibold bg-white hover:bg-neutral-50 transition-colors cursor-pointer min-h-[44px]"
                        aria-label={`Sdílet trh ${market.name}`}
                      >
                        <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                        {copiedId === market.id ? 'Zkopírováno!' : 'Sdílet'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="text-center text-xs text-neutral-300 mt-10">
          Informace o trzích jsou orientační. Doporučujeme ověřit aktuální termíny u pořadatelů.
        </p>
      </div>
    </div>
  )
}
