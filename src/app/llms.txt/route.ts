import { NextResponse } from 'next/server'
import { getAllFarms } from '@/lib/farms'

export const revalidate = 3600 // regenerate hourly

export async function GET() {
  const farms = await getAllFarms()
  const farmCount = farms.length
  const krajCount = new Set(farms.map(f => f.location.kraj)).size

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mapafarem.cz'

  const body = `# Mapa Farem

> Největší česká online databáze farem s přímým prodejem. Propojujeme zákazníky s ${farmCount}+ farmami ve všech ${krajCount} krajích České republiky. Vše zdarma, bez provizí.

Mapa Farem je adresář českých farem nabízejících přímý prodej zákazníkům. Databáze obsahuje farmy prodávající zeleninu, ovoce, maso, mléčné výrobky, vejce, med, pečivo, sýry, víno, byliny, ryby a další produkty. Každá farma má vlastní detail stránku s popisem, kategorií produktů, kontaktem, polohou na mapě a otevírací dobou.

## Klíčové stránky

- [Úvod](${base}/): Hlavní stránka s přehledem projektu, statistikami a výběrem farem
- [Interaktivní mapa](${base}/mapa): Mapa všech ${farmCount} farem s filtrováním podle kategorie, kraje a otevírací doby
- [Žebříček farem](${base}/zebricek): Top 20 nejnavštěvovanějších farem podle kategorií
- [Kraje](${base}/kraje): Přehled farem podle krajů ČR
- [Farmářské trhy](${base}/trhy): Databáze farmářských trhů v České republice
- [Sezónní kalendář](${base}/sezona): Průvodce sezónností ovoce a zeleniny v ČR
- [Certifikace](${base}/certifikace): Průvodce bio a ekologickými certifikacemi v ČR
- [Blog](${base}/blog): Články o lokálních potravinách, farmářství a sezónním vaření
- [Pro farmáře](${base}/pro-farmary): Informace pro farmáře o přidání farmy do databáze
- [Přidat farmu](${base}/pridat-farmu): Formulář pro registraci nové farmy
- [O projektu](${base}/o-projektu): Informace o Mapa Farem
- [Kontakt](${base}/kontakt): Kontaktní formulář

## Farmy

Každá farma je dostupná na adrese \`${base}/farmy/{slug}\`. Stránka farmy obsahuje:
- Název, popis a kategorie produktů
- Adresu, kraj a polohu na mapě (GPS souřadnice)
- Kontakt (telefon, e-mail, web, sociální sítě)
- Otevírací dobu
- Fotografie
- Recenze zákazníků
- Google recenze (pokud existují)
- Podobné farmy ve stejném kraji

## API (veřejné endpointy)

- \`GET ${base}/api/search?q={dotaz}\` — fulltextové vyhledávání farem, max 5 výsledků
- \`GET ${base}/api/markets\` — seznam farmářských trhů
- \`GET ${base}/api/blog\` — seznam blogových článků
- \`GET ${base}/sitemap.xml\` — sitemap se všemi URL

## Kategorie farem

zelenina, ovoce, maso, mléko, vejce, med, chléb (pečivo), sýry, víno, byliny, ryby, ostatní

## Kraje

Hlavní město Praha, Středočeský kraj, Jihočeský kraj, Plzeňský kraj, Karlovarský kraj, Ústecký kraj, Liberecký kraj, Královéhradecký kraj, Pardubický kraj, Kraj Vysočina, Jihomoravský kraj, Olomoucký kraj, Zlínský kraj, Moravskoslezský kraj

## Technické informace

- Jazyk: čeština (cs-CZ)
- Zaměření: Česká republika
- Data: aktualizována průběžně
- Provozovatel: Mapa Farem (mapafarem.cz)
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
