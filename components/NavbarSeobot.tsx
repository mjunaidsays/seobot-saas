'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ButtonSeobot from './ui/ButtonSeobot'
import SeobotAuthModal from './AuthForms/SeobotAuthModal'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { trackEvent, resetPostHog } from '@/lib/posthog'

export default function NavbarSeobot() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if user is authenticated OR in trial mode
      const trialMode = typeof window !== 'undefined' && window.localStorage.getItem('seobot_trial_mode') === 'true'
      
      setIsLoggedIn(!!(user || trialMode))
    }
    
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    
    // Track logout event
    trackEvent('user_logged_out')
    
    // Reset PostHog session
    resetPostHog()
    
    // Clear trial mode from localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('seobot_trial_mode')
      window.localStorage.removeItem('seobot_trial_email')
      window.localStorage.removeItem('seobot_trial_name')
    }
    
    await supabase.auth.signOut()
    
    // Hard redirect to landing page
    window.location.href = '/'
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-bold text-emerald-400 tracking-tight transition-all duration-300 group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                Up Rank
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <Link
                href="https://seobot.tolt.io/"
                target="_blank"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
              >
                Refer to earn
              </Link> */}
              <Link
                href="#pricing"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
              >
                Pricing
              </Link>
              <Link
                href="/privacy"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-300 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
              >
                Terms of Service
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <ButtonSeobot
                  variant="primary"
                  size="md"
                  onClick={handleSignOut}
                >
                  Sign out
                </ButtonSeobot>
              ) : (
                <ButtonSeobot
                  variant="primary"
                  size="md"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Try now
                </ButtonSeobot>
              )}
            </div>
          </div>
        </div>
      </nav>
      <SeobotAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
