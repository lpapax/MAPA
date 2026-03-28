'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ArrowLeft } from 'lucide-react'

interface StoredReview {
  name: string
  city: string
  rating: number
  text: string
  date: string
}

interface ReviewWithFarm {
  farmSlug: string
  farmName: string
  review: StoredReview
}

function readAllReviews(): ReviewWithFarm[] {
  if (typeof window === 'undefined') return []
  const results: ReviewWithFarm[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('mf_reviews_')) continue
      const farmSlug = key.replace('mf_reviews_', '')
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const reviews = JSON.parse(raw) as StoredReview[]
      if (!Array.isArray(reviews)) continue
      reviews.forEach((r) => {
        results.push({
          farmSlug,
          farmName: farmSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          review: r,
        })
      })
    }
  } catch {
    // ignore storage errors
  }
  return results.sort((a, b) => new Date(b.review.date).getTime() - new Date(a.review.date).getTime())
}

export function MyReviewsClient() {
  const [reviews, setReviews] = useState<ReviewWithFarm[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setReviews(readAllReviews())
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-earth-50 flex items-center justify-center mb-5">
          <Star className="w-8 h-8 text-earth-300" aria-hidden="true" />
        </div>
        <h2 className="font-heading font-bold text-forest text-xl mb-2">Žádné recenze</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
          Navštivte farmu a zanechte recenzi na záložce Recenze v detailu farmy.
        </p>
        <Link
          href="/mapa"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
        >
          Procházet farmy
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Link
        href="/profil"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-forest transition-colors mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Zpět na profil
      </Link>

      {reviews.map(({ farmSlug, farmName, review }, idx) => (
        <div key={`${farmSlug}-${idx}`} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <Link
                href={`/farmy/${farmSlug}`}
                className="font-heading font-semibold text-forest text-sm hover:text-primary-700 transition-colors"
              >
                {farmName}
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={s <= review.rating ? 'w-4 h-4 text-earth-400 fill-earth-400' : 'w-4 h-4 text-gray-200'}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
          {review.text && <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>}
          <p className="text-xs text-gray-400 mt-2">{review.name}{review.city ? `, ${review.city}` : ''}</p>
        </div>
      ))}
    </div>
  )
}
