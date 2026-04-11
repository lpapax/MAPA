import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { getAllFarms } from '@/lib/farms'
import { KRAJ_LIST } from '@/data/mockData'
import { CATEGORY_META } from '@/lib/farms'
import type { Farm } from '@/types/farm'
import { safeJsonLd } from '@/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  return KRAJ_LIST.map((k) => ({ slug: k.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const kraj = KRAJ_LIST.find((k) => k.slug === params.slug)
  if (!kraj) return {}

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mapafarem.cz'
  const title = `Farmy s přímým prodejem — ${kraj.name} kraj | Mapa Farem`
  const description = `Objevte farmy s přímým prodejem v ${kraj.name === 'Praha' ? 'Praze' : `${kraj.name} kraji`}. Zelenina, maso, mléko, vejce, med a další produkty přímo od farmářů. Aktualizovaná databáze ${kraj.farmCount}+ farem.`

  return {
    title,
    description,
    alternates: { canonical: `${base}/kraje/${kraj.slug}` },
    openGraph: {
      title,
      description,
      url: `${base}/kraje/${kraj.slug}`,
      type: 'website',
    },
  }
}

function FarmCard({ farm }: { farm: Farm }) {
  const img = farm.images?.[0] ?? ''
  const photo = img.startsWith('http') && !img.includes('placeholder') ? img : null
  const primaryCat = farm.categories?.[0]
  const catMeta = primaryCat ? CATEGORY_META[primaryCat] : null

  return (
    <Link
      href={`/farmy/${farm.slug}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-card hover:shadow-card-hover transition-[transform,box-shadow] overflow-hidden"
    >
      <div className="relative h-36 bg-gradient-to-br from-primary-50 to-emerald-50 overflow-hidden">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={farm.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            {catMeta?.emoji ?? '🌾'}
          </div>
        )}
        {farm.verified && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-primary-700 border border-primary-100">
            Ověřeno
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-forest text-sm leading-tight mb-1 group-hover:text-primary-700 transition-colors line-clamp-1">
          {farm.name}
        </h3>
        <p className="text-xs text-neutral-400 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {farm.location.city}
        </p>
        <div className="flex flex-wrap gap-1">
          {farm.categories.slice(0, 3).map((cat) => {
            const m = CATEGORY_META[cat]
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-700"
              >
                {m?.emoji} {m?.label}
              </span>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export default async function KrajPage({ params }: { params: { slug: string } }) {
  const kraj = KRAJ_LIST.find((k) => k.slug === params.slug)
  if (!kraj) notFound()

  const allFarms = await getAllFarms()
  const farms = allFarms.filter((f) => f.location.kraj === kraj.code)

  // Compute category breakdown
  const catCounts: Record<string, number> = {}
  for (const farm of farms) {
    for (const cat of farm.categories ?? []) {
      catCounts[cat] = (catCounts[cat] ?? 0) + 1
    }
  }
  const topCats = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mapafarem.cz'
  const krajLabel = kraj.name === 'Praha' ? 'Praze' : `${kraj.name} kraji`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Farmy s přímým prodejem — ${kraj.name}`,
    description: `Přehled farem s přímým prodejem v ${krajLabel}.`,
    url: `${base}/kraje/${kraj.slug}`,
    numberOfItems: farms.length,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Domů', item: base },
        { '@type': 'ListItem', position: 2, name: 'Kraje', item: `${base}/kraje` },
        { '@type': 'ListItem', position: 3, name: kraj.name, item: `${base}/kraje/${kraj.slug}` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-[100dvh] bg-surface pt-20 pb-20">

        {/* Hero */}
        <section className="bg-white border-b border-neutral-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-5">
              <Link href="/" className="hover:text-primary-600 transition-colors">Domů</Link>
              <span>/</span>
              <Link href="/kraje" className="hover:text-primary-600 transition-colors">Kraje</Link>
              <span>/</span>
              <span className="text-forest font-medium">{kraj.name}</span>
            </nav>
            <div className="flex items-start gap-4">
              <span className="text-4xl sm:text-5xl" aria-hidden="true">{kraj.emoji}</span>
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest leading-tight">
                  Farmy s přímým prodejem — {kraj.name}
                </h1>
                <p className="text-neutral-500 mt-2 text-base sm:text-lg leading-relaxed max-w-2xl">
                  {farms.length > 0
                    ? `Nalezli jsme ${farms.length} farem v ${krajLabel}, které nabízejí přímý prodej zákazníkům.`
                    : `Databáze farem v ${krajLabel}.`
                  } Kupujte přímo od farmářů — čerstvé potraviny bez prostředníků.
                </p>
                {topCats.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {topCats.map(([cat, count]) => {
                      const m = CATEGORY_META[cat as keyof typeof CATEGORY_META]
                      return (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100"
                        >
                          {m?.emoji} {m?.label}
                          <span className="text-primary-400 font-normal ml-0.5">{count}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Map CTA */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <h2 className="font-heading text-xl font-bold text-forest">
              {farms.length} {farms.length === 1 ? 'farma' : farms.length < 5 ? 'farmy' : 'farem'} v {kraj.name === 'Praha' ? 'Praze' : `${kraj.name} kraji`}
            </h2>
            <div className="flex items-center gap-3">
              <Link
                href={`/mapa?kraj=${encodeURIComponent(kraj.code)}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Zobrazit na mapě
              </Link>
            </div>
          </div>

          {/* Farm grid */}
          {farms.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {farms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm">Zatím žádné farmy v databázi.</p>
              <Link href="/pridat-farmu" className="inline-flex items-center gap-2 mt-4 text-primary-600 text-sm font-medium hover:underline">
                Přidat farmu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Cross-links to other kraje */}
          <section className="mt-16 pt-10 border-t border-neutral-100">
            <h2 className="font-heading text-lg font-bold text-forest mb-5">Ostatní kraje</h2>
            <div className="flex flex-wrap gap-2">
              {KRAJ_LIST.filter((k) => k.slug !== params.slug).map((k) => (
                <Link
                  key={k.slug}
                  href={`/kraje/${k.slug}`}
                  className="px-3 py-1.5 rounded-xl text-sm border border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700 transition-colors bg-white"
                >
                  {k.emoji} {k.name}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
