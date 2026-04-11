import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getSupabaseServiceClient } from '@/lib/adminAuth'
import { pickArticleFields } from '../../articleFields'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { data, error } = await sb.from('articles').select('*').eq('id', params.id).single()
  if (error) {
    console.error('[admin/blog GET id]', error)
    return NextResponse.json({ error: 'Článek nebyl nalezen.' }, { status: 404 })
  }
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const body = await req.json()
  const payload = pickArticleFields(body)
  const { error } = await sb.from('articles').update(payload).eq('id', params.id)
  if (error) {
    console.error('[admin/blog PUT]', error)
    return NextResponse.json({ error: 'Článek se nepodařilo aktualizovat.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const sb = getSupabaseServiceClient()
  if (!sb) return NextResponse.json({ error: 'Server error' }, { status: 500 })

  const { error } = await sb.from('articles').delete().eq('id', params.id)
  if (error) {
    console.error('[admin/blog DELETE]', error)
    return NextResponse.json({ error: 'Článek se nepodařilo smazat.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

