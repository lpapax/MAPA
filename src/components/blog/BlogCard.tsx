import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { BlogArticle } from '@/data/mockData'

interface BlogCardProps {
  article: BlogArticle
  className?: string
}

export function BlogCard({ article, className }: BlogCardProps) {
  return (
    <Link href={`/blog/${article.slug}`} className={cn('group block', className)}>
      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card transition-all duration-200 overflow-hidden h-full flex flex-col">
        {/* Cover */}
        <div
          className={cn('h-44 bg-gradient-to-br flex-shrink-0', article.coverGradient)}
          aria-hidden="true"
        >
          <div className="w-full h-full flex items-end p-4">
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', article.categoryColor)}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h2 className="font-heading font-bold text-forest text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {article.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px]', article.authorColor)}>
                {article.authorInitials}
              </div>
              <span>{article.author}</span>
            </div>
            <span>{article.readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
