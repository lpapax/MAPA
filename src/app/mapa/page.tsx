import { Navbar } from '@/components/ui/Navbar'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { MapSearchPage } from '@/components/mapa/MapSearchPage'

export const metadata = {
  title: 'Mapa farem – Najdi farmáře ve svém okolí',
  description: 'Interaktivní mapa všech farem v České republice. Filtrujte podle kraje, produktu nebo dostupnosti.',
}

export default function MapaPage() {
  return (
    <>
      <Navbar />
      <MapSearchPage />
      <MobileBottomNav />
    </>
  )
}
