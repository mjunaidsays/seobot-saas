import NavbarSeobot from '@/components/NavbarSeobot'
import HeroSeobot from '@/components/HeroSeobot'
import dynamic from 'next/dynamic'

// Lazy-load below-the-fold sections for better performance
// Only load these components when they're needed (as user scrolls)
const StatsShowcase = dynamic(() => import('@/components/StatsShowcase'), {
  loading: () => <div className="h-96" /> // Prevent layout shift
})
const WhyChoose = dynamic(() => import('@/components/WhyChoose'))
const IntegrationsGrid = dynamic(() => import('@/components/IntegrationsGrid'))
const LanguagePills = dynamic(() => import('@/components/LanguagePills'))
const ArticleGrid = dynamic(() => import('@/components/ArticleGrid'))
const Testimonials = dynamic(() => import('@/components/Testimonials'))
const PricingSection = dynamic(() => import('@/components/PricingSection'))
const FAQ = dynamic(() => import('@/components/FAQ'))
const FooterSeobot = dynamic(() => import('@/components/FooterSeobot'))
const ChatWidget = dynamic(() => import('@/components/ChatWidget'))

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
