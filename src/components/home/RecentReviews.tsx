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

  return (
    <section className="py-16 lg:py-24 bg-surface" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedSection className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-earth-700 uppercase tracking-widest mb-3">
            Recenze zákazníků
          </span>
          <h2
            id="reviews-heading"
            className="font-heading text-3xl lg:text-4xl font-bold text-forest"
          >
            Co říkají zákazníci
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <AnimatedSection
              key={review.id}
              delay={(i * 100) as 0 | 100 | 200}
              className="relative flex flex-col bg-white rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Decorative quote */}
              <div
                className="absolute top-4 right-5 font-heading text-8xl text-primary-100 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5" aria-label={`${review.rating} z 5 hvězd`} role="img">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={cn(
                      'w-4 h-4',
                      idx < review.rating ? 'text-earth-400 fill-earth-400' : 'text-gray-200 fill-gray-200',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 mb-6">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                <div
                  className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0 shadow-sm"
                  aria-hidden="true"
                >
                  {review.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-heading font-semibold text-forest text-sm">{review.display_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
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
    </section>
  )
}
