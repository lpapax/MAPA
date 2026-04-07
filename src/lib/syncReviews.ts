// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = any

interface StoredReview {
  name: string
  city: string
  rating: number
  text: string
  date: string
}

/**
 * Syncs all localStorage reviews (mf_reviews_*) for a specific farm to Supabase.
 * Clears the key after a successful sync so reviews aren't duplicated.
 */
export async function syncLocalReviewsForFarm(
  supabase: AnySupabase,
  userId: string,
  farmSlug: string,
): Promise<void> {
  if (typeof window === 'undefined') return
  const key = `mf_reviews_${farmSlug}`
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return
    const reviews = JSON.parse(raw) as StoredReview[]
    if (!Array.isArray(reviews) || reviews.length === 0) return

    for (const review of reviews) {
      await supabase.from('reviews').insert({
        user_id: userId,
        farm_slug: farmSlug,
        display_name: review.name,
        city: review.city ?? '',
        rating: review.rating,
        text: review.text,
      })
    }
    localStorage.removeItem(key)
  } catch {
    // ignore — don't block the user experience
  }
}
