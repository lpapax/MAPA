import { NextRequest, NextResponse } from 'next/server'
import { getAllFarms } from '@/lib/farms'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const farms = await getAllFarms()
  const lower = q.toLowerCase()

  const results = farms
    .filter((farm) => {
      return (
        farm.name.toLowerCase().includes(lower) ||
        farm.description.toLowerCase().includes(lower) ||
        farm.location.city.toLowerCase().includes(lower) ||
        farm.location.kraj.toLowerCase().includes(lower)
      )
    })
    .slice(0, 5)
    .map((farm) => ({
      id: farm.id,
      slug: farm.slug,
      name: farm.name,
      city: farm.location.city,
      kraj: farm.location.kraj,
    }))

  return NextResponse.json({ results })
}
