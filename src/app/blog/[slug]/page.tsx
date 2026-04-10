import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronRight, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { ShareButton } from '@/components/blog/ShareButton'
import { BLOG_ARTICLES } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = BLOG_ARTICLES.find((a) => a.slug === params.slug)
  if (!article) return {}
  return {
    title: `${article.title} – Blog – Mapa Farem`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      locale: 'cs_CZ',
    },
  }
}

export default function BlogArticlePage({ params }: PageProps) {
  const article = BLOG_ARTICLES.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const otherArticles = BLOG_ARTICLES.filter((a) => a.id !== article.id)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface pb-20 pt-24">
        {/* Hero */}
        <div className={cn('relative h-64 sm:h-80 bg-gradient-to-br', article.coverGradient)}>
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-4xl mx-auto">
            <span className={cn('self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-3', article.categoryColor)}>
              {article.category}
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Navigační cesta" className="flex items-center gap-1 text-xs text-neutral-400 mt-6 mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors">Domů</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-forest truncate max-w-[200px]">{article.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article body */}
            <article className="lg:col-span-2">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-8 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px]', article.authorColor)}>
                    {article.authorInitials}
                  </div>
                  <span className="text-neutral-600 font-medium">{article.author}</span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {article.readTime}
                </span>
              </div>

              {/* Content — rendered client-side to avoid RSC boundary issues */}
              <ArticleContent content={article.content} />

              {/* Share */}
              <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Zpět na blog
                </Link>
                <ShareButton title={article.title} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-4">
              <h2 className="font-heading font-bold text-forest text-base mb-4">Další články</h2>
              {otherArticles.map((other) => (
                <Link key={other.id} href={`/blog/${other.slug}`} className="group block">
                  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-card transition-[box-shadow] duration-200 overflow-hidden flex">
                    <div className={cn('w-20 flex-shrink-0 bg-gradient-to-br', other.coverGradient)} aria-hidden="true" />
                    <div className="p-4">
                      <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', other.categoryColor)}>
                        {other.category}
                      </span>
                      <p className="font-heading font-semibold text-forest text-sm mt-1 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {other.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">{other.readTime}</p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl border border-primary-100 p-5 mt-6">
                <h3 className="font-heading font-bold text-forest text-sm mb-2">Najděte farmu ve svém okolí</h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  Stovky ověřených farem z celé České republiky.
                </p>
                <Link
                  href="/mapa"
                  className="block text-center py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors duration-200"
                >
                  Otevřít mapu farem
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  )
}
