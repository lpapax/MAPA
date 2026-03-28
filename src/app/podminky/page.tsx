import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Podmínky užití – Mapa Farem',
  description: 'Podmínky užití platformy Mapa Farem. Platné od 1. 1. 2025.',
  openGraph: {
    title: 'Podmínky užití – Mapa Farem',
    description: 'Podmínky užití platformy Mapa Farem.',
    locale: 'cs_CZ',
  },
}

const TOC = [
  { id: 'uvodni-ustanoveni', title: '1. Úvodní ustanovení' },
  { id: 'definice', title: '2. Definice pojmů' },
  { id: 'registrace', title: '3. Registrace a uživatelský účet' },
  { id: 'prava-povinnosti', title: '4. Práva a povinnosti uživatelů' },
  { id: 'platby', title: '5. Platby a prémiové funkce' },
  { id: 'obsah', title: '6. Odpovědnost za obsah' },
  { id: 'zaverecna-ustanoveni', title: '7. Závěrečná ustanovení' },
]

export default function PodminkyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-heading text-4xl font-bold text-forest mb-3">Podmínky užití</h1>
            <p className="text-neutral-500 text-sm">
              Platné od <strong>1. 1. 2025</strong> · Verze 1.0
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
                        <a
                          href={`#${item.id}`}
                          className="text-xs text-neutral-500 hover:text-primary-600 transition-colors cursor-pointer leading-snug block"
                        >
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

              <section id="uvodni-ustanoveni">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">1. Úvodní ustanovení</h2>
                <p className="mb-3">
                  Tyto podmínky užití (dále jen &bdquo;Podmínky&ldquo;) upravují práva a povinnosti mezi provozovatelem platformy Mapa Farem (dále jen &bdquo;Provozovatel&ldquo;) a uživateli platformy dostupné na adrese mapafarem.cz (dále jen &bdquo;Platforma&ldquo;).
                </p>
                <p className="mb-3">
                  Provozovatelem Platformy je Mapa Farem, se sídlem Praha, Česká republika (dále jen &bdquo;Provozovatel&ldquo;).
                </p>
                <p>
                  Používáním Platformy uživatel vyjadřuje souhlas s těmito Podmínkami. Pokud s Podmínkami nesouhlasíte, Platformu nepoužívejte.
                </p>
              </section>

              <section id="definice">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">2. Definice pojmů</h2>
                <ul className="space-y-3">
                  <li><strong className="text-forest">Platforma</strong> – webová aplikace Mapa Farem dostupná na adrese mapafarem.cz a jejích subdoménách.</li>
                  <li><strong className="text-forest">Uživatel</strong> – každá fyzická nebo právnická osoba, která Platformu navštíví nebo se zaregistruje.</li>
                  <li><strong className="text-forest">Farmář</strong> – registrovaný uživatel, který spravuje profil farmy nebo prodejního místa.</li>
                  <li><strong className="text-forest">Zákazník</strong> – uživatel, který Platformu využívá k vyhledávání farem a jejich produktů.</li>
                  <li><strong className="text-forest">Obsah</strong> – veškeré texty, fotografie, hodnocení, recenze a jiné informace vložené uživateli na Platformu.</li>
                  <li><strong className="text-forest">Prémiový plán</strong> – placená služba rozšiřující základní funkcionality profilu farmáře.</li>
                </ul>
              </section>

              <section id="registrace">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">3. Registrace a uživatelský účet</h2>
                <p className="mb-3">
                  Základní používání Platformy (prohlížení farem, vyhledávání) nevyžaduje registraci. Pro přidání farmy nebo správu profilu je registrace povinná.
                </p>
                <p className="mb-3">
                  Při registraci je uživatel povinen uvést pravdivé, aktuální a úplné informace. Za pravdivost poskytnutých údajů odpovídá výhradně uživatel. Provozovatel si vyhrazuje právo ověřit správnost údajů a v případě nesrovnalostí účet pozastavit nebo zrušit.
                </p>
                <p className="mb-3">
                  Uživatel je povinen chránit přístupové údaje ke svému účtu a neposkytovat je třetím osobám. V případě podezření na neoprávněný přístup k účtu je uživatel povinen neprodleně informovat Provozovatele.
                </p>
                <p>
                  Provozovatel si vyhrazuje právo odmítnout registraci nebo zrušit stávající účet bez udání důvodu, zejména pokud uživatel porušuje tyto Podmínky nebo obecně závazné právní předpisy.
                </p>
              </section>

              <section id="prava-povinnosti">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">4. Práva a povinnosti uživatelů</h2>
                <h3 className="font-semibold text-forest mb-2">4.1 Oprávněné jednání</h3>
                <p className="mb-3">Uživatelé jsou oprávněni používat Platformu v souladu s jejím účelem – tj. k vyhledávání lokálních farem a navazování přímého kontaktu s farmáři.</p>
                <h3 className="font-semibold text-forest mb-2">4.2 Zakázané jednání</h3>
                <p className="mb-3">Uživatelé nesmí:</p>
                <ul className="list-disc pl-5 space-y-1 mb-3">
                  <li>vkládat nepravdivé, zavádějící nebo urážlivé informace;</li>
                  <li>zneužívat Platformu ke spamu nebo nevyžádané komunikaci;</li>
                  <li>automatizovaně stahovat data z Platformy bez souhlasu Provozovatele;</li>
                  <li>pokoušet se o neoprávněný přístup k systémům Provozovatele;</li>
                  <li>narušovat fungování Platformy nebo zkušenosti ostatních uživatelů.</li>
                </ul>
                <h3 className="font-semibold text-forest mb-2">4.3 Recenze a hodnocení</h3>
                <p>Uživatelé mohou hodnotit farmy recenzemi. Recenze musí vycházet ze skutečné zkušenosti, být věcné a neobsahovat urážlivý nebo diskriminační obsah. Provozovatel si vyhrazuje právo odstranit recenze porušující tato pravidla.</p>
              </section>

              <section id="platby">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">5. Platby a prémiové funkce</h2>
                <p className="mb-3">
                  Základní registrace farmy a používání Platformy jsou zdarma. Prémiové plány jsou dobrovolné a rozšiřují možnosti prezentace farmy.
                </p>
                <p className="mb-3">
                  Ceny prémiových plánů jsou uvedeny na stránce Pro farmáře. Platby se provádějí pravidelně (měsíčně nebo ročně) prostřednictvím platební brány. Předplatné se automaticky obnovuje, pokud není zrušeno nejpozději 24 hodin před koncem aktuálního období.
                </p>
                <p>
                  Provozovatel si vyhrazuje právo změnit ceny prémiových plánů. O změně budou uživatelé informováni e-mailem nejméně 30 dní předem.
                </p>
              </section>

              <section id="obsah">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">6. Odpovědnost za obsah</h2>
                <p className="mb-3">
                  Provozovatel provozuje Platformu jako zprostředkovatele informací a nenese odpovědnost za přesnost, úplnost nebo aktuálnost informací vložených uživateli (farmáři, zákazníci).
                </p>
                <p className="mb-3">
                  Veškeré obchodní transakce (nákup produktů, platby) probíhají výhradně mezi zákazníkem a farmářem. Provozovatel není stranou těchto transakcí a nenese za ně odpovědnost.
                </p>
                <p>
                  Vkladem obsahu na Platformu uživatel uděluje Provozovateli nevýhradní licenci k zobrazování tohoto obsahu v rámci Platformy. Tato licence nevyžaduje odměnu a trvá po dobu existence profilu.
                </p>
              </section>

              <section id="zaverecna-ustanoveni">
                <h2 className="font-heading text-xl font-bold text-forest mb-4">7. Závěrečná ustanovení</h2>
                <p className="mb-3">
                  Tyto Podmínky se řídí právem České republiky. Pro řešení sporů je příslušný obecný soud Provozovatele.
                </p>
                <p className="mb-3">
                  Provozovatel si vyhrazuje právo tyto Podmínky kdykoli změnit. O podstatných změnách budou registrovaní uživatelé informováni e-mailem. Pokračováním v používání Platformy po účinnosti změny uživatel vyjadřuje souhlas s aktualizovanými Podmínkami.
                </p>
                <p>
                  V případě dotazů k těmto Podmínkám nás kontaktujte na{' '}
                  <a href="mailto:info@mapafarem.cz" className="text-primary-600 hover:underline cursor-pointer">
                    info@mapafarem.cz
                  </a>.
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
