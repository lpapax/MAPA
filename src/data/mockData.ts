import type { FarmCategory } from '@/types/farm'

// ──────────────────────────────────────────────
// Featured farms for homepage
// ──────────────────────────────────────────────

export interface MockFarm {
  id: string
  slug: string
  name: string
  farmerName: string
  farmerInitials: string
  farmerColor: string        // Tailwind bg class for avatar
  coverGradient: string      // Tailwind gradient fallback
  coverImage: string         // Unsplash photo URL
  kraj: string
  categories: FarmCategory[]
  spotlight?: boolean
}

export const FEATURED_FARMS: MockFarm[] = [
  {
    id: 'f1',
    slug: 'ekofarma-dvorak',
    name: 'Ekofarma Dvořák',
    farmerName: 'Jan Dvořák',
    farmerInitials: 'JD',
    farmerColor: 'bg-emerald-500',
    coverGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&q=80',
    kraj: 'Jihočeský',
    categories: ['zelenina', 'ovoce', 'vejce'],
  },
  {
    id: 'f2',
    slug: 'farma-bila-hora',
    name: 'Farma Bílá hora',
    farmerName: 'Farma Bílá hora',
    farmerInitials: 'BH',
    farmerColor: 'bg-amber-500',
    coverGradient: 'from-amber-300 via-orange-400 to-red-500',
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=600&fit=crop&q=80',
    kraj: 'Středočeský',
    categories: ['maso', 'mléko'],
    spotlight: true,
  },
  {
    id: 'f3',
    slug: 'vceli-zahrada',
    name: 'Včelí zahrada',
    farmerName: 'Včelí zahrada',
    farmerInitials: 'VZ',
    farmerColor: 'bg-yellow-500',
    coverGradient: 'from-yellow-300 via-amber-400 to-orange-500',
    coverImage: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop&q=80',
    kraj: 'Jihomoravský',
    categories: ['med', 'byliny'],
  },
  {
    id: 'f4',
    slug: 'rodinná-farma-kopecky',
    name: 'Rodinná farma Kopecký',
    farmerName: 'Rodinná farma Kopecký',
    farmerInitials: 'RK',
    farmerColor: 'bg-green-600',
    coverGradient: 'from-green-400 via-emerald-500 to-teal-600',
    coverImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop&q=80',
    kraj: 'Vysočina',
    categories: ['zelenina', 'mléko', 'vejce'],
  },
  {
    id: 'f5',
    slug: 'ovocne-sady-novotny',
    name: 'Ovocné sady Novotný',
    farmerName: 'Ovocné sady Novotný',
    farmerInitials: 'ON',
    farmerColor: 'bg-rose-500',
    coverGradient: 'from-rose-300 via-pink-400 to-red-400',
    coverImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop&q=80',
    kraj: 'Plzeňský',
    categories: ['ovoce', 'víno'],
  },
  {
    id: 'f6',
    slug: 'vinny-sklep-moravsky-podzim',
    name: 'Vinný sklep Moravský podzim',
    farmerName: 'Vinný sklep Moravský podzim',
    farmerInitials: 'VM',
    farmerColor: 'bg-purple-600',
    coverGradient: 'from-purple-500 via-violet-600 to-indigo-600',
    coverImage: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&h=600&fit=crop&q=80',
    kraj: 'Jihomoravský',
    categories: ['víno'],
  },
  {
    id: 'f7',
    slug: 'bylinkova-zahrada-sumava',
    name: 'Bylinková zahrada Šumava',
    farmerName: 'Bylinková zahrada Šumava',
    farmerInitials: 'BŠ',
    farmerColor: 'bg-lime-600',
    coverGradient: 'from-lime-400 via-green-500 to-teal-600',
    coverImage: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop&q=80',
    kraj: 'Plzeňský',
    categories: ['byliny', 'med'],
  },
]

// ──────────────────────────────────────────────
// Testimonials
// ──────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  city: string
  rating: number
  quote: string
  initials: string
  color: string
  since: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Jana K.',
    city: 'Praha 6',
    rating: 5,
    quote:
      'Nejdřív jsem byla skeptická, ale zkusila jsem první bedýnku a od té doby nezastavitelná. Zelenina chutná úplně jinak než z Albertu – a víte co, děti ji taky jí. To je pro mě největší důkaz.',
    initials: 'JK',
    color: 'bg-emerald-500',
    since: 'zákaznice od jara 2023',
  },
  {
    id: 't2',
    name: 'Petr M.',
    city: 'Brno-Líšeň',
    rating: 5,
    quote:
      'Bydlím na okraji Brna a myslel jsem, že farmu nenajdu blíž než hodinu jízdy. Přes Mapu Farem jsem našel jednu 12 km od nás. Teď tam chodím jednou za čtrnáct dní, farmář mi vždycky nechá něco stranou.',
    initials: 'PM',
    color: 'bg-amber-500',
    since: 'zákazník od léta 2022',
  },
  {
    id: 't3',
    name: 'Markéta S.',
    city: 'Olomouc',
    rating: 5,
    quote:
      'Objednala jsem med a dostala taky vzkaz, že letos bylo sucho a lípa kvetla kratčeji, tak ho je míň. Tohle vám v žádném e-shopu nenapíšou. Mám ráda, že vím, s kým jednám.',
    initials: 'MS',
    color: 'bg-rose-500',
    since: 'zákaznice od podzimu 2023',
  },
]

// ──────────────────────────────────────────────
// Blog articles
// ──────────────────────────────────────────────

