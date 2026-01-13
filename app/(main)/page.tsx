import NavbarSeobot from '@/components/NavbarSeobot'
import HeroSeobot from '@/components/HeroSeobot'
import StatsShowcase from '@/components/StatsShowcase'
import WhyChoose from '@/components/WhyChoose'
import IntegrationsGrid from '@/components/IntegrationsGrid'
import LanguagePills from '@/components/LanguagePills'
import ArticleGrid from '@/components/ArticleGrid'
import Testimonials from '@/components/Testimonials'
import PricingSection from '@/components/PricingSection'
import FAQ from '@/components/FAQ'
import FooterSeobot from '@/components/FooterSeobot'
import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavbarSeobot />
      <HeroSeobot />
      <StatsShowcase />
      <WhyChoose />
      <IntegrationsGrid />
      <LanguagePills />
      <ArticleGrid />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <FooterSeobot />
      <ChatWidget />
    </main>
  )
}
