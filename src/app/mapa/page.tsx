import { Navbar } from '@/components/ui/Navbar'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MapSearchPage } from '@/components/mapa/MapSearchPage'
import { getAllFarms, getFarmMapMarkers } from '@/lib/farms'

export const metadata = {
  title: 'Mapa farem – Najdi farmáře ve svém okolí',
  description:
    'Interaktivní mapa všech farem v České republice. Filtrujte podle kraje, produktu nebo dostupnosti.',
}

// Revalidate every 5 minutes so new farms appear without a full rebuild
export const revalidate = 300

export default async function MapaPage() {
  const [farms, markers] = await Promise.all([getAllFarms(), getFarmMapMarkers()])

  return (
    <>
      <Navbar />
      <MapSearchPage farms={farms} markers={markers} />
      <MobileBottomNav />
    </>
  )
}
