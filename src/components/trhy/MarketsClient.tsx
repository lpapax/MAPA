'use client'

import { useState, useMemo } from 'react'
import { MapPin, Calendar, Users, Navigation, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface Market {
  id: number
  name: string
  city: string
  region: string
  schedule: string
  time: string
  vendors: number
  tags: string[]
  photo: string
  nextDate: Date
}

function getNextWeekday(dow: number): Date {
  const d = new Date()
  const diff = (dow - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d
}

interface MarketSource extends Omit<Market, 'nextDate'> { dow: number }

const MARKETS: MarketSource[] = [
  { id: 1,  name: 'Manifesto Market Anděl',        city: 'Praha',             region: 'Hlavní město Praha',    schedule: 'Každou sobotu',           time: '8:00–14:00',  vendors: 45, tags: ['BIO', 'Farmářský', 'Řemeslný'],  photo: '1488459716781-31db52582fe9', dow: 6 },
  { id: 2,  name: 'Farmářské trhy Jiřák',           city: 'Praha',             region: 'Hlavní město Praha',    schedule: 'Sobota a neděle',          time: '8:00–14:00',  vendors: 80, tags: ['Farmářský', 'BIO'],              photo: '1416879595882-3373a0480b5b', dow: 6 },
  { id: 3,  name: 'Zelný trh',                      city: 'Brno',              region: 'Jihomoravský kraj',     schedule: 'Denně (pondělí–sobota)',   time: '6:00–18:00',  vendors: 30, tags: ['Farmářský', 'Tradiční'],          photo: '1523741543316-beb7fc7023d8', dow: 1 },
  { id: 4,  name: 'Farmářský trh Olomouc',          city: 'Olomouc',           region: 'Olomoucký kraj',        schedule: 'Každou sobotu',           time: '7:00–12:00',  vendors: 25, tags: ['BIO', 'Farmářský'],              photo: '1625246333195-cbfcaabedf55', dow: 6 },
  { id: 5,  name: 'Farmářský trh Ostrava',          city: 'Ostrava',           region: 'Moravskoslezský kraj',  schedule: 'Každou sobotu',           time: '8:00–13:00',  vendors: 20, tags: ['Farmářský'],                      photo: '1464226184884-fa280b87c399', dow: 6 },
  { id: 6,  name: 'Plzeňský farmářský trh',         city: 'Plzeň',             region: 'Plzeňský kraj',         schedule: 'Každou sobotu',           time: '7:00–12:00',  vendors: 18, tags: ['BIO', 'Farmářský'],              photo: '1500595046743-cd271d694d30', dow: 6 },
  { id: 7,  name: 'Budějovický farmářský trh',      city: 'České Budějovice',  region: 'Jihočeský kraj',        schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 22, tags: ['Farmářský', 'BIO'],              photo: '1558642452-9d2a7deb7f62',   dow: 6 },
  { id: 8,  name: 'Liberecký trh',                  city: 'Liberec',           region: 'Liberecký kraj',        schedule: 'Každou sobotu',           time: '8:00–13:00',  vendors: 15, tags: ['Farmářský'],                      photo: '1444681961742-3aef9e307b37', dow: 6 },
  { id: 9,  name: 'Farmářský trh Hradec Králové',   city: 'Hradec Králové',    region: 'Královéhradecký kraj',  schedule: 'Každou sobotu',           time: '7:30–12:00',  vendors: 20, tags: ['BIO', 'Farmářský'],              photo: '1416879595882-3373a0480b5b', dow: 6 },
  { id: 10, name: 'Pardubický farmářský trh',       city: 'Pardubice',         region: 'Pardubický kraj',       schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 16, tags: ['Farmářský'],                      photo: '1488459716781-31db52582fe9', dow: 6 },
  { id: 11, name: 'Jihlava — Farmářský trh',        city: 'Jihlava',           region: 'Kraj Vysočina',         schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 14, tags: ['BIO', 'Řemeslný'],               photo: '1625246333195-cbfcaabedf55', dow: 6 },
  { id: 12, name: 'Farmářský trh Zlín',             city: 'Zlín',              region: 'Zlínský kraj',          schedule: 'Každou sobotu',           time: '8:00–13:00',  vendors: 18, tags: ['Farmářský'],                      photo: '1500595046743-cd271d694d30', dow: 6 },
  { id: 13, name: 'Karlovarský farmářský trh',      city: 'Karlovy Vary',      region: 'Karlovarský kraj',      schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 12, tags: ['BIO'],                           photo: '1523741543316-beb7fc7023d8', dow: 6 },
  { id: 14, name: 'Ústecký farmářský trh',          city: 'Ústí nad Labem',    region: 'Ústecký kraj',          schedule: 'Každou sobotu',           time: '8:00–13:00',  vendors: 15, tags: ['Farmářský'],                      photo: '1464226184884-fa280b87c399', dow: 6 },
  { id: 15, name: 'Bio trh Vinohrady',              city: 'Praha',             region: 'Hlavní město Praha',    schedule: 'Každou neděli',           time: '9:00–14:00',  vendors: 35, tags: ['BIO', 'Farmářský'],              photo: '1416879595882-3373a0480b5b', dow: 0 },
  { id: 16, name: 'Farmářský trh Brno-Líšeň',      city: 'Brno',              region: 'Jihomoravský kraj',     schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 20, tags: ['Farmářský', 'BIO'],              photo: '1558642452-9d2a7deb7f62',   dow: 6 },
  { id: 17, name: 'Havlíčkobrodský trh',            city: 'Havlíčkův Brod',   region: 'Kraj Vysočina',         schedule: 'Každou sobotu',           time: '7:00–12:00',  vendors: 12, tags: ['Farmářský'],                      photo: '1625246333195-cbfcaabedf55', dow: 6 },
  { id: 18, name: 'Opavský farmářský trh',          city: 'Opava',             region: 'Moravskoslezský kraj',  schedule: 'Každou sobotu',           time: '8:00–13:00',  vendors: 16, tags: ['BIO', 'Farmářský'],              photo: '1444681961742-3aef9e307b37', dow: 6 },
  { id: 19, name: 'Brněnský Bio trh',               city: 'Brno',              region: 'Jihomoravský kraj',     schedule: 'Každou neděli',           time: '9:00–13:00',  vendors: 28, tags: ['BIO', 'Řemeslný'],               photo: '1416879595882-3373a0480b5b', dow: 0 },
  { id: 20, name: 'Farmářský trh Kladno',           city: 'Kladno',            region: 'Středočeský kraj',      schedule: 'Každou sobotu',           time: '8:00–12:00',  vendors: 14, tags: ['Farmářský'],                      photo: '1488459716781-31db52582fe9', dow: 6 },
]

const MARKETS_WITH_DATES: Market[] = MARKETS.map((m) => ({
  ...m,
  nextDate: getNextWeekday(m.dow),
}))

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

function getCountdown(nextDate: Date): { text: string; color: string } {
  const diff = nextDate.getTime() - Date.now()
  const days = Math.floor(diff / 86400000)
  if (diff < 0)   return { text: 'Skončil',      color: '#9CA3AF' }
  if (days === 0) return { text: 'Probíhá nyní', color: '#059669' }
  if (days === 1) return { text: 'Zítra',         color: '#C8963E' }
  return { text: `Za ${days} dní`, color: '#4a8c3f' }
}

function generateICS(market: Market) {
  const d = market.nextDate
  const pad = (n: number) => String(n).padStart(2, '0')
  const dt = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MapaFarem//CS',
    'BEGIN:VEVENT',
    `DTSTART:${dt}T080000`,
    `DTEND:${dt}T140000`,
    `SUMMARY:${market.name}`,
    `DESCRIPTION:${market.schedule} · ${market.vendors} prodejců`,
    `LOCATION:${market.city}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${market.name}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const TAG_STYLES: Record<string, string> = {
  BIO:        'bg-primary-50 text-primary-700 border border-primary-200',
  Farmářský:  'bg-earth-50 text-earth-700 border border-earth-200',
  Řemeslný:   'bg-orange-50 text-orange-700 border border-orange-200',
  Tradiční:   'bg-sky-50 text-sky-700 border border-sky-200',
}

export function MarketsClient() {
  const [timeFilter, setTimeFilter]     = useState('all')
  const [regionFilter, setRegionFilter] = useState('Všechny kraje')
  const [copiedId, setCopiedId]         = useState<number | null>(null)

  const now = useMemo(() => new Date(), [])

  const filtered = useMemo(() => {
    let list = MARKETS_WITH_DATES

    if (regionFilter !== 'Všechny kraje') {
      list = list.filter((m) => m.region === regionFilter)
    }

    if (timeFilter === 'weekend') {
      const satStr = getNextWeekday(6).toDateString()
      const sunStr = getNextWeekday(0).toDateString()
      list = list.filter((m) => {
        const s = m.nextDate.toDateString()
        return s === satStr || s === sunStr
      })
    } else if (timeFilter === 'week') {
      const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)
      list = list.filter((m) => m.nextDate >= now && m.nextDate <= weekEnd)
    } else if (timeFilter === 'month') {
      const monthEnd = new Date(now); monthEnd.setDate(now.getDate() + 30)
      list = list.filter((m) => m.nextDate >= now && m.nextDate <= monthEnd)
    }

    return list
  }, [timeFilter, regionFilter, now])

  function handleShare(market: Market) {
    const text = `${market.name} — ${market.schedule} ${market.time} v ${market.city}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: market.name, text })
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(market.id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  const totalVendors = MARKETS_WITH_DATES.reduce((s, m) => s + m.vendors, 0)

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
              { label: 'Trhů', value: MARKETS_WITH_DATES.length },
              { label: 'Krajů', value: new Set(MARKETS_WITH_DATES.map((m) => m.region)).size },
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
          {/* Time filters */}
          <div className="flex gap-2 flex-wrap">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer',
                  timeFilter === f.id
                    ? 'bg-earth-500 border-earth-500 text-white shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-earth-300 hover:text-earth-700',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Region select */}
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

          {/* Near me */}
          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(() => {})
              }
            }}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-primary-300 text-primary-700 text-sm font-medium bg-white hover:bg-primary-50 transition-colors cursor-pointer"
            aria-label="Najít trhy kolem mě"
          >
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            Kolem mě
          </button>

          {/* Count badge */}
          <span className="text-xs text-neutral-400 font-medium">
            {filtered.length} {filtered.length === 1 ? 'trh' : filtered.length < 5 ? 'trhy' : 'trhů'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <p className="font-semibold text-neutral-600">Žádné trhy neodpovídají filtru</p>
            <p className="text-sm mt-1">Zkuste jiný kraj nebo časové období</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((market) => {
              const countdown = getCountdown(market.nextDate)
              return (
                <article
                  key={market.id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-card overflow-hidden flex hover:shadow-card-hover transition-shadow"
                >
                  {/* Photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://images.unsplash.com/photo-${market.photo}?w=160&h=160&fit=crop&q=80`}
                    alt={market.name}
                    width={120}
                    height={120}
                    className="w-[120px] object-cover flex-shrink-0 self-stretch"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />

                  {/* Content */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h2 className="font-heading font-bold text-forest text-base leading-tight flex-1 min-w-0">
                        {market.name}
                      </h2>
                      <span
                        className="text-xs font-bold flex-shrink-0"
                        style={{ color: countdown.color }}
                        aria-label={`Příští termín: ${countdown.text}`}
                      >
                        {countdown.text}
                      </span>
                    </div>

                    {/* Tags */}
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
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      {market.city} · {market.region}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-700 mb-1">
                      <Calendar className="w-3 h-3 text-primary-500" aria-hidden="true" />
                      {market.schedule} · {market.time}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-700 mb-3">
                      <Users className="w-3 h-3 text-earth-500" aria-hidden="true" />
                      {market.vendors} prodejců
                    </div>

                    {/* Action buttons */}
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
                        aria-label={`Sdílet ${market.name}`}
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
      </div>
    </div>
  )
}
