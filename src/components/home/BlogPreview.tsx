import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import { BLOG_ARTICLES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function BlogPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-semibold text-earth-700 uppercase tracking-widest mb-3">
              Blog
            </span>
            <h2
              id="blog-heading"
              className="font-heading text-3xl lg:text-4xl font-bold text-forest"
            >
              Tipy a inspirace
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group"
          >
            Všechny články
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Article cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((article, i) => (
            <AnimatedSection key={article.id} delay={(i * 100) as 0 | 100 | 200}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-surface border border-earth-50 hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:scale-[1.01]"
                aria-label={`Číst článek: ${article.title}`}
              >
                {/* Cover */}
                <div className="h-48 relative overflow-hidden" aria-hidden="true">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Reading time badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium z-10">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {article.readTime}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 bg-white">
                  {/* Category */}
                  <span
                    className={cn(
                      'self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3',
                      article.categoryColor,
                    )}
                  >
                    {article.category}
                  </span>

                  <h3 className="font-heading font-bold text-forest text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                    {article.excerpt}
                  </p>

                  <span className="text-xs font-semibold text-primary-600 inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Číst více <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