export interface BlogArticle {
  id: string
  title: string
  category: string
  categoryColor: string
  readTime: string
  excerpt: string
  coverGradient: string
  coverImage: string
  slug: string
  author: string
  authorInitials: string
  authorColor: string
  publishedAt: string
  content: string
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'b4',
    title: 'Recepty se sezónní zeleninou: Co vařit v létě',
    category: 'Recepty',
    categoryColor: 'bg-rose-100 text-rose-700',
    readTime: '6 min čtení',
    excerpt:
      'Léto přináší hojnost čerstvé zeleniny. Víme, jak ji proměnit v rychlé, výživné a chutné pokrmy bez hodin stráveného vaření.',
    coverGradient: 'from-rose-400 to-orange-500',
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=480&fit=crop&q=80',
    slug: 'recepty-sezonni-zelenina',
    author: 'Lucie Marková',
    authorInitials: 'LM',
    authorColor: 'bg-rose-500',
    publishedAt: '2. dubna 2025',
    content: `Léto je nejkrásnější čas pro vaření. Stánky farmářů se prohýbají pod tíhou čerstvé zeleniny a ovoce. Rajčata voní jako nikdy, kukuřice je sladká, cukety rostou tak rychle, že nestíháte zpracovávat. Tenhle průvodce vám ukáže, jak z letní úrody vytěžit maximum bez složitých receptů.

## Zásady letního vaření

Nejlepší letní recepty jsou ty nejjednodušší. Čerstvá, zralá zelenina nepotřebuje mnoho – stačí trocha olivového oleje, bylinky, sůl a teplo. Čím méně zpracování, tím více chutnají přirozené chutě.

**Pravidlo číslo jedna:** Kupujte zeleninu vždy v den vaření nebo maximálně den před tím. Letní zelenina vydrží krátce – to je přirozené.

**Pravidlo číslo dvě:** Neskladujte rajčata v lednici. Chlad ničí jejich aroma. Nechte je na lince při pokojové teplotě.

**Pravidlo číslo tři:** Sůl používejte až na konci. Dříve přidaná sůl zeleninu odvodní a připravuje ji o šťávu.

## Rychlé caprese (10 minut)

Jednoduchá klasika, která přesto dokáže ohromit – ale jen s kvalitními rajčaty přímo od farmáře.

**Ingredience:** 4 zralá rajčata, 200 g čerstvé mozzarelly, hrst bazalkových listů, 3 lžíce olivového oleje, mořská sůl, černý pepř.

**Postup:** Nakrájejte rajčata a mozzarellu na plátky. Střídejte je na talíři. Prokládejte bazalkou. Zakápněte olivovým olejem, posypte solí a pepřem. Podávejte okamžitě s čerstvým chlebem.

Klíč k úspěchu: rajčata musí být zralá, teplá a voňavá. Supermarketová rajčata tento recept zničí.

## Pečená cuketa s bylinkami (20 minut)

Cuketa je letní zelenina číslo jedna – roste rychle, je všestranná a v sezóně stojí jen pár korun.

**Ingredience:** 2 velké cukety, 4 stroužky česneku, tymián a rozmarýn, olivový olej, parmazán na strouhání.

**Postup:** Rozehřejte troubu na 200 °C. Nakrájejte cukety na půlcentimetrové plátky. Uspořádejte na plech, zakápněte olejem, nasypte nakrájený česnek a bylinky. Pečte 15 minut, dokud okraje nezezlátnou. Nastruhejte parmazán a podávejte jako přílohu nebo samotné s chlebem.

## Studená gazpacho (15 minut + chlazení)

Španělská polévka z čerstvých rajčat je ideální na horké dny – studená, osvěžující, bez vaření.

**Ingredience:** 6 rajčat, 1 okurka, 1 červená paprika, 1 cibule, 2 stroužky česneku, 4 lžíce olivového oleje, 2 lžíce červeného octa, sůl, pepř, voda dle potřeby.

**Postup:** Nakrájejte všechnu zeleninu. Rozmixujte dohladka. Přidejte olej, ocet, sůl, pepř. Upravte hustotu vodou. Chlaďte alespoň hodinu. Podávejte s kapkou olivového oleje a čerstvou bazalkou.

Gazpacho vydrží v lednici 3 dny a s každým dnem je chutnější.

## Grilovaná kukuřice s bylinkové máslo (15 minut)

Čerstvá kukuřice přímo z farmy – ne ta z plechovky – je letní delikatesa sama o sobě.

**Ingredience:** 4 klasy kukuřice, 80 g másla, petrželka, česnekový prášek, sůl.

**Postup:** Smíchejte změklé máslo s petrželkou a česnековым práškem. Rozehřejte gril nebo grilovací pánev. Kukuřici grilujte 10–12 minut, otáčejte každé 2 minuty. Potřete bylinkovým máslem. Podávejte ihned.

## Rajčatový salát s červenou cibulí

Jednoduchý salát, který každý zná, ale málokdo dělá správně.

**Ingredience:** 5 různobarevných rajčat, půlka červené cibule, hrst petrželky, olivový olej, červený vinný ocet, sůl.

**Postup:** Nakrájejte rajčata na čtvrtky nebo osminky – nikdy na kolečka. Cibuli nakrájejte na tenké půlkroužky a namočte ji na 5 minut do studené vody (ztratí ostrost). Smíchejte, přidejte petrželku, zakápněte olejem a octem. Nechte 10 minut odležet při pokojové teplotě.

## Rychlá ratatouille (35 minut)

Francouzská klasika z letní zeleniny – cuketa, paprika, lilek, rajčata.

**Ingredience:** 1 lilek, 2 cukety, 2 papriky, 4 rajčata, cibule, 3 stroužky česneku, tymián, olivový olej.

**Postup:** Nakrájejte vše na kostky 2 cm. Na hluboké pánvi osmahněte cibuli a česnek. Přidejte papriku, po 3 minutách lilek, po dalších 3 minutách cuketu. Přidejte nakrájená rajčata a tymián. Vařte pod pokličkou 20 minut na mírném ohni. Dochuťte solí a pepřem. Skvělé s chlebem, těstovinami nebo jako příloha.

## Kde sehnat nejlepší letní zeleninu?

Navštivte farmářský trh nebo si na Mapě Farem najděte farmáře přímo ve vašem okolí. Přímý nákup od farmáře zajišťuje, že zelenina není dny stará z distribučního centra, ale opravdu čerstvá – sklizená nejlépe ráno v den prodeje.

Letní vaření je radost. Nepotřebujete složité recepty ani drahé ingredience. Stačí dobrá zelenina, trocha olivového oleje a chuť experimentovat. Bon appétit!`,
  },
  {
    id: 'b5',
    title: 'Jak poznat kvalitní med? Průvodce pro zákazníky',
    category: 'Průvodce',
    categoryColor: 'bg-blue-100 text-blue-700',
    readTime: '5 min čtení',
    excerpt:
      'Med z obchodu a med přímo od včelaře jsou dva rozdílné světy. Naučte se rozeznat skutečný med od průmyslového sirupu.',
    coverGradient: 'from-amber-300 to-yellow-500',
    coverImage: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&h=480&fit=crop&q=80',
    slug: 'jak-poznat-kvalitni-med',
    author: 'Pavel Krejčí',
    authorInitials: 'PK',
    authorColor: 'bg-amber-500',
    publishedAt: '18. března 2025',
    content: `Med je jednou z nejčastěji falšovaných potravin na světě. Podle výzkumů EU je až třetina medu prodávaného v evropských supermarketech ředěna kukuřičným sirupem nebo pochází z Číny, přičemž je označena jako „původ: EU". Jak tedy poznat skutečný, kvalitní med?

## Co je skutečný med?

Pravý med je přírodní produkt, který včely vyrobí z nektaru rostlin nebo z medovice. Neměl by obsahovat žádné přidané cukry, konzervanty ani jiné přísady. Zní to jednoduše – ale v praxi je plný trh produkty, které tuto definici nesplňují.

## Základní testy kvality

### Test krystalizace

Pravý med krystalizuje – to je přirozený proces, ne vada. Pokud je váš med po několika měsících stále tekutý, pravděpodobně byl zahřátý nad 40 °C (čímž ztratil většinu enzymatické aktivity) nebo byl ředěn. Jedinou výjimkou je akátový med, který krystalizuje velmi pomalu.

Pokud máte zkrystalizovaný med a chcete ho zkapalnit, dejte sklenici do vodní lázně o teplotě max. 40 °C. Nikdy ne do mikrovlnné trouby – ta enzymy zničí.

### Test vody

Naberte lžíci medu a pomalu ji otočte. Pravý med by měl stékat pomalu a „provazovat" se – táhne za sebou tenký vláken. Falšovaný med stéká rychle a vodnatě jako sirup.

Pokud máte pochyby, nechte kapku medu padnout na papír. Pravý med netvoří hned vlhký kroužek – absorbce je pomalá. Vodnatý med se vsákne okamžitě.

### Test na palec

Dejte kapku medu na palec. Pravý med se nebude hned rozlévat – drží tvar. Falšovaný med se rychle roztéká, protože obsahuje přebytečnou vodu.

### Chutě a vůně

Každý druh medu má svou charakteristickou vůni a chuť. Lipový med vonia delikátně po lipovém květu, pohankový med je tmavý a robustní, akátový med je světlý a jemně sladký. Průmyslový med po ničem specifickém nevoní – je to neutrální sladká hmota.

## Druhy českého medu

**Akátový med** – světle žlutý až průhledný, jemně sladký, pomalu krystalizuje. Jeden z nejoblíbenějších.

**Lipový med** – světlý až žlutozelený, svěží vůně, delikátní chuť. Výborný na čaj.

**Pohankový med** – tmavě hnědý, intenzivní aroma a chuť, bohatý na minerály a antioxidanty.

**Smrkový medovicový med** – tmavý, hustý, méně sladký, bohatý na minerální látky. Vhodný pro diabetiky.

**Řepkový med** – světle žlutý, velmi rychle krystalizuje na tuhý med. Jemná chuť.

**Luční med** – směs nektaru z různých lučních květin. Závisí na lokalitě, má komplexní chuť.

## Co hledat na etiketě

Na etiketě kvalitního českého medu byste měli najít:
- Jméno a adresu včelaře nebo výrobce
- Zemi původu (v ČR musí být povinně uvedena)
- Druh medu (akátový, lipový, luční…)
- Hmotnost netto
- Doporučenou dobu spotřeby (typicky 2 roky)

Vyhněte se medům označeným pouze „Blend of EU and non-EU honey" – to jsou levné směsi, které nijak negarantují kvalitu.

## Proč nakupovat med přímo od včelaře?

Přímý nákup od včelaře je nejlepší zárukou kvality. Včelař vám řekne:
- Kde jeho včely sbíraly nektar
- Jak med zpracovával (teplota, filtrování)
- Kdy byl med stočen
- Jestli byl v sezoně dostatek nektaru

Tento přímý kontakt nenahradí žádný certifikát. Navíc podpoříte lokální včelaře, kteří jsou klíčoví pro opylování krajiny.

Na Mapě Farem najdete desítky lokálních včelařů z celé České republiky. Kontaktujte je přímo a domluvte se na odběru čerstvého medu – zaručeně pravého, zaručeně lokálního.

## Jak med správně skladovat?

Med skladujte při pokojové teplotě, daleko od tepla a přímého světla. Nepotřebuje lednici – má přirozené konzervační vlastnosti díky nízkému obsahu vody a kyselinám. Správně skladovaný med vydrží roky, egyptský med v hrobkách je starý tisíce let a stále poživatelný.`,
  },
  {
    id: 'b6',
    title: 'Přímý prodej z farmy: výhody pro obě strany',
    category: 'Životní styl',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    readTime: '4 min čtení',
    excerpt:
      'Přímý prodej zkracuje cestu od pole na váš stůl, přináší vyšší příjmy farmářům a čerstvější produkty zákazníkům. Proč na tom záleží?',
    coverGradient: 'from-teal-400 to-emerald-600',
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=480&fit=crop&q=80',
    slug: 'primy-prodej-z-farmy',
    author: 'Jan Novák',
    authorInitials: 'JN',
    authorColor: 'bg-teal-500',
    publishedAt: '25. února 2025',
    content: `Přímý prodej – kdy zákazník kupuje potraviny přímo od producenta bez zprostředkovatelů – není v Česku nový jev. Farmářské trhy, prodej ze dvora a bedýnkové systémy existují desítky let. Ale proč na tom záleží víc než kdy dřív?

## Problém s tradičním distribučním řetězcem

Typická cesta potraviny od farmáře k zákazníkovi vypadá takto: farmář → výkupní středisko → distributor → velkoobchod → supermarket → zákazník. Každý mezičlánek si bere marži a diktuje podmínky. Výsledek?

Farmář dostane za kilogram rajčat 4–6 Kč. Zákazník zaplatí 35–60 Kč za kilogram. Mezi polem a talířem zmizí 80–90 % hodnoty produktu.

Distribuční mezičlánky navíc vyžadují dlouhou trvanlivost – zelenina se sbírá nezralá, aby přežila transport a skladování. To kompromituje chuť i nutriční hodnotu.

## Co přímý prodej mění pro farmáře

Přímý prodej radikálně mění ekonomiku malé farmy. Místo 4–6 Kč za kilo rajčat může farmář dostat 30–50 Kč. To je 5–10× více za stejný produkt se stejnou prací.

**Stabilita příjmů.** Bedýnkové předplatné nebo pravidelní zákazníci dávají farmáři jistotu odbyt. Může plánovat setí, nákup, personál. Nemá strach, že mu distributor neodebere sklizeň.

**Svoboda sortimentu.** Distribuční řetězce chtějí unifikované produkty – rajčata musí mít přesnou velikost a barvu. Přímý prodej umožňuje pěstovat staré odrůdy, různobarevné zeleniny a speciální produkty, o které je zájem.

**Zpětná vazba.** Přímý kontakt se zákazníkem dává farmáři okamžitou zpětnou vazbu. Zákazník řekne, co mu chutná, co mu scházelo, co bylo jiné než předtím. Tohle distributor nikdy neřekne.

**Vztahy.** Mnozí farmáři říkají, že přímý prodej je pro ně i o vztazích. Znají své zákazníky jménem. Vědí, co jejich rodiny jedí. Těší se na farmářský trh, kde vidí stálé tváře. To je satisfakce, kterou trh s distributory nenabídne.

## Co přímý prodej mění pro zákazníky

**Čerstvost.** Zelenina sklizená ráno a prodaná odpoledne – to je přímý prodej. Rozdíl v chuti oproti zelenině, která cestovala týden distribučním řetězcem, je výrazný.

**Průhlednost.** Víte přesně, od koho kupujete, kde farma leží a jak farmář hospodaří. Můžete se kdykoliv přijet podívat. Tahle transparentnost v supermarketu neexistuje.

**Rozmanitost.** Přímý prodej umožňuje farmářům nabízet produkty, které by se do supermarketu nikdy nedostaly – netradiční odrůdy, malá množství, sezonní specialty.

**Nižší cena za kvalitu.** Přímý prodej bývá dražší než supermarket u komoditních produktů (mrkev, brambory). Ale u speciálních produktů – čerstvých vajec, sýrů, masa, medu – bývá cena srovnatelná nebo nižší, při dramaticky vyšší kvalitě.

**Příběh jídla.** Když víte, že vaječce snesla slepice jménem Pepička, která se celé léto pásla na louce v jihočeském statku, jídlo chutná jinak. Příběh je součástí hodnoty.

## Jak přímý prodej podpořit

Nejjednodušší způsob: navštivte farmářský trh ve vašem okolí nebo si na Mapě Farem najděte farmáře přímo ve vašem regionu a kontaktujte ho. Nemusíte hned odebírat bedýnku každý týden – začněte jednorázovým nákupem.

Každá koruna utracená přímo u farmáře jde na rozvoj farmy, ne do kapsy obchodního řetězce. A vy za to dostanete čerstvější, chutnější a průhlednější jídlo.

## Mapa Farem jako nástroj přímého prodeje

Mapa Farem je platforma, která přímý prodej usnadňuje. Místo zdlouhavého hledání farmáře přes Google nebo z doslechu si jednoduše otevřete mapu, vyhledáte farmáře ve svém okolí a kontaktujete ho přímo. Farmář dostane zákazníka, zákazník dostane čerstvé potraviny, peníze putují přímo k producentovi. Přesně tak to má fungovat.`,
  },
  {
    id: 'b1',
    title: 'Proč kupovat lokální potraviny? 7 důvodů, které vás přesvědčí',
    category: 'Životní styl',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    readTime: '5 min čtení',
    excerpt:
      'Lokální potraviny nejsou jen trend. Přinášejí zdravotní výhody, podporují lokální ekonomiku a snižují uhlíkovou stopu.',
    coverGradient: 'from-emerald-400 to-teal-500',
    coverImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=480&fit=crop&q=80',
    slug: 'proc-kupovat-lokalni-potraviny',
    author: 'Jana Horáčková',
    authorInitials: 'JH',
    authorColor: 'bg-emerald-500',
    publishedAt: '12. března 2025',
    content: `Lokální potraviny se v posledních letech staly stále populárnějším tématem. Ale proč vlastně? Je to jen módní trend nebo za tím stojí skutečné, pádné důvody?

## 1. Čerstvost a chuť

Lokální potraviny cestují kratší vzdálenost od pole na váš stůl. Zatímco rajče z supermarketu může být sklizeno ještě nezralé a dozrávat v přepravním kontejneru, rajče od místního farmáře dozreje přirozeně na slunci a ke stolu přijde v plné zralosti. Výsledek? Intenzivnější chuť, lepší vůně a vyšší obsah vitamínů a minerálů. Zkuste jednou ochutnat čerstvě utržené jahody přímo z pole – a zpátky do supermarketu se vám moc nechce.

## 2. Podpora místní ekonomiky

Když nakoupíte přímo u farmáře, peníze zůstávají ve vašem regionu. Farmář může investovat do rozvoje farmy, zaplatit místní zaměstnance a přispět k prosperitě obce. Ekonomové odhadují, že každá koruna utracená lokálně generuje až trojnásobný ekonomický efekt oproti tatáž koruně utracené v nadnárodním řetězci. Vaším nákupem tak nepřímo přispíváte k celkovému rozvoji svého okolí.

## 3. Menší uhlíková stopa

Průměrná potravina v supermarketu urazí přes 1 500 kilometrů, než se dostane na váš talíř. Transport je přitom zodpovědný za nezanedbatelnou část celkové uhlíkové stopy potravinového průmyslu. Lokální potraviny ujdou zlomek té vzdálenosti – místo kamionu stačí dodávka. Méně kilometrů znamená méně emisí CO₂, méně spotřeby pohonných hmot a menší dopad na klima. Pro ty, kdo chtějí snížit svou uhlíkovou stopu, je přechod na lokální nákupy jedním z nejjednodušších kroků.

## 4. Přímý vztah s farmářem

U lokálního farmáře víte přesně, kdo vaše jídlo vypěstoval, jaké metody používá a jak se stará o zvířata a půdu. Tento přímý kontakt buduje důvěru, kterou u anonymních průmyslových produktů nikdy nezískat nebudete. Farmář vám rád poradí, jak produkty nejlépe zpracovat, co je právě v sezóně nebo jak vybrat ten nejlepší kus. Takový osobní přístup v supermarketu hledáte marně.

## 5. Sezónní a rozmanité odrůdy

Lokální farmáři pěstují odrůdy přizpůsobené místním podmínkám – odrůdy, které v supermarketech prostě nenajdete, protože nejsou vhodné pro masovou produkci nebo dlouhý transport. Staré odrůdy rajčat, jablek nebo brambor mají jedinečné chuťové vlastnosti, které moderní průmyslové odrůdy ztrácejí v honbě za vzhledem a trvanlivostí. Nakupování v sezóně navíc přirozeně obohacuje váš jídelníček o rozmanitost a nutí vás ke kreativitě v kuchyni.

## 6. Lepší životní podmínky zvířat

Malé lokální farmy si mohou dovolit chovat zvířata přirozeným způsobem – na pastvinách, s přístupem na čerstvý vzduch a přirozené světlo, bez přeplněných hal. To se odráží nejen v etičtějším přístupu k živým tvorům, ale i v prokazatelně lepší kvalitě masa, mléka nebo vajec. Slepice s přístupem do výběhu snáší vejce s tmavě oranžovým žloutkem plným živin – to není marketingový trik, to je skutečný rozdíl.

## 7. Vzdělání pro děti

Pravidelné návštěvy farmy nebo výpravy na farmářský trh jsou pro děti nezapomenutelnou zkušeností. Pochopení toho, kde jídlo pochází, jak roste a kdo ho s péčí pěstuje, je základem zdravého vztahu k jídlu i přírodě. Děti, které vědí, jak vypadá čerstvě vytažená mrkev ze záhonu, mají přirozeně lepší vztah ke zelenině a jsou ochotnější ji ochutnávat.

## Jak začít?

Nemusíte hned celý jídelníček přeorientovat na lokální potraviny – to by bylo příliš ambiciózní a pravděpodobně by vás to odradilo. Začněte jednoduše: navštivte nejbližší farmářský trh, objednejte bedýnku zeleniny nebo si na Mapě Farem najděte farmáře přímo ve svém okolí. Stačí jeden krok a uvidíte, že rozdíl pocítíte okamžitě – v chuti, ve svědomí i v peněžence.

Lokální potraviny nejsou luxusem pro vyvolené. Jsou to každodenní volby, které postupně mění naši ekonomiku, zdraví i planetu k lepšímu. Zkuste to – stojí to za to!`,
  },
  {
    id: 'b2',
    title: 'Bedýnka zeleniny: kompletní průvodce pro začátečníky',
    category: 'Průvodce',
    categoryColor: 'bg-blue-100 text-blue-700',
    readTime: '7 min čtení',
    excerpt:
      'Jak vybrat správnou bedýnku, co v ní očekávat a jak zpracovat méně známou zeleninu. Vše, co potřebujete vědět.',
    coverGradient: 'from-green-400 to-emerald-600',
    coverImage: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&h=480&fit=crop&q=80',
    slug: 'bedynka-zeleniny-pruvodce',
    author: 'Tomáš Veselý',
    authorInitials: 'TV',
    authorColor: 'bg-blue-500',
    publishedAt: '5. února 2025',
    content: `Bedýnka zeleniny – pravidelná zásilka čerstvé, sezónní zeleniny přímo od farmáře – je skvělý způsob, jak jíst zdravě, lokálně a s vědomím původu toho, co jíte. Pro mnoho lidí je ale první bedýnka trochu výzvou: Co vlastně přijde? Jak to zpracovat? A co s kedlubenem?

## Co je bedýnka zeleniny?

Bedýnka (v zahraničí označovaná jako CSA – Community Supported Agriculture, tedy komunitou podporované zemědělství) je systém přímého propojení zákazníka s farmářem. Zákazník si předplatí pravidelné zásilky čerstvé zeleniny. Farmář na oplátku dostane jistotu odbytu a může plánovat pěstování. Obsah bedýnky určuje farmář podle toho, co právě roste a dozrává – dostanete vždy to nejčerstvější a nejlepší z aktuální sezóny.

## Typy bedýnek

Většina farmářů nabízí více velikostí a variant:

- **Malá bedýnka**: 4–5 druhů zeleniny, ideální pro jednotlivce nebo pár
- **Standardní bedýnka**: 6–8 druhů pro rodinu 2–3 osoby, nejoblíbenější varianta
- **Velká bedýnka**: 8–10 druhů pro větší domácnosti nebo vášnivé vařiče
- **Bedýnka s ovocem**: Kombinace zeleniny a sezónního ovoce – jahody, třešně, švestky…
- **Bylinková bedýnka**: Čerstvé bylinky pro kuchyni – bazalka, petržel, kopr, tymián

## Jak vybrat tu správnou bedýnku?

Než si objednáte, zamyslete se nad několika otázkami: Kolik lidí v domácnosti zeleninu jí? Jak moc jste odvážní při vaření? Máte čas a chuť zpracovat méně známé druhy? Menší bedýnka je vždy bezpečnější start – lépe přecenit zájem než skončit s plesnivou kapustou, protože jste nestíhali vařit.

## Méně známá zelenina a jak na ni

Tohle je nejčastější obava začátečníků. Co s ní? Nebojte se – s několika základními tipy zvládnete cokoliv.

**Kapusta** – Skvělá do polévky nebo orestovaná na másle s česnekem a špetkou muškátového oříšku. Mladé listy jdou i do salátu nebo jako základ pro smoothie. Robustní zimní zelenina plná vitamínu C.

**Kedluben** – Výborný syrový, nastrouhaný do salátu (zkuste s jablkem a citrónem) nebo nakrájený na tyčinky jako svačina. Dá se také restovat na másle nebo přidat do polévky. Chuť mírně připomíná brokolici stonky.

**Ředkev** – Pokud ji nastrouháte, posolíte a necháte 15 minut odlehnout, ztratí ostrý nádech a krásně změkne. Výborná do salátů, jako příloha nebo do asijsky laděných jídel.

**Pasterňák** – Podobný mrkvi, ale s intenzivnější, nasládlou a lehce ořechovou chutí. Výborný v zeleninovém vývaru, zapékaný do zlatova nebo jako pyré místo brambor.

**Mangold** – Listy připravte jako špenát (osmahněte na olivovém oleji s česnekem), robustní barevné řapíky jako chřest. Krásně vypadá a skvěle chutná.

**Cuketa** – Univerzální zelenina do polévky, na gril, do těstoviny, zapékané nebo syrová do salátu. Velké cuketynadívejte a zapečte v troubě.

## Praktické tipy pro zvládnutí bedýnky

**1. Zpracujte hned po doručení.** Čím čerstvější zelenina, tím lépe. Ideálně zpracujte do 3–5 dnů.

**2. Plánujte jídelníček podle bedýnky, ne obráceně.** Podívejte se, co přijde, a přizpůsobte vaření. Tohle je největší mentální přechod.

**3. Blanšírujte a mrazte.** Co nestíháte zpracovat, blanšírujte (30 sekund ve vroucí vodě, pak okamžitě do ledové) a zmrazte v sáčcích.

**4. Nastrouhaná zelenina do mrazáku.** Nakrouhaná mrkev, kedluben nebo cuketa v mrazáku je záchrana pro polévky, omáčky a bramboráky kdykoli potřebujete.

**5. Sdílejte s přáteli nebo sousedy.** Pokud máte přebytek, nabídněte okolí – budujete komunitu a nic nepřijde nazmar.

## Komunikujte s farmářem

Pokud vám přijde něco, s čím si nevíte rady, zeptejte se přímo farmáře. Napište zprávu přes Mapu Farem nebo zavolejte – farmáři mají rádi zákazníky, kteří se zajímají, a rádi poradí s přípravou.

## Jak začít?

Na Mapě Farem najdete farmáře ve vašem okolí, kteří bedýnky nabízejí. Stačí kliknout na detail farmy, kontaktovat farmáře a domluvit první dodávku. Většina farmářů ráda pošle první bedýnku bez závazků – vyzkoušejte to a uvidíte sami!`,
  },
  {
    id: 'b3',
    title: 'Jak poznám bio certifikaci? Průvodce ekologickým zemědělstvím',
    category: 'Bio & Eko',
    categoryColor: 'bg-amber-100 text-amber-700',
    readTime: '4 min čtení',
    excerpt:
      'Co skutečně znamená označení BIO, jak ho ověřit a proč se vyplatí hledat certifikované produkty od lokálních farmářů.',
    coverGradient: 'from-lime-400 to-green-500',
    coverImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&h=480&fit=crop&q=80',
    slug: 'jak-poznam-bio-certifikaci',
    author: 'Markéta Procházková',
    authorInitials: 'MP',
    authorColor: 'bg-amber-500',
    publishedAt: '28. ledna 2025',
    content: `Slovo „bio" je dnes všude – na obalech v supermarketech, v reklamách, na tržnicích a farmářských trzích. Ale co to vlastně znamená? Jak poznáte, že je produkt skutečně bio? A proč by vám to mělo záležet?

## Co je ekologické zemědělství?

Ekologické neboli bio zemědělství je způsob hospodaření, který se snaží pracovat v souladu s přírodními procesy, bez syntetických pesticidů, herbicidů a minerálních hnojiv. Bio zemědělci podporují biodiverzitu, zdraví půdy a přirozené koloběhy živin. Výsledkem je zdravější půda, čistší voda v krajině a potraviny bez zbytků syntetických chemikálií.

## Jak poznat skutečnou bio certifikaci?

Na bio produktech musíte najít tyto povinné prvky:

**Logo EU pro bio produkty** – Zelený list složený z bílých hvězdičkových teček na zeleném pozadí. Toto logo je od roku 2012 povinné pro všechny balené bio produkty prodávané na trhu EU. Pokud ho na produktu nevidíte, nejde o certifikované bio.

**Kód certifikačního orgánu** – Každý bio produkt musí obsahovat kód ve formátu CZ-BIO-XXX nebo XX-BIO-XXX (XX je kód státu). Tento kód identifikuje konkrétní organizaci, která certifikaci provedla a ověřila.

**Inspekční organizace v ČR:**
- KEZ o.p.s. (Kontrola ekologického zemědělství) – největší česká certifikační organizace
- ABCERT AG – mezinárodní certifikační orgán
- BIOKONT CZ, s.r.o. – certifikace pro ČR i export
- Bureau Veritas Czech Republic – globální certifikační firma

## Co bio certifikace skutečně zaručuje?

Bio certifikace zaručuje, že produkty nejsou ošetřovány syntetickými pesticidy a herbicidy, GMO (geneticky modifikované organismy) nejsou povoleny, zvířata mají přístup do venkovního prostředí a jsou chována přirozeným způsobem, farma prochází pravidelnou nezávislou kontrolou certifikačního orgánu a celý proces od výroby po balení odpovídá přísným standardům EU.

## Co bio certifikace nezaručuje?

Důležité je znát i hranice certifikace. Bio certifikace neznamená nutně lokální původ produktu – bio mango z Peru je stále bio, ale urazilo tisíce kilometrů. Neznamená ani malou rodinnou farmu – existují velké bio průmyslové farmy. A nezaručuje ani mimořádně vysokou nutriční hodnotu – vědecké výzkumy se v tomto bodě různí.

## Bio vs. lokální: co je důležitější?

Tato otázka nemá jednoduchou odpověď a záleží na vašich prioritách. Bio zelenina dovezená z jiného kontinentu má velkou uhlíkovou stopu. Lokální zelenina bez bio certifikace ale může být pěstována velmi šetrně – certifikace je totiž finančně i administrativně nákladná a mnoho malých farmářů si ji prostě nemůže dovolit, přestože hospodaří naprosto skvěle.

Ideální volba je tedy: **lokální + bio**. Pokud ale musíte volit jen jedno, místní farmář, kterého osobně znáte a jehož metody přibližně znáte, je často lepší volbou než anonymní bio produkt z druhého konce světa.

## Jak se zeptat farmáře?

Pokud farmář nemá bio certifikaci, ale tvrdí, že hospodaří šetrně, klidně se zeptejte:
- Používáte pesticidy? Jaké a v jakém množství?
- Jak hnojíte půdu?
- Jak řešíte nemoci plodin nebo zvířat?
- Uvažujete o bio certifikaci?

Upřímný farmář, který odpovídá transparentně a bez problémů, je dobrý signál. Na Mapě Farem najdete ověřené farmáře, kteří jsou otevření ohledně svých metod hospodaření – stačí se jim napsat nebo zavolat.

## Tipy pro začínající bio zákazníky

Začněte u produktů, kde rozdíl nejsilněji pocítíte: čerstvá zelenina a ovoce, mléčné výrobky a vejce. Pořiďte si jednou od stejného druhu bio i konvenční verzi a porovnejte chuť vlastním jazykem. Navštivte farmářský trh a pohovořte přímo s farmáři – tohle vám dá víc informací než jakýkoliv certifikát.

Bio zemědělství je důležitý krok správným směrem a certifikace je cenným nástrojem pro transparentnost. Ale začíná to vždy u znalosti a vztahu – a k tomu Mapa Farem pomáhá každý den.`,
  },
]

