import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { MobileBottomNav } from '@/components/ui/MobileBottomNav'
import { HeroSection } from '@/components/home/HeroSection'
import { CategoryFilter } from '@/components/home/CategoryFilter'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import { HomeFeaturedFarms } from '@/components/home/HomeFeaturedFarms'
import { HowItWorks } from '@/components/home/HowItWorks'
import { SeasonalBanner } from '@/components/home/SeasonalBanner'
import { RecentReviews } from '@/components/home/RecentReviews'
import { BlogPreview } from '@/components/home/BlogPreview'
import { Newsletter } from '@/components/home/Newsletter'

export const metadata = {
  title: 'Mapa Farem – Nakupujte přímo od farmářů z celé ČR',
}

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CategoryFilter />
        <RecentlyViewed />
        <HomeFeaturedFarms />
        <HowItWorks />
        <SeasonalBanner />
        <RecentReviews />
        <BlogPreview />
        <Newsletter />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
