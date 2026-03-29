import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { getAllFarms } from '@/lib/farms'
import { LeaderboardClient } from '@/components/zebricek/LeaderboardClient'
import type { FarmCategory } from '@/types/farm'

export const metadata: Metadata = {
  title: 'Žebříček farem – Mapa Farem',
  description: 'Nejpopulárnější a ověřené farmy České republiky. Seřazené podle zobrazení, kategorie a kraje.',
}

export const revalidate = 300

export interface LeaderboardFarm {
  id: string
  slug: string
  name: string
  categories: FarmCategory[]
  city: string
  kraj: string
  verified: boolean
  viewCount: number
  image: string | null
}

export default async function ZebricekPage() {
  const farms = await getAllFarms()

  const farmData: LeaderboardFarm[] = farms.map((f) => ({
    id: f.id,
    slug: f.slug,
    name: f.name,
    categories: f.categories,
    city: f.location.city,
    kraj: f.location.kraj,
    verified: f.verified,
    viewCount: f.viewCount ?? 0,
    image: f.images?.[0]?.startsWith('http') && !f.images[0].includes('placeholder') ? f.images[0] : null,
  }))

  // Pre-compute region counts for the leaderboard
  const countByKraj: Record<string, number> = {}
  for (const f of farmData) {
    countByKraj[f.kraj] = (countByKraj[f.kraj] ?? 0) + 1
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-surface pb-20">
        <LeaderboardClient
          farms={farmData}
          totalFarms={farmData.length}
          verifiedCount={farmData.filter((f) => f.verified).length}
          krajCount={Object.keys(countByKraj).length}
        />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