// ──────────────────────────────────────────────
// Seasonal products (homepage banner)
// ──────────────────────────────────────────────

export const SEASONAL_PRODUCTS = [
  'Jahody',
  'Chřest',
  'Špenát',
  'Ředkvičky',
  'Hrášek',
  'Salát',
  'Pažitka',
  'Rebarbora',
  'Medvědí česnek',
]

// ──────────────────────────────────────────────
// Seasonal calendar — /sezona page
// ──────────────────────────────────────────────

export interface SeasonalItem {
  name: string
  emoji: string
  category: import('@/types/farm').FarmCategory
  months: number[] // 1 = January … 12 = December
}

export const SEASONAL_CALENDAR: SeasonalItem[] = [
  { name: 'Jahody', emoji: '🍓', category: 'ovoce', months: [5, 6, 7] },
  { name: 'Maliny', emoji: '🍇', category: 'ovoce', months: [6, 7, 8] },
  { name: 'Borůvky', emoji: '🫐', category: 'ovoce', months: [7, 8] },
  { name: 'Třešně', emoji: '🍒', category: 'ovoce', months: [6, 7] },
  { name: 'Meruňky', emoji: '🍑', category: 'ovoce', months: [7, 8] },
  { name: 'Broskve', emoji: '🍑', category: 'ovoce', months: [7, 8, 9] },
  { name: 'Švestky', emoji: '🫐', category: 'ovoce', months: [8, 9, 10] },
  { name: 'Hrušky', emoji: '🍐', category: 'ovoce', months: [8, 9, 10] },
  { name: 'Jablka', emoji: '🍎', category: 'ovoce', months: [8, 9, 10, 11, 12, 1] },
  { name: 'Rebarbora', emoji: '🌿', category: 'ovoce', months: [4, 5, 6] },
  { name: 'Chřest', emoji: '🌱', category: 'zelenina', months: [4, 5, 6] },
  { name: 'Špenát', emoji: '🥬', category: 'zelenina', months: [3, 4, 5, 9, 10] },
  { name: 'Salát', emoji: '🥗', category: 'zelenina', months: [3, 4, 5, 6, 9, 10] },
  { name: 'Ředkvičky', emoji: '🌱', category: 'zelenina', months: [3, 4, 5, 6, 9, 10] },
  { name: 'Hrášek', emoji: '🫛', category: 'zelenina', months: [5, 6, 7] },
  { name: 'Rajčata', emoji: '🍅', category: 'zelenina', months: [7, 8, 9] },
  { name: 'Okurky', emoji: '🥒', category: 'zelenina', months: [7, 8, 9] },
  { name: 'Paprika', emoji: '🫑', category: 'zelenina', months: [7, 8, 9] },
  { name: 'Cuketa', emoji: '🥒', category: 'zelenina', months: [6, 7, 8, 9] },
  { name: 'Kedluben', emoji: '🌿', category: 'zelenina', months: [5, 6, 7, 8] },
  { name: 'Mrkev', emoji: '🥕', category: 'zelenina', months: [7, 8, 9, 10, 11, 12] },
  { name: 'Brambory', emoji: '🥔', category: 'zelenina', months: [7, 8, 9, 10, 11] },
  { name: 'Dýně', emoji: '🎃', category: 'zelenina', months: [9, 10, 11] },
  { name: 'Kapusta', emoji: '🥬', category: 'zelenina', months: [10, 11, 12, 1, 2, 3] },
  { name: 'Řepa', emoji: '🌱', category: 'zelenina', months: [9, 10, 11, 12] },
  { name: 'Medvědí česnek', emoji: '🌿', category: 'byliny', months: [3, 4, 5] },
  { name: 'Pažitka', emoji: '🌿', category: 'byliny', months: [3, 4, 5, 6, 7, 8, 9] },
  { name: 'Bazalka', emoji: '🌿', category: 'byliny', months: [6, 7, 8, 9] },
  { name: 'Med', emoji: '🍯', category: 'med', months: [6, 7, 8, 9] },
  { name: 'Vejce', emoji: '🥚', category: 'vejce', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
]

export const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
]

