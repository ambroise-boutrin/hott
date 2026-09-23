import { SiteHeader } from "@/components/site-header"
import { SplashScreen } from "@/components/splash-screen"
import { HeroSection } from "@/components/hero-section"
import { SplitProductSection } from "@/components/split-product-section"
import { FounderWordSection } from "@/components/founder-word-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SplashScreen />
      <SiteHeader />
      <HeroSection />
      <SplitProductSection />
      <FounderWordSection />
      <SiteFooter />
    </main>
  )
}
