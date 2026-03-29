import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, ChevronRight, Eye } from 'lucide-react'
import type { Metadata } from 'next'
import { getFarmBySlug, getSimilarFarms, CATEGORY_LABELS, isFarmOpenNow } from '@/lib/farms'
import { FarmDetailClient } from '@/components/farms/FarmDetailClient'
import { ShareFarmButton } from '@/components/ui/ShareFarmButton'
import { FavoriteButton } from '@/components/farms/FavoriteButton'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { cn } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

// Generate on demand — too many farms to pre-build at compile time
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const farm = await getFarmBySlug(params.slug)
  if (!farm) return {}
  return {
    title: `${farm.name} – Mapa Farem`,
    description: farm.description,
    openGraph: {
      title: farm.name,
      description: farm.description,
      type: 'website',
      locale: 'cs_CZ',
    },
  }
}

const CATEGORY_GRADIENT: Record<string, string> = {
  zelenina: 'from-emerald-500 via-teal-500 to-cyan-600',
  ovoce: 'from-rose-400 via-pink-500 to-red-400',
  maso: 'from-amber-500 via-orange-500 to-red-500',
  mléko: 'from-sky-300 via-blue-400 to-indigo-400',
  vejce: 'from-yellow-300 via-amber-400 to-orange-400',
  med: 'from-amber-300 via-yellow-400 to-orange-300',
  byliny: 'from-lime-400 via-green-500 to-emerald-600',
  default: 'from-emerald-400 via-teal-500 to-green-600',
}

export default async function FarmDetailPage({ params }: PageProps) {
  const farm = await getFarmBySlug(params.slug)
  if (!farm) notFound()

  const similarFarms = await getSimilarFarms(farm.slug, farm.location.kraj)

  const isOpen = isFarmOpenNow(farm)
  const heroGradient = CATEGORY_GRADIENT[farm.categories[0]] ?? CATEGORY_GRADIENT.default

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: farm.name,
    description: farm.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: farm.location.address,
      addressLocality: farm.location.city,
      postalCode: farm.location.zip,
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: farm.location.lat,
      longitude: farm.location.lng,
    },
    ...(farm.contact.phone && { telephone: farm.contact.phone }),
    ...(farm.contact.email && { email: farm.contact.email }),
    ...(farm.contact.web && { url: farm.contact.web }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main>
        {/* Hero */}
        {(() => {
          const heroPhoto = farm.images?.[0] && !farm.images[0].includes('placeholder') ? farm.images[0] : null
          return (
            <section
              className={cn('relative h-[55vh] min-h-[360px] bg-gradient-to-br overflow-hidden', heroGradient)}
              aria-label={`Titulní fotografie farmy ${farm.name}`}
            >
              {heroPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroPhoto}
                  alt={farm.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="absolute inset-0 opacity-10" aria-hidden="true">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                  </svg>
                </div>
              )}
              {heroPhoto && (
                <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
              )}
              <div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent"
                aria-hidden="true"
              />
            </section>
          )
        })()}

        {/* Farm header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div
              className={cn(
                'w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-heading font-bold text-2xl flex-shrink-0 bg-gradient-to-br',
                heroGradient,
              )}
              aria-label={`Logo farmy ${farm.name}`}
            >
              {farm.name.charAt(0)}
            </div>

            <div className="flex-1 pb-1">
              <nav aria-label="Navigační cesta" className="flex items-center gap-1 text-xs text-neutral-400 mb-1.5">
                <Link href="/" className="hover:text-primary-600 transition-colors cursor-pointer">Domů</Link>
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
                <Link href="/mapa" className="hover:text-primary-600 transition-colors cursor-pointer">Farmy</Link>
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
                <span className="text-forest truncate max-w-[200px]">{farm.name}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-forest">
                  {farm.name}
                </h1>
                <ShareFarmButton name={farm.name} />
                <FavoriteButton
                  entry={{
                    slug: farm.slug,
                    name: farm.name,
                    categories: farm.categories,
                    kraj: farm.location.kraj,
                    savedAt: 0,
                  }}
                />
                {farm.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Ověřeno
                  </span>
                )}
                {(farm.viewCount ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    {farm.viewCount?.toLocaleString('cs-CZ')} zobrazení
                  </span>
                )}
                {farm.openingHours && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                      isOpen
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-500',
                    )}
                    aria-live="polite"
                  >
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {isOpen ? 'Nyní otevřeno' : 'Zavřeno'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                {farm.location.city}, {farm.location.kraj}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {farm.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-primary-100 text-primary-700"
                  >
                    {CATEGORY_LABELS[cat]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FarmDetailClient farm={farm} similarFarms={similarFarms} />
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
