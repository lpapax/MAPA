import farmsData from '@/data/farms.json'
import type { Farm, FarmCategory, FarmFilters, FarmMapMarker } from '@/types/farm'

// Type-assert the JSON import
const allFarms: Farm[] = farmsData as Farm[]

export function getAllFarms(): Farm[] {
  return allFarms
}

export function getFarmBySlug(slug: string): Farm | undefined {
  return allFarms.find((farm) => farm.slug === slug)
}

export function getAllSlugs(): string[] {
  return allFarms.map((farm) => farm.slug)
}

export function getFarmMapMarkers(): FarmMapMarker[] {
  return allFarms.map((farm) => ({
    id: farm.id,
    slug: farm.slug,
    name: farm.name,
    lat: farm.location.lat,
    lng: farm.location.lng,
    categories: farm.categories,
    verified: farm.verified,
  }))
}

export function filterFarms(farms: Farm[], filters: FarmFilters): Farm[] {
  return farms.filter((farm) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.some((cat: FarmCategory) => farm.categories.includes(cat))
    ) {
      return false
    }

    if (filters.kraj && farm.location.kraj !== filters.kraj) {
      return false
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase()
      const matchName = farm.name.toLowerCase().includes(q)
      const matchCity = farm.location.city.toLowerCase().includes(q)
      const matchDesc = farm.description.toLowerCase().includes(q)
      if (!matchName && !matchCity && !matchDesc) return false
    }

    if (filters.openNow) {
      const isOpen = isFarmOpenNow(farm)
      if (!isOpen) return false
    }

    return true
  })
}

export function isFarmOpenNow(farm: Farm): boolean {
  if (!farm.openingHours) return false

  const now = new Date()
  const days: Record<number, string> = {
    1: 'po',
    2: 'út',
    3: 'st',
    4: 'čt',
    5: 'pá',
    6: 'so',
    0: 'ne',
  }
  const dayKey = days[now.getDay()] as keyof typeof farm.openingHours
  const todayHours = farm.openingHours[dayKey]

  if (!todayHours) return false

  const [openH, openM] = todayHours.open.split(':').map(Number)
  const [closeH, closeM] = todayHours.close.split(':').map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

export const CATEGORY_LABELS: Record<FarmCategory, string> = {
  zelenina: 'Zelenina',
  ovoce: 'Ovoce',
  maso: 'Maso',
  mléko: 'Mléko',
  vejce: 'Vejce',
  med: 'Med',
  chléb: 'Chléb & pečivo',
  sýry: 'Sýry',
  víno: 'Víno',
  byliny: 'Bylinky',
  ryby: 'Ryby',
  ostatní: 'Ostatní',
}
