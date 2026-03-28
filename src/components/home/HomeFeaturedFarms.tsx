import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getHomepageFarms } from '@/lib/farms'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { HomeFarmCardsGrid } from './HomeFarmCards'

export async function HomeFeaturedFarms() {
  const farms = await getHomepageFarms(6)
  if (farms.length === 0) return null

  const [spotlight, ...rest] = farms

  return (
    <section className="py-16 lg:py-24 bg-surface" aria-labelledby="featured-farms-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-earth-700 uppercase tracking-widest mb-3">
              Farmy v adresáři
            </span>
            <h2
              id="featured-farms-heading"
              className="font-heading text-3xl lg:text-4xl font-bold text-forest"
            >
              Objevte místní farmáře
            </h2>
          </div>
          <Link
            href="/mapa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group"
          >
            Zobrazit všechny farmy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </AnimatedSection>

        <HomeFarmCardsGrid spotlight={spotlight} rest={rest} />
      </div>
    </section>
  )
}
