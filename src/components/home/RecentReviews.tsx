import { Star } from 'lucide-react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import type { ReviewRow } from '@/types/database'

export async function RecentReviews() {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error || !data || data.length === 0) return null

  const reviews = data as ReviewRow[]
  const [featured, ...rest] = reviews

  return (
    <section className="relative py-16 lg:py-24 bg-surface overflow-hidden" aria-labelledby="reviews-heading">
      {/* Subtle background photo — very low opacity for warmth */}
      <img
        src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=50"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none select-none"
        loading="lazy"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header — left-aligned */}
        <AnimatedSection className="mb-12">
          <span className="inline-block text-earth-700 text-sm font-medium italic mb-3">
            Recenze zákazníků
          </span>
          <h2
            id="reviews-heading"
            className="font-heading text-3xl lg:text-4xl font-bold text-forest tracking-tight"
          >
            Co říkají zákazníci
          </h2>
        </AnimatedSection>

        {/* Asymmetric layout: featured left 55% + stacked right 45% */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-5">

          {/* Featured review — large quote treatment */}
          <AnimatedSection className="lg:col-span-6">
            <div className="relative h-full flex flex-col bg-forest rounded-2xl p-8 lg:p-10 overflow-hidden">
              {/* Large decorative opening quote */}
              <span
                className="absolute top-4 left-6 font-heading text-[8rem] leading-none text-primary-800 select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10" aria-label={`${featured.rating} z 5 hvězd`} role="img">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      'w-5 h-5',
                      idx < featured.rating ? 'text-earth-400 fill-earth-400' : 'text-white/20 fill-white/20',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 relative z-10">
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed font-heading">
                  &ldquo;{featured.text}&rdquo;
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                <div
                  className="w-11 h-11 rounded-xl bg-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  aria-hidden="true"
                >
                  {featured.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-heading font-semibold text-white text-sm">{featured.display_name}</div>
                  <div className="text-white/45 text-xs mt-0.5">
                    {featured.city} ·{' '}
                    <Link
                      href={`/farmy/${featured.farm_slug}`}
                      className="hover:text-primary-300 transition-colors"
                    >
                      zobrazit farmu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Stacked secondary reviews */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {rest.slice(0, 2).map((review, i) => (
              <AnimatedSection
                key={review.id}
                delay={(i * 100) as 0 | 100}
                className="flex flex-col bg-white rounded-xl p-6 border border-neutral-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 flex-1"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4" aria-label={`${review.rating} z 5 hvězd`} role="img">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        'w-3.5 h-3.5',
                        idx < review.rating ? 'text-earth-400 fill-earth-400' : 'text-neutral-200 fill-neutral-200',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 mb-5">
                  <p className="text-sm text-neutral-600 leading-relaxed italic line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                  <div
                    className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0"
                    aria-hidden="true"
                  >
                    {review.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-forest text-xs">{review.display_name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {review.city} ·{' '}
                      <Link href={`/farmy/${review.farm_slug}`} className="hover:text-primary-600 transition-colors">
                        zobrazit farmu
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
