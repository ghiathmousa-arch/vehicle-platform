import HeroSection from "@/components/home/HeroSection"
import StatsSection from "@/components/home/StatsSection"
import ServicesSection from "@/components/home/ServicesSection"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <Footer />
    </div>
  )
}