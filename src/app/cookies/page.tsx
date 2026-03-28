import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Cookie politika – Mapa Farem',
  description: 'Informace o používání cookies na Mapě Farem. Jak spravovat cookies v různých prohlížečích.',
  openGraph: {
    title: 'Cookie politika – Mapa Farem',
    description: 'Informace o cookies na Mapě Farem.',
    locale: 'cs_CZ',
  },
}

const COOKIE_TABLE = [
  {
    type: 'Nezbytné',
    typeColor: 'bg-primary-100 text-primary-700',
    description: 'Nepostradatelné pro fungování webu. Nelze je zakázat.',
    cookies: [
      { name: '__session', purpose: 'Přihlašovací session uživatele', duration: 'Do konce relace', provider: 'Mapa Farem' },
      { name: 'csrf_token', purpose: 'Ochrana před CSRF útoky', duration: 'Do konce relace', provider: 'Mapa Farem' },
    ],
  },
  {
    type: 'Analytické',
    typeColor: 'bg-blue-100 text-blue-700',
    description: 'Pomáhají nám pochopit, jak návštěvníci Platformu používají (anonymizovaně).',
    cookies: [
      { name: '_ga', purpose: 'Rozlišení unikátních návštěvníků (Google Analytics)', duration: '2 roky', provider: 'Google' },
      { name: '_ga_*', purpose: 'Uchovávání stavu relace (Google Analytics 4)', duration: '2 roky', provider: 'Google' },
      { name: '_gid', purpose: 'Rozlišení unikátních návštěvníků (24 hodin)', duration: '24 hodin', provider: 'Google' },
    ],
  },
  {
    type: 'Marketingové',
    typeColor: 'bg-amber-100 text-amber-700',
    description: 'Používají se pro zobrazení relevantní reklamy. Aktuálně je nepoužíváme.',
    cookies: [
      { name: '—', purpose: 'Žádné marketingové cookies nejsou aktivní', duration: '—', provider: '—' },
    ],
  },
]

const BROWSER_GUIDES = [
  {
    name: 'Google Chrome',
    steps: 'Nastavení → Soukromí a zabezpečení → Soubory cookie a jiná data webu',
  },
  {
    name: 'Mozilla Firefox',
    steps: 'Nastavení → Soukromí a zabezpečení → Cookies a data webů',
  },
  {
    name: 'Apple Safari',
    steps: 'Nastavení → Safari → Soukromí → Spravovat data webových stránek',
  },
  {
    name: 'Microsoft Edge',
    steps: 'Nastavení → Soukromí, vyhledávání a služby → Cookies a oprávnění webu',
  },
]

export default function CookiesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-forest mb-3">Cookie politika</h1>
            <p className="text-neutral-500 text-sm">Platné od <strong>1. 1. 2025</strong></p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 space-y-12 text-sm text-neutral-600 leading-relaxed">

            {/* Intro */}
            <section>
              <p className="mb-3">
                Cookies jsou malé textové soubory ukládané do vašeho prohlížeče při návštěvě webových stránek.
                Pomáhají nám zajistit fungování Platformy, zapamatovat vaše preference a analyzovat využívání webu.
              </p>
              <p>
                Používáním Mapy Farem souhlasíte s používáním nezbytných cookies. Pro analytické cookies si
                vyžádáme váš souhlas prostřednictvím cookie lišty.
              </p>
            </section>

            {/* Cookie table */}
            <section>
              <h2 className="font-heading text-xl font-bold text-forest mb-6">Typy cookies</h2>
              <div className="space-y-8">
                {COOKIE_TABLE.map((section) => (
                  <div key={section.type}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${section.typeColor}`}>
                        {section.type}
                      </span>
                      <span className="text-xs text-neutral-400">{section.description}</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-neutral-100">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-100">
                            <th className="text-left px-4 py-3 font-semibold text-forest">Název</th>
                            <th className="text-left px-4 py-3 font-semibold text-forest">Účel</th>
                            <th className="text-left px-4 py-3 font-semibold text-forest">Platnost</th>
                            <th className="text-left px-4 py-3 font-semibold text-forest">Poskytovatel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {section.cookies.map((cookie) => (
                            <tr key={cookie.name} className="hover:bg-neutral-50">
                              <td className="px-4 py-3 font-mono text-neutral-700">{cookie.name}</td>
                              <td className="px-4 py-3 text-neutral-500">{cookie.purpose}</td>
                              <td className="px-4 py-3 text-neutral-500">{cookie.duration}</td>
                              <td className="px-4 py-3 text-neutral-500">{cookie.provider}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How to manage */}
            <section>
              <h2 className="font-heading text-xl font-bold text-forest mb-4">Jak spravovat cookies v prohlížeči</h2>
              <p className="mb-5">
                Cookies můžete kdykoli smazat nebo zablokovat v nastavení vašeho prohlížeče. Upozorňujeme,
                že zablokování nezbytných cookies může narušit funkčnost Platformy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BROWSER_GUIDES.map((guide) => (
                  <div key={guide.name} className="bg-primary-50 rounded-xl p-4">
                    <h3 className="font-semibold text-forest text-sm mb-1.5">{guide.name}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed">{guide.steps}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-heading text-xl font-bold text-forest mb-3">Dotazy k cookies</h2>
              <p>
                V případě dotazů nás kontaktujte na{' '}
                <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline cursor-pointer">
                  info@mapafarem.cz
                </a>{' '}
                nebo si přečtěte naše{' '}
                <a href="/soukromi" className="text-primary-600 hover:underline cursor-pointer">
                  Zásady ochrany soukromí
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
