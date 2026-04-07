import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 86400 // cache for 24h

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  profile_photo_url: string
  relative_time_description: string
}

async function findPlaceId(name: string, city: string): Promise<string | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return null
  const query = encodeURIComponent(`${name} ${city}`)
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}`,
  )
  const json = await res.json()
  return json?.results?.[0]?.place_id ?? null
}

async function fetchReviews(placeId: string): Promise<GoogleReview[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) return []
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=cs&key=${key}`,
  )
  const json = await res.json()
  return (json?.result?.reviews ?? []) as GoogleReview[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const city = searchParams.get('city')

  if (!name || !city) {
    return NextResponse.json({ error: 'Missing name or city' }, { status: 400 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return NextResponse.json({ reviews: [], placeId: null })
  }

  try {
    const placeId = await findPlaceId(name, city)
    if (!placeId) return NextResponse.json({ reviews: [], placeId: null })

    const reviews = await fetchReviews(placeId)
    return NextResponse.json({ reviews, placeId })
  } catch {
    return NextResponse.json({ reviews: [], placeId: null })
  }
}
