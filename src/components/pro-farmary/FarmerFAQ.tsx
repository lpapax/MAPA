'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FARMER_FAQ = [
  {
    q: 'Kolik stojí registrace farmy?',
    a: 'Základní registrace je zcela zdarma a zahrnuje profil farmy, zobrazení na mapě, kontaktní formulář a až 5 fotografií. Prémiové plány s dalšími funkcemi jsou k dispozici od 299 Kč měsíčně.',
  },
  {
    q: 'Jak dlouho trvá schválení profilu?',
    a: 'Po vyplnění registrace provedeme ověření do 3 pracovních dnů. V případě potřeby vás kontaktujeme e-mailem. Po schválení bude váš profil okamžitě viditelný na mapě.',
  },
  {
    q: 'Jak zákazníci naši farmu kontaktují?',
    a: 'Zákazníci vás kontaktují přímo přes kontaktní formulář na vašem profilu nebo na telefonním čísle či e-mailu, který uvedete. Mapa Farem nevybírá žádné provize z prodeje.',
  },
  {
    q: 'Musím mít bio certifikaci?',
    a: 'Ne, bio certifikace není podmínkou. Na Mapě Farem jsou farmy s i bez bio certifikace. Důležité je, abyste byli skutečný lokální producent a informace o farmě byly pravdivé.',
  },
  {
    q: 'Mohu profil kdykoliv aktualizovat?',
    a: 'Ano, profil farmy si můžete kdykoli aktualizovat – produkty, otevírací dobu, fotografie, kontakt. Přihlaste se na váš účet a proveďte změny. Aktualizace se projeví okamžitě.',
  },
  {
    q: 'Co když zákazníci napíší negativní recenzi?',
    a: 'Věříme v transparentnost. Zákazníci mohou hodnotit farmu, ale máte možnost na recenzi odpovědět. Při sporné recenzi nás kontaktujte – každý případ řešíme individuálně a fér.',
  },
]

export function FarmerFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {FARMER_FAQ.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-primary-50 transition-colors duration-200"
          >
            <span className="font-heading font-semibold text-forest text-sm pr-4">{item.q}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200',
                open === i && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
