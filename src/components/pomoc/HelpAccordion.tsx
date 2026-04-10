'use client'

import { useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  {
    title: 'Pro zákazníky',
    color: 'text-primary-700 bg-primary-50',
    items: [
      {
        q: 'Jak najdu farmu ve svém okolí?',
        a: 'Otevřete stránku Mapa a zadejte svůj kraj nebo město do vyhledávacího pole. Můžete filtrovat farmy podle kategorie produktů (zelenina, maso, med…) nebo výhradně zobrazit aktuálně otevřené farmy. Kliknutím na značku na mapě zobrazíte detail farmy.',
      },
      {
        q: 'Jak mohu kontaktovat farmáře?',
        a: 'Na stránce každé farmy naleznete záložku "Kontakt" s telefonním číslem, e-mailem a kontaktním formulářem. Zpráva přijde farmáři přímo na e-mail – bez prostředníků. Mapa Farem z kontaktu nevybírá žádné poplatky.',
      },
      {
        q: 'Jsou všechny farmy na mapě ověřené?',
        a: 'Každá farma prochází základním ověřovacím procesem před zveřejněním. Ověřené farmy jsou označeny modrým odznakem. Zákazníci mohou hodnotit farmy recenzemi, které přispívají k důvěryhodnosti profilu.',
      },
      {
        q: 'Co je bedýnka zeleniny a jak si ji objednat?',
        a: 'Bedýnka je pravidelná zásilka čerstvé zeleniny (nebo jiných produktů) přímo od farmáře. Každý farmář má vlastní systém objednávání – nejčastěji přes e-mail nebo telefon. Kontaktujte farmáře a domluvte se přímo na frekvenci, obsahu a doručení.',
      },
      {
        q: 'Mohu produkty přes Mapu Farem platit kartou?',
        a: 'Mapa Farem je adresář farem – samotný nákup probíhá přímo mezi vámi a farmářem. Způsob platby (hotovost, převod, platební terminál) závisí na konkrétním farmáři. Tato informace bývá uvedena na profilu farmy nebo se dozvíte přímo od farmáře.',
      },
    ],
  },
  {
    title: 'Pro farmáře',
    color: 'text-amber-700 bg-amber-50',
    items: [
      {
        q: 'Jak zaregistruji svou farmu?',
        a: 'Klikněte na "Přidat farmu" v navigaci nebo přejděte na stránku /pridat-farmu. Vyplňte 5-krokový formulář (základní informace, lokalita, kontakt, otevírací doba, náhled). Po odeslání ověříme váš profil do 3 pracovních dnů.',
      },
      {
        q: 'Kolik registrace stojí?',
        a: 'Základní profil farmy je zcela zdarma. Zahrnuje zobrazení na mapě, profil s popisem, kontaktní formulář a až 5 fotografií. Prémiové plány s prioritním zobrazením a pokročilými funkcemi začínají od 299 Kč měsíčně.',
      },
      {
        q: 'Jak aktualizuji informace o farmě?',
        a: 'Po schválení profilu se přihlaste na svůj účet a proveďte změny v sekci "Správa profilu". Aktualizace produktů, otevírací doby a kontaktních údajů se projeví okamžitě. V případě problémů nás kontaktujte na info@mapafarem.cz.',
      },
      {
        q: 'Mohu na Mapu Farem přidat více farem?',
        a: 'Ano, každý farmář může spravovat více profilů farem. Kontaktujte nás na info@mapafarem.cz a pomůžeme vám nastavit správu více profilů pod jedním účtem.',
      },
      {
        q: 'Jak zákazníci hodnotí farmu?',
        a: 'Zákazníci mohou na stránce farmy zanechat recenzi s hodnocením od 1 do 5 hvězd a textovým komentářem. Jako farmář máte možnost na recenze odpovídat. Zřejmě falešné nebo urážlivé recenze nám nahlaste pro přezkum.',
      },
    ],
  },
  {
    title: 'Technické dotazy',
    color: 'text-cta bg-cta-50',
    items: [
      {
        q: 'Mapa se mi nezobrazuje správně. Co dělat?',
        a: 'Ujistěte se, že máte povoleny skripty třetích stran v prohlížeči a že je aktuální verze Chrome, Firefox nebo Safari. Pokud problém přetrvává, zkuste obnovit stránku (Ctrl+F5) nebo nás kontaktujte s popisem problému a verzí prohlížeče.',
      },
      {
        q: 'Jak funguje ukládání oblíbených farem?',
        a: 'Oblíbené farmy se ukládají lokálně do vašeho prohlížeče (localStorage). Nezpůsobujeme vytvoření účtu. To znamená, že pokud smažete data prohlížeče nebo se přepnete na jiné zařízení, oblíbené farmy se neuloží. Pro synchronizaci napříč zařízeními doporučujeme přidat farmy do záložek prohlížeče.',
      },
      {
        q: 'Kde mohu nahlásit chybu nebo nefunkční profil?',
        a: 'Chybu nebo nefunkční obsah nahlaste na info@mapafarem.cz s odkazem na konkrétní stránku a popisem problému. Reagujeme do 24 hodin v pracovní dny.',
      },
    ],
  },
]

export function HelpAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((s) => s.items.length > 0)

  return (
    <div>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat v nápovědě…"
          aria-label="Hledat v nápovědě"
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-[border-color,box-shadow] bg-white shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            aria-label="Vymazat hledání"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-400 text-sm">
          Žádné výsledky pro &ldquo;{search}&rdquo;.
          <button onClick={() => setSearch('')} className="block mx-auto mt-2 text-primary-600 hover:underline cursor-pointer">
            Zrušit filtr
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((section, si) => (
            <div key={section.title}>
              <h2 className="font-heading font-bold text-forest text-base mb-4 flex items-center gap-2">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', section.color)}>
                  {section.title}
                </span>
              </h2>
              <div className="space-y-2">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`
                  const isOpen = openItem === key
                  return (
                    <div key={ii} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-primary-50 transition-colors duration-150"
                      >
                        <span className="font-heading font-semibold text-forest text-sm pr-4 leading-snug">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200',
                            isOpen && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 text-sm text-neutral-500 leading-relaxed border-t border-neutral-50 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
