import { Navbar } from '@/components/ui/Navbar'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MapSearchPage } from '@/components/mapa/MapSearchPage'
import { getAllFarms } from '@/lib/farms'
import type { FarmMapMarker, KrajCode } from '@/types/farm'

export const metadata = {
  title: 'Mapa farem – Najdi farmáře ve svém okolí',
  description:
    'Interaktivní mapa všech farem v České republice. Filtrujte podle kraje, produktu nebo dostupnosti.',
}

export const revalidate = 300

interface PageProps {
  searchParams: { kraj?: string; q?: string }
}

const VALID_KRAJE: KrajCode[] = [
  'Praha', 'Středočeský', 'Jihočeský', 'Plzeňský', 'Karlovarský',
  'Ústecký', 'Liberecký', 'Královéhradecký', 'Pardubický',
  'Vysočina', 'Jihomoravský', 'Olomoucký', 'Moravskoslezský', 'Zlínský',
]

export default async function MapaPage({ searchParams }: PageProps) {
  const farms = await getAllFarms()
  const markers: FarmMapMarker[] = farms.map((f) => ({
    id: f.id,
    slug: f.slug,
    name: f.name,
    lat: f.location.lat,
    lng: f.location.lng,
    categories: f.categories,
    verified: f.verified,
  }))

  const rawKraj = searchParams.kraj ?? ''
  const initialKraj = VALID_KRAJE.includes(rawKraj as KrajCode) ? (rawKraj as KrajCode) : null
  const initialSearch = (searchParams.q ?? '').slice(0, 100)

  return (
    <>
      <Navbar />
      <MapSearchPage
        farms={farms}
        markers={markers}
        initialKraj={initialKraj}
        initialSearch={initialSearch}
      />
      <MobileBottomNav />
    </>
  )
}
