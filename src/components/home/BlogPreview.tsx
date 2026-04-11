'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import { BLOG_ARTICLES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function BlogPreview() {
  const [feature, ...rest] = BLOG_ARTICLES.slice(0, 3)
  const secondary = rest.slice(0, 2)

  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="relative">
            <span
              className="absolute -left-1 -top-4 font-heading font-bold text-neutral-100 select-none pointer-events-none leading-none"
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
              aria-hidden="true"
            >
              03
            </span>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-500 font-bold mb-3">
                Blog
              </p>
              <h2
                id="blog-heading"
                className="font-heading font-bold text-forest leading-tight tracking-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Tipy a inspirace
              </h2>
            </div>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer flex-shrink-0 group pb-1"
          >
            Všechny články
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Asymmetric grid: feature 7/12 + two stacked 5/12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Feature article */}
          <AnimatedSection className="lg:col-span-7">
            <Link
              href={`/blog/${feature.slug}`}
              className="group flex flex-col h-full rounded-2xl overflow-hidden bg-surface border border-neutral-100 hover:shadow-card-hover transition-[transform,box-shadow] duration-300 cursor-pointer hover:-translate-y-1"
              aria-label={`Číst článek: ${feature.title}`}
            >
              <div className="relative h-64 lg:h-80 overflow-hidden" aria-hidden="true">
                <Image
                  src={feature.coverImage}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', feature.categoryColor)}>
                    {feature.category}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {feature.readTime}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-white">
                <h3 className="font-heading font-bold text-forest text-xl leading-snug mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-5 flex-1">
                  {feature.excerpt}
                </p>
                <span className="text-sm font-semibold text-primary-600 inline-flex items-center gap-1.5">
                  Číst více
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </AnimatedSection>

          {/* Two stacked secondary articles */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {secondary.map((article, i) => (
              <AnimatedSection key={article.id} delay={(i * 120) as 0 | 120}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex gap-4 rounded-2xl overflow-hidden bg-surface border border-neutral-100 hover:shadow-card-hover transition-[transform,box-shadow] duration-300 cursor-pointer hover:-translate-y-0.5 flex-1"
                  aria-label={`Číst článek: ${article.title}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-32 sm:w-40 flex-shrink-0 overflow-hidden" aria-hidden="true">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="160px"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2', article.categoryColor)}>
                        {article.category}
                      </span>
                      <h3 className="font-heading font-bold text-forest text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-neutral-400 text-xs">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {article.readTime}
                      </span>
                      <span className="text-xs font-semibold text-primary-600 inline-flex items-center gap-1 ml-auto">
                        Číst
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
