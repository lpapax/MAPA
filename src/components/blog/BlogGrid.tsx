'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BLOG_ARTICLES, type BlogArticle } from '@/data/mockData'
import { BlogCard } from './BlogCard'

export function BlogGrid() {
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES)
  const [activeCategory, setActiveCategory] = useState('Vše')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then((data: { articles?: BlogArticle[] }) => {
        if (data.articles && data.articles.length > 0) setArticles(data.articles)
      })
      .catch(() => null)
  }, [])

  const allCategories = useMemo(
    () => ['Vše', ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles],
  )

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory === 'Vše' || article.category === activeCategory
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div>
      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hledat v článcích…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all bg-white"
            aria-label="Hledat v článcích"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              aria-label="Vymazat hledání"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtry kategorií">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-400 hover:text-primary-600',
              )}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-sm">Žádné články nenalezeny.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('Vše') }}
            className="mt-3 text-primary-600 text-sm hover:underline cursor-pointer"
          >
            Zrušit filtry
          </button>
        </div>
      )}

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-xs text-neutral-400 mt-6 text-center">
          Zobrazeno {filtered.length} {filtered.length === 1 ? 'článek' : filtered.length < 5 ? 'články' : 'článků'}
        </p>
      )}
    </div>
  )
}
