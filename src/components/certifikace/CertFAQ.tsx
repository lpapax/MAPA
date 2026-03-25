'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ = [
  {
    q: 'Musí bio farmář mít certifikaci, aby prodával bio produkty?',
    a: 'Ano, v EU je zákonnou povinností mít platnou certifikaci od akreditovaného certifikačního orgánu, pokud prodáváte produkty označené jako bio nebo ekologické. Bez certifikace je takové označení protiprávní.',
  },
  {
    q: 'Jak dlouho trvá získání bio certifikace?',
    a: 'Certifikační proces trvá obvykle 1–3 roky. Nejprve probíhá přechodné období, během kterého farma přechází na ekologické metody hospodaření. Teprve po uplynutí přechodného období (2 roky pro rostlinnou výrobu, 1–2 roky pro živočišnou) lze produkty označovat jako bio.',
  },
  {
    q: 'Proč mnoho malých farem nemá bio certifikaci?',
    a: 'Certifikace je finančně nákladná (roční poplatky certifikačnímu orgánu) a administrativně náročná (vedení zápisů, kontroly). Mnoho malých rodinných farem hospodaří skvěle bez pesticidů, ale na certifikaci prostě nemají prostředky. Proto osobní kontakt a přímá komunikace s farmářem může být hodnotnější než certifikát.',
  },
  {
    q: 'Jak ověřit, zda je farmář skutečně certifikovaný?',
    a: 'Každý certifikační orgán vede veřejný registr certifikovaných subjektů. Na webu KEZ (kez.cz), ABCERT nebo Biokont CZ najdete databázi, kde si farmáře ověříte zadáním jeho kódu nebo jména.',
  },
  {
    q: 'Co je přechodné bio – co to znamená na etiketě?',
    a: 'Přechodné bio (nebo "z ekologického zemědělství v přechodném období") označuje produkty z farmy, která prošla certifikačním procesem, ale ještě nevypršelo přechodné období. Tyto produkty splňují požadavky bio zemědělství, ale nemohou nést plné logo EU pro bio. Jsou stejně hodnotné, ale cenově dostupnější.',
  },
]

export function CertFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {FAQ.map((item, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-primary-50 transition-colors duration-150"
          >
            <span className="font-heading font-semibold text-forest text-sm pr-4 leading-snug">{item.q}</span>
            <ChevronDown
              className={cn('w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200', open === i && 'rotate-180')}
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
