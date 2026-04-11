import { NextResponse } from 'next/server'
import { getSupabaseRaw } from '@/lib/supabase'
import { BLOG_ARTICLES } from '@/data/mockData'
import { mapArticleRow } from '@/lib/blogHelpers'

export const revalidate = 300 // 5 min cache

const ARTICLE_COLUMNS = 'id,slug,title,excerpt,content,cover_image,cover_gradient,category,author,author_initials,read_time,published_at'

export async function GET() {
  const sb = getSupabaseRaw()

  if (!sb) {
    return NextResponse.json({ articles: BLOG_ARTICLES })
  }

  const { data, error } = await sb
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('draft', false)
    .order('published_at', { ascending: false })

  if (error || !data || data.length === 0) {
    return NextResponse.json({ articles: BLOG_ARTICLES })
  }

  const articles = (data as Record<string, unknown>[]).map(mapArticleRow)
  return NextResponse.json({ articles })
}
