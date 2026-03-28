import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Ochrana soukromí – Mapa Farem',
  description:
    'Zásady ochrany osobních údajů Mapa Farem. Informace o zpracování osobních dat podle GDPR.',
  openGraph: {
    title: 'Ochrana soukromí – Mapa Farem',
    description: 'Zásady ochrany osobních údajů.',
    locale: 'cs_CZ',
  },
}

const TOC = [
  { id: 'spravce', title: '1. Správce údajů' },
  { id: 'co-sbíráme', title: '2. Jaké údaje sbíráme' },
  { id: 'proc', title: '3. Proč je zpracováváme' },
  { id: 'jak-dlouho', title: '4. Jak dlouho je uchováváme' },
  { id: 'sdileni', title: '5. Sdílení s třetími stranami' },
  { id: 'vase-prava', title: '6. Vaše práva' },
  { id: 'cookies', title: '7. Cookies' },
  { id: 'kontakt-dpo', title: '8. Kontakt' },
]

export default function SoukromiPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-forest mb-3">Ochrana soukromí</h1>
            <p className="text-neutral-500 text-sm">
              Platné od <strong>1. 1. 2025</strong> · Zpracování osobních údajů dle GDPR
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* TOC sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                <h2 className="font-heading font-bold text-forest text-sm mb-4">Obsah</h2>
                <nav aria-label="Obsah dokumentu">
                  <ul className="space-y-2">
                    {TOC.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="text-xs text-neutral-500 hover:text-primary-600 transition-colors cursor-pointer leading-snug block">
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 space-y-10 text-sm text-neutral-600 leading-relaxed">

              <section id="spravce">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">1. Správce osobních údajů</h2>
                <p className="mb-3">Správcem vašich osobních údajů je:</p>
                <div className="bg-primary-50 rounded-xl p-4 text-sm">
                  <p><strong className="text-forest">Mapa Farem</strong></p>
                  <p>Praha, Česká republika</p>
                  <p>E-mail: <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline cursor-pointer">info@mapafarem.cz</a></p>
                </div>
              </section>

              <section id="co-sbíráme">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">2. Jaké osobní údaje zpracováváme</h2>
                <p className="mb-3">V závislosti na způsobu použití Platformy zpracováváme tyto kategorie údajů:</p>
                <ul className="space-y-3">
                  <li><strong className="text-forest">Registrační údaje:</strong> jméno, e-mailová adresa, heslo (hashované)</li>
                  <li><strong className="text-forest">Profil farmy:</strong> název farmy, adresa, telefonní číslo, fotografie, popis, kategorye produktů</li>
                  <li><strong className="text-forest">Kontaktní formuláře:</strong> jméno, e-mail, obsah zprávy</li>
                  <li><strong className="text-forest">Newsletter:</strong> e-mailová adresa</li>
                  <li><strong className="text-forest">Technické údaje:</strong> IP adresa, typ prohlížeče, stránky navštívené na Platformě (anonymizovaně prostřednictvím analytiky)</li>
                  <li><strong className="text-forest">Cookies:</strong> viz sekce 7</li>
                </ul>
              </section>

              <section id="proc">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">3. Proč osobní údaje zpracováváme</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-primary-50">
                        <th className="text-left p-3 font-semibold text-forest rounded-tl-lg">Účel</th>
                        <th className="text-left p-3 font-semibold text-forest">Právní základ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ['Provoz uživatelského účtu a profilu farmy', 'Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)'],
                        ['Odpovědi na kontaktní dotazy', 'Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)'],
                        ['Zasílání newsletteru', 'Souhlas (čl. 6 odst. 1 písm. a) GDPR)'],
                        ['Bezpečnost a ochrana Platformy', 'Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)'],
                        ['Statistiky a zlepšování Platformy', 'Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)'],
                      ].map(([ucel, zaklad]) => (
                        <tr key={ucel} className="hover:bg-neutral-50">
                          <td className="p-3 text-neutral-600">{ucel}</td>
                          <td className="p-3 text-neutral-500">{zaklad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="jak-dlouho">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">4. Jak dlouho údaje uchováváme</h2>
                <ul className="space-y-2">
                  <li><strong className="text-forest">Registrační a profilové údaje:</strong> po dobu trvání účtu + 1 rok po zrušení</li>
                  <li><strong className="text-forest">Kontaktní zprávy:</strong> 2 roky od přijetí</li>
                  <li><strong className="text-forest">Newsletter:</strong> do odhlášení</li>
                  <li><strong className="text-forest">Technické logy:</strong> 90 dní</li>
                </ul>
              </section>

              <section id="sdileni">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">5. Sdílení osobních údajů s třetími stranami</h2>
                <p className="mb-3">Vaše osobní údaje neprodáváme ani nepronajímáme třetím stranám. Údaje mohou být sdíleny pouze:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>se zpracovateli (hosting, e-mailový provider), kteří jsou vázáni smlouvou o zpracování dat dle GDPR;</li>
                  <li>s orgány veřejné moci, pokud to vyžaduje zákon;</li>
                  <li>s jinými farmáři nebo zákazníky pouze v rozsahu, který jste sami zveřejnili na svém profilu.</li>
                </ul>
              </section>

              <section id="vase-prava">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">6. Vaše práva</h2>
                <p className="mb-3">Podle GDPR máte tato práva:</p>
                <ul className="space-y-2">
                  <li><strong className="text-forest">Právo na přístup:</strong> Kdykoli nás požádat o výpis osobních údajů, které o vás uchováváme.</li>
                  <li><strong className="text-forest">Právo na opravu:</strong> Požádat o opravu nepřesných nebo neúplných údajů.</li>
                  <li><strong className="text-forest">Právo na výmaz:</strong> Požádat o smazání vašich osobních údajů (s výjimkou údajů, které jsme povinni uchovávat ze zákona).</li>
                  <li><strong className="text-forest">Právo na přenositelnost:</strong> Získat vaše údaje ve strojově čitelném formátu (JSON, CSV).</li>
                  <li><strong className="text-forest">Právo na omezení zpracování:</strong> Požádat o pozastavení zpracování vašich údajů v určitých situacích.</li>
                  <li><strong className="text-forest">Právo vznést námitku:</strong> Vznést námitku proti zpracování na základě oprávněného zájmu.</li>
                  <li><strong className="text-forest">Právo odvolat souhlas:</strong> Kdykoli odvolat souhlas se zpracováním (newsletter).</li>
                </ul>
                <p className="mt-3">
                  Svá práva uplatněte e-mailem na{' '}
                  <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline cursor-pointer">info@mapafarem.cz</a>.
                  Na vaši žádost odpovíme do 30 dní. Máte také právo podat stížnost u{' '}
                  <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline cursor-pointer">
                    Úřadu pro ochranu osobních údajů (uoou.cz)
                  </a>.
                </p>
              </section>

              <section id="cookies">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">7. Cookies</h2>
                <p className="mb-3">
                  Platforma používá soubory cookies. Podrobné informace o typech cookies, jejich účelu a možnostech správy naleznete v naší{' '}
                  <a href="/cookies" className="text-primary-600 hover:underline cursor-pointer">Cookie politice</a>.
                </p>
              </section>

              <section id="kontakt-dpo">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">8. Kontakt</h2>
                <p>
                  V případě dotazů k ochraně osobních údajů nás kontaktujte na{' '}
                  <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline cursor-pointer">info@mapafarem.cz</a>{' '}
                  nebo písemně na adrese Praha, Česká republika.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
