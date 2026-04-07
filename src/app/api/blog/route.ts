import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { BLOG_ARTICLES } from '@/data/mockData'

export const revalidate = 300 // 5 min cache

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ articles: BLOG_ARTICLES })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = createClient<any>(url, key)
  const { data, error } = await sb
    .from('articles')
    .select('*')
    .eq('draft', false)
    .order('published_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return NextResponse.json({ articles: BLOG_ARTICLES })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articles = data.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image ?? '',
    coverGradient: row.cover_gradient ?? 'from-primary-400 to-teal-500',
    category: row.category,
    categoryColor: getCategoryColor(row.category),
    author: row.author,
    authorInitials: row.author_initials ?? initials(row.author),
    authorColor: 'bg-primary-600',
    readTime: row.read_time ?? '5 min čtení',
    publishedAt: new Date(row.published_at).toLocaleDateString('cs-CZ', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
  }))

  return NextResponse.json({ articles })
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function getCategoryColor(category: string): string {
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
