'use client'

import { useEffect, useState } from 'react'
import { getSupabaseRaw } from '@/lib/supabase'
import { Star, Trash2, ExternalLink } from 'lucide-react'

interface Review {
  id: string
  farm_slug: string
  display_name: string
  city: string
  rating: number
  text: string
  created_at: string
}

export default function AdminRecenze() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const sb = getSupabaseRaw()
      if (!sb) { setLoading(false); return }
      const { data } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      setReviews((data as Review[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function deleteReview(id: string) {
    if (!confirm('Opravdu smazat recenzi?')) return
    setDeleting(id)
    const sb = getSupabaseRaw()
    if (!sb) { setDeleting(null); return }
    await sb.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-forest">Recenze</h1>
        <p className="text-sm text-neutral-500 mt-1">{reviews.length} recenzí</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 animate-pulse shadow-card" />
          ))
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-card">
            <Star size={32} className="text-neutral-200 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm">Žádné recenze</p>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-forest">{review.display_name}</span>
                  <span className="text-xs text-neutral-400">{review.city}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? 'text-earth-400 fill-earth-400' : 'text-neutral-200'}
                      />
                    ))}
                  </div>
                  <a
                    href={`/farmy/${review.farm_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-500 hover:underline flex items-center gap-0.5"
                  >
                    {review.farm_slug}
                    <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-sm text-neutral-600">{review.text}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString('cs', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => deleteReview(review.id)}
                disabled={deleting === review.id}
                className="text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-50 shrink-0"
                title="Smazat recenzi"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
