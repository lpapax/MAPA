import type { BlogArticle } from '@/data/mockData'

export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    'Recepty': 'bg-rose-100 text-rose-700',
    'Průvodce': 'bg-blue-100 text-blue-700',
    'Sezóna': 'bg-amber-100 text-amber-700',
    'Trhy': 'bg-violet-100 text-violet-700',
    'Farmáři': 'bg-green-100 text-green-700',
    'Obecné': 'bg-neutral-100 text-neutral-700',
  }
  return map[category] ?? 'bg-primary-100 text-primary-700'
}

export function mapArticleRow(row: Record<string, unknown>): BlogArticle {
  const author = typeof row.author === 'string' ? row.author : ''
  const publishedAt = typeof row.published_at === 'string' ? row.published_at : new Date().toISOString()
  return {
    id: String(row.id ?? ''),
    slug: typeof row.slug === 'string' ? row.slug : '',
    title: typeof row.title === 'string' ? row.title : '',
    excerpt: typeof row.excerpt === 'string' ? row.excerpt : '',
    content: typeof row.content === 'string' ? row.content : '',
    coverImage: typeof row.cover_image === 'string' ? row.cover_image : '',
    coverGradient: typeof row.cover_gradient === 'string' ? row.cover_gradient : 'from-primary-400 to-teal-500',
    category: typeof row.category === 'string' ? row.category : '',
    categoryColor: getCategoryColor(typeof row.category === 'string' ? row.category : ''),
    author,
    authorInitials: typeof row.author_initials === 'string' ? row.author_initials : initials(author),
    authorColor: 'bg-primary-600',
    readTime: typeof row.read_time === 'string' ? row.read_time : '5 min čtení',
    publishedAt: new Date(publishedAt).toLocaleDateString('cs-CZ', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
  }
}
