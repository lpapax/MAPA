'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/farms'
import type { Farm } from '@/types/farm'

const DAY_LABELS: Record<string, string> = { po: 'Po', út: 'Út', st: 'St', čt: 'Čt', pá: 'Pá', so: 'So', ne: 'Ne' }
const DAY_ORDER = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne']

interface CompareClientProps {
  farms: Farm[]
}

export function CompareClient({ farms }: CompareClientProps) {
  if (farms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400 text-sm mb-4">Žádné farmy k porovnání. Vyberte je na mapě.</p>
        <Link href="/mapa" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors">
          Zpět na mapu
        </Link>
      </div>
    )
  }

  const rows: { label: string; render: (farm: Farm) => React.ReactNode }[] = [
    {
      label: 'Kraj',
      render: (f) => <span className="text-sm text-gray-700">{f.location.kraj}</span>,
    },
    {
      label: 'Město',
      render: (f) => <span className="text-sm text-gray-700">{f.location.city}</span>,
    },
    {
      label: 'Ověřeno',
      render: (f) => (
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', f.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
          {f.verified ? 'Ano' : 'Ne'}
        </span>
      ),
    },
    {
      label: 'Kategorie',
      render: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.categories.map((cat) => (
            <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100 font-medium">
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: 'Telefon',
      render: (f) => f.contact.phone
        ? <a href={`tel:${f.contact.phone}`} className="text-sm text-primary-600 hover:underline">{f.contact.phone}</a>
        : <span className="text-gray-300 text-sm">—</span>,
    },
    {
      label: 'E-mail',
      render: (f) => f.contact.email
        ? <a href={`mailto:${f.contact.email}`} className="text-sm text-primary-600 hover:underline truncate max-w-[160px] block">{f.contact.email}</a>
        : <span className="text-gray-300 text-sm">—</span>,
    },
    {
      label: 'Web',
      render: (f) => f.contact.web
        ? <a href={f.contact.web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline truncate max-w-[160px] block">{f.contact.web.replace(/^https?:\/\//, '')}</a>
        : <span className="text-gray-300 text-sm">—</span>,
    },
    {
      label: 'Otevírací doba',
      render: (f) => f.openingHours
        ? (
          <div className="text-xs space-y-0.5">
            {DAY_ORDER.map((day) => {
              const h = f.openingHours![day as keyof typeof f.openingHours]
              return (
                <div key={day} className="flex gap-2">
                  <span className="text-gray-400 w-5">{DAY_LABELS[day]}</span>
                  <span className="text-gray-600">{h ? `${h.open}–${h.close}` : '—'}</span>
                </div>
              )
            })}
          </div>
        )
        : <span className="text-gray-300 text-sm">Neuvedeno</span>,
    },
  ]

  return (
    <div>
      <Link href="/mapa" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Zpět na mapu
      </Link>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table" aria-label="Porovnání farem">
          <thead>
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32 bg-gray-50 rounded-tl-2xl border border-gray-100">
                Parametr
              </th>
              {farms.map((farm, i) => (
                <th key={farm.id} className={cn('p-4 text-left bg-white border border-gray-100', i === farms.length - 1 && 'rounded-tr-2xl')}>
                  <Link href={`/farmy/${farm.slug}`} className="font-heading font-bold text-forest text-sm hover:text-primary-600 transition-colors">
                    {farm.name}
                  </Link>
                  <div className="text-xs text-gray-400 font-normal mt-0.5">{farm.location.city}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                <td className="p-4 text-xs font-semibold text-gray-500 border border-gray-100 align-top">
                  {row.label}
                </td>
                {farms.map((farm) => (
                  <td key={farm.id} className="p-4 border border-gray-100 align-top">
                    {row.render(farm)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
