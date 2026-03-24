export type FarmCategory =
  | 'zelenina'
  | 'ovoce'
  | 'maso'
  | 'mléko'
  | 'vejce'
  | 'med'
  | 'chléb'
  | 'sýry'
  | 'víno'
  | 'byliny'
  | 'ryby'
  | 'ostatní'

export type DayOfWeek = 'po' | 'út' | 'st' | 'čt' | 'pá' | 'so' | 'ne'

export interface OpeningHoursEntry {
  open: string  // HH:MM
  close: string // HH:MM
}

export type OpeningHours = Partial<Record<DayOfWeek, OpeningHoursEntry | null>>

export interface FarmLocation {
  lat: number
  lng: number
  address: string
  city: string
  kraj: string
  zip: string
}

export interface FarmContact {
  phone?: string
  email?: string
  web?: string
  instagram?: string
  facebook?: string
}

export interface Farm {
  id: string
  slug: string
  name: string
  description: string
  categories: FarmCategory[]
  location: FarmLocation
  contact: FarmContact
  openingHours?: OpeningHours
  images: string[]
  verified: boolean
  createdAt: string
}

// For map clustering and display
export interface FarmMapMarker {
  id: string
  slug: string
  name: string
  lat: number
  lng: number
  categories: FarmCategory[]
  verified: boolean
}

export type KrajCode =
  | 'Praha'
  | 'Středočeský'
  | 'Jihočeský'
  | 'Plzeňský'
  | 'Karlovarský'
  | 'Ústecký'
  | 'Liberecký'
  | 'Královéhradecký'
  | 'Pardubický'
  | 'Vysočina'
  | 'Jihomoravský'
  | 'Olomoucký'
  | 'Moravskoslezský'
  | 'Zlínský'

export interface FarmFilters {
  categories: FarmCategory[]
  kraj: KrajCode | null
  openNow: boolean
  searchQuery: string
}
