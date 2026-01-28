'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import ButtonSeobot from '../ui/ButtonSeobot'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { trackEvent, identifyUser } from '@/lib/posthog'

interface SeobotAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SeobotAuthModal({ isOpen, onClose }: SeobotAuthModalProps) {
  // Trial mode (left panel) state
  const [trialName, setTrialName] = useState('')
  const [trialEmail, setTrialEmail] = useState('')
  const [showTrialForm, setShowTrialForm] = useState(false)
  const [isTrialLoading, setIsTrialLoading] = useState(false)

  // Sign up/Sign in (right panel) state
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const router = useRouter()

  const handleTrialAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTrialLoading(true)
    setAuthError(null)

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        alert('Supabase configuration is missing. Please check your .env.local file.')
        console.error('Missing Supabase environment variables')
        setIsTrialLoading(false)
        return
      }

      const supabase = createClient()
      
      // Generate a random password (user won't need to remember it)
      const tempPassword = `Temp${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}!A1`
      
      console.log('Trial Access: Attempting to sign up user with email:', trialEmail)
      
      // Sign up the user with email and password, mark as trial mode
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: trialEmail,
        password: tempPassword,
        options: {
          data: {
            full_name: trialName,
            trial_mode: true, // Mark as trial user
          },
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
              body: JSON.stringify({ email: trialEmail, name: trialName }),
              credentials: 'include',
            })
            
            const result = await response.json()
            
            if (result.success) {
              console.log('✓ Existing user signed in successfully')
              trackEvent('user_signed_in', {
                method: 'trial_access',
                email: trialEmail,
              })
              onClose()
              router.push('/app')
              router.refresh()
              window.location.href = '/app'
              return
            } else {
              console.error('Auto sign-in failed:', result.error)
              setAuthError(result.error || 'Could not sign in. Please try again.')
              setIsTrialLoading(false)
              return
            }
          } catch (fetchError) {
            console.error('Error calling quick-access API:', fetchError)
            setAuthError('Network error. Please try again.')
            setIsTrialLoading(false)
            return
          }
        } else {
          setAuthError(signUpError.message)
          setIsTrialLoading(false)
          return
        }
      }

      if (authData?.session) {
        console.log('✓ Trial session created - redirecting to /app')
        trackEvent('user_signed_up', {
          method: 'trial_access',
          email: trialEmail,
          user_id: authData.user?.id,
        })
        if (authData.user?.id) {
          identifyUser(authData.user.id, {
            email: trialEmail,
            name: trialName,
          })
        }
        onClose()
        window.location.href = '/app'
      } else if (authData?.user && !authData.session) {
        setAuthError('Email confirmation is required. Please check your email.')
        setIsTrialLoading(false)
      } else {
        setAuthError('Sign up succeeded but session was not created. Please try again.')
        setIsTrialLoading(false)
      }
    } catch (error) {
      console.error('Trial access error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setAuthError(errorMessage)
      setIsTrialLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthLoading(true)
    setAuthError(null)

    // Validation
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long')
      setIsAuthLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match')
      setIsAuthLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            trial_mode: false, // Full user, not trial
          },
        },
      })

      if (signUpError) {
        setAuthError(signUpError.message)
        setIsAuthLoading(false)
        return
      }

      if (authData?.session) {
        trackEvent('user_signed_up', {
          method: 'full_signup',
          email: email,
          user_id: authData.user?.id,
        })
        if (authData.user?.id) {
          identifyUser(authData.user.id, {
            email: email,
            name: fullName,
          })
        }
        onClose()
        window.location.href = '/app'
      } else if (authData?.user && !authData.session) {
        setAuthError('Please check your email to confirm your account')
        setIsAuthLoading(false)
      } else {
        setAuthError('Sign up failed. Please try again.')
        setIsAuthLoading(false)
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setAuthError(error instanceof Error ? error.message : 'Unknown error')
      setIsAuthLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthLoading(true)
    setAuthError(null)

    try {
      const supabase = createClient()
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setAuthError(signInError.message)
        setIsAuthLoading(false)
        return
      }

      if (authData?.session) {
        trackEvent('user_signed_in', {
          method: 'full_signin',
          email: email,
        })
        if (authData.user?.id) {
          identifyUser(authData.user.id, {
            email: email,
            name: authData.user.user_metadata?.full_name || email.split('@')[0],
          })
        }
        onClose()
        window.location.href = '/app'
      } else {
        setAuthError('Sign in failed. Please try again.')
        setIsAuthLoading(false)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setAuthError(error instanceof Error ? error.message : 'Unknown error')
      setIsAuthLoading(false)
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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-[1000px] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Get Started</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 -mr-2"
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Split Screen Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel - Trial Access */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-800">
                  {!showTrialForm ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white text-center">
                        Try the product now
                      </h3>
                      <p className="text-gray-400 text-sm sm:text-base text-center max-w-md">
                        By clicking here, you agree to test the product right away but the progress won't be saved
                      </p>
                      <ButtonSeobot
                        variant="primary"
                        size="lg"
                        onClick={() => setShowTrialForm(true)}
                        className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-base sm:text-lg"
                      >
                        Try Now
                      </ButtonSeobot>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => {
                          setShowTrialForm(false)
                          setTrialName('')
                          setTrialEmail('')
                          setAuthError(null)
                        }}
                        className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 flex items-center"
                      >
                        ← Back
                      </button>
                      <h3 className="text-xl font-bold text-white mb-2">Quick Access</h3>
                      <p className="text-gray-400 text-sm mb-6">
                        Enter your details to get started. Your progress won't be saved.
                      </p>
                      <form onSubmit={handleTrialAccess} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={trialName}
                            onChange={(e) => setTrialName(e.target.value)}
                            required
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={trialEmail}
                            onChange={(e) => setTrialEmail(e.target.value)}
                            required
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                            placeholder="Enter your email"
                          />
                        </div>

                        {authError && (
                          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {authError}
                          </div>
                        )}

                        <ButtonSeobot
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full min-h-[48px]"
                          disabled={isTrialLoading}
                        >
                          {isTrialLoading ? 'Loading...' : 'Continue'}
                        </ButtonSeobot>
                      </form>
                    </motion.div>
                  )}
                </div>

                {/* Right Panel - Sign Up / Sign In */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center justify-center mb-6 space-x-2">
                    <button
                      onClick={() => {
                        setAuthMode('signup')
                        setAuthError(null)
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        authMode === 'signup'
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign Up
                    </button>
                    <span className="text-gray-600">|</span>
                    <button
                      onClick={() => {
                        setAuthMode('signin')
                        setAuthError(null)
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        authMode === 'signin'
                          ? 'bg-emerald-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  <motion.div
                    key={authMode}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {authMode === 'signup'
                        ? 'Sign up to save your conversations and access them anytime'
                        : 'Sign in to access your saved conversations'}
                    </p>

                    <form
                      onSubmit={authMode === 'signup' ? handleSignUp : handleSignIn}
                      className="space-y-4"
                    >
                      {authMode === 'signup' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 pr-12 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                            placeholder={authMode === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {authMode === 'signup' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 pr-12 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {authError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                          {authError}
                        </div>
                      )}

                      <ButtonSeobot
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full min-h-[48px]"
                        disabled={isAuthLoading}
                      >
                        {isAuthLoading
                          ? 'Loading...'
                          : authMode === 'signup'
                          ? 'Sign Up'
                          : 'Sign In'}
                      </ButtonSeobot>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
