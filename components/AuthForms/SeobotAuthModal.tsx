'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import ButtonSeobot from '../ui/ButtonSeobot'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { trackEvent, identifyUser } from '@/lib/posthog'

interface SeobotAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SeobotAuthModal({ isOpen, onClose }: SeobotAuthModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleQuickAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        alert('Supabase configuration is missing. Please check your .env.local file.')
        console.error('Missing Supabase environment variables')
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      
      // Generate a random password (user won't need to remember it)
      const tempPassword = `Temp${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}!A1`
      
      console.log('Quick Access: Attempting to sign up user with email:', email)
      
      // Sign up the user with email and password
      // NOTE: Email confirmation must be disabled in Supabase Dashboard for instant access
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            full_name: name,
          },
          // Remove emailRedirectTo to avoid confirmation flow
        },
      })

      if (signUpError) {
        console.error('Sign up error:', signUpError)
        
        // Handle specific error cases
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
          // User already exists - automatically sign them in via server action
          console.log('User already exists, attempting automatic sign-in...')
          
          try {
            const response = await fetch('/api/auth/quick-access', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, name }),
              credentials: 'include', // Ensure cookies are sent
            })
            
            const result = await response.json()
            
            if (result.success) {
              console.log('✓ Existing user signed in successfully')
              // Track sign-in event
              trackEvent('user_signed_in', {
                method: 'quick_access',
                email: email,
              })
              // Session is set via cookies from server response
              // Refresh the page to ensure session is loaded
              onClose()
              router.push('/app')
              router.refresh()
              // Force a hard refresh to ensure session cookies are read
              window.location.href = '/app'
              return
            } else {
              console.error('Auto sign-in failed:', result.error)
              alert(result.error || 'Could not sign in. Please try again.')
              setIsLoading(false)
              return
            }
          } catch (fetchError) {
            console.error('Error calling quick-access API:', fetchError)
            alert('Network error. Please try again.')
            setIsLoading(false)
            return
          }
        } else if (signUpError.message.includes('Invalid API key') || signUpError.message.includes('JWT')) {
          alert('Invalid Supabase configuration. Please check your .env.local file.')
          setIsLoading(false)
          return
        } else if (signUpError.message.includes('fetch')) {
          alert('Network error. Please check your internet connection and Supabase URL.')
          setIsLoading(false)
          return
        } else {
          alert(`Sign up failed: ${signUpError.message}`)
          setIsLoading(false)
          return
        }
      }

      console.log('Sign up response:', { 
        hasUser: !!authData?.user, 
        hasSession: !!authData?.session,
        userId: authData?.user?.id 
      })

      // Check if we got a session (instant access)
      if (authData?.session) {
        console.log('✓ Session created immediately - redirecting to /app')
        // Track sign-up event
        trackEvent('user_signed_up', {
          method: 'quick_access',
          email: email,
          user_id: authData.user?.id,
        })
        // Identify user in PostHog
        if (authData.user?.id) {
          identifyUser(authData.user.id, {
            email: email,
            name: name,
          })
        }
        // Ensure session is properly set in cookies
        // The SSR client should handle this automatically, but we'll refresh to be sure
        onClose()
        // Use window.location for hard redirect to ensure cookies are read
        window.location.href = '/app'
      } else if (authData?.user && !authData.session) {
        // This means email confirmation is still required
        console.error('⚠ Email confirmation is still required. Please disable it in Supabase Dashboard.')
        alert('Configuration Error: Email confirmation must be disabled in Supabase Dashboard.\n\nPlease follow the instructions in SUPABASE_CONFIG_INSTRUCTIONS.md')
        setIsLoading(false)
      } else {
        // Unexpected state
        console.error('Unexpected auth state:', authData)
        alert('Sign up succeeded but session was not created. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Quick access error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        alert('Network error. Please check:\n1. Your internet connection\n2. Supabase URL in .env.local\n3. Supabase project is active')
      } else {
        alert(`Failed to create quick access: ${errorMessage}`)
      }
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Get Started</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-6 text-center">
                  Enter your details to get started
                </p>
                
                {/* Quick Access Form */}
                <form onSubmit={handleQuickAccess} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-green"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-green"
                      placeholder="Enter your email"
                    />
                  </div>

                  <ButtonSeobot
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Continue'}
                  </ButtonSeobot>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