// ──────────────────────────────────────────────
// Kraj data — /kraje page
// ──────────────────────────────────────────────

export interface KrajData {
  name: string
  code: string
  emoji: string
  farmCount: number
  gradient: string
}

export const KRAJ_LIST: KrajData[] = [
  { name: 'Praha', code: 'Praha', emoji: '🏙️', farmCount: 18, gradient: 'from-blue-400 to-indigo-500' },
  { name: 'Středočeský', code: 'Středočeský', emoji: '🌾', farmCount: 34, gradient: 'from-emerald-400 to-teal-500' },
  { name: 'Jihočeský', code: 'Jihočeský', emoji: '🌲', farmCount: 28, gradient: 'from-green-500 to-emerald-600' },
  { name: 'Plzeňský', code: 'Plzeňský', emoji: '🍺', farmCount: 19, gradient: 'from-amber-400 to-yellow-500' },
  { name: 'Karlovarský', code: 'Karlovarský', emoji: '♨️', farmCount: 11, gradient: 'from-rose-400 to-pink-500' },
  { name: 'Ústecký', code: 'Ústecký', emoji: '⛰️', farmCount: 14, gradient: 'from-slate-400 to-gray-500' },
  { name: 'Liberecký', code: 'Liberecký', emoji: '🏔️', farmCount: 12, gradient: 'from-sky-400 to-blue-500' },
  { name: 'Královéhradecký', code: 'Královéhradecký', emoji: '🏰', farmCount: 21, gradient: 'from-violet-400 to-purple-500' },
  { name: 'Pardubický', code: 'Pardubický', emoji: '🌄', farmCount: 17, gradient: 'from-orange-400 to-amber-500' },
  { name: 'Vysočina', code: 'Vysočina', emoji: '🌿', farmCount: 22, gradient: 'from-lime-500 to-green-600' },
  { name: 'Jihomoravský', code: 'Jihomoravský', emoji: '🍷', farmCount: 31, gradient: 'from-red-400 to-rose-500' },
  { name: 'Olomoucký', code: 'Olomoucký', emoji: '🏛️', farmCount: 20, gradient: 'from-teal-400 to-cyan-500' },
  { name: 'Zlínský', code: 'Zlínský', emoji: '🌻', farmCount: 16, gradient: 'from-yellow-400 to-orange-500' },
  { name: 'Moravskoslezský', code: 'Moravskoslezský', emoji: '⚙️', farmCount: 24, gradient: 'from-gray-400 to-slate-600' },
]
