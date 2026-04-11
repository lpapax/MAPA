import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getSupabaseServiceClient } from '@/lib/adminAuth'
import { pickArticleFields } from '../articleFields'

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { data, error } = await sb
    .from('articles')
    .select('id,slug,title,category,draft,published_at,author,read_time')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[admin/blog GET]', error)
    return NextResponse.json({ error: 'Nepodařilo se načíst články.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}


export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const body = await req.json()
  const payload = pickArticleFields(body)
  const { data, error } = await sb.from('articles').insert(payload).select('id,slug').single()
  if (error) {
    console.error('[admin/blog POST]', error)
    return NextResponse.json({ error: 'Článek se nepodařilo vytvořit.' }, { status: 500 })
  }
  return NextResponse.json({ data })
}
