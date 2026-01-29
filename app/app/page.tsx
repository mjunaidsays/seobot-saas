'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Group, Panel, Separator } from 'react-resizable-panels'
import ChatInterface from './components/ChatInterface'
import WebsiteDataPanel from './components/WebsiteDataPanel'
import GeneratedArticle from './components/GeneratedArticle'
import ConversationHistory from './components/ConversationHistory'
import { useChat } from '@/hooks/useChat'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { FaSignOutAlt, FaBars, FaHistory } from 'react-icons/fa'
import { identifyUser, trackEvent, resetPostHog } from '@/lib/posthog'
import { ConversationProject } from '@/utils/database/conversations'

export default function AppPage() {
  const [autopilot, setAutopilot] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isTrialMode, setIsTrialMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  
  // Initialize useChat hook
  const chatHookResult = useChat({
    userId: user?.id || null,
    isTrialMode,
  })
  
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    websiteUrl, 
    analysisComplete, 
    websiteData, 
    handleProceed,
    generatedArticles,
    isGenerating,
    error,
    loadConversation,
    resetConversation,
    currentProjectId
  } = chatHookResult

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()

      // First, check if we have a session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log('App page session check:', { hasSession: !!session })

      // Get user (this will refresh the session if needed)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      console.log('App page auth check:', {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        hasSession: !!session,
        error: error?.message,
      })

      // Detect trial mode based on URL and/or localStorage
      let trialFlag = false
      if (typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href)
          const trialParam = url.searchParams.get('trial')
          const storedTrial = window.localStorage.getItem('seobot_trial_mode')
          trialFlag = trialParam === '1' || storedTrial === 'true'
        } catch {
          trialFlag = false
        }
      }

      if (user) {
        // Authenticated user path (right panel sign up / sign in)
        setUser(user)
        setIsAuthenticated(true)

        // For real users, force non-trial mode
        setIsTrialMode(false)

        // Identify user in PostHog
        identifyUser(user.id, {
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          trial_mode: false,
        })

        // Fetch user profile from users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUserProfile(profile)
        } else if (profileError?.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const fullName =
            user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
          const { data: newProfile } = await supabase
            .from('users')
            .insert({
              id: user.id,
              full_name: fullName,
            })
            .select()
            .single()

          if (newProfile) {
            setUserProfile(newProfile)
          }
        }
      } else if (trialFlag && !session) {
        // Trial mode without auth session (left panel Try Now)
        setIsAuthenticated(true)
        setIsTrialMode(true)
        setUser(null)
      } else {
        setIsAuthenticated(false)
        router.push('/')
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    
    // Track logout event
    trackEvent('user_logged_out')
    
    // Reset PostHog session
    resetPostHog()
    
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getDomainFromUrl = (url: string | null): string => {
    if (!url) return 'seobot'
    try {
      let domain = url.replace(/^https?:\/\//, '')
      domain = domain.replace(/^www\./, '')
      domain = domain.split('/')[0]
      domain = domain.split(':')[0]
      return domain
    } catch {
      return 'seobot'
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-primary-green font-mono">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen relative overflow-hidden bg-black">
      {/* Starry Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="stars-bg"></div>
      </div>

      {/* User Profile Header */}
      {user && (
        <div className="relative z-20 bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Sidebar Toggle - Only show for non-trial users */}
            {!isTrialMode && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <FaBars className="w-5 h-5" />
              </button>
            )}
            {!isTrialMode && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex text-gray-400 hover:text-white transition-colors p-2 -ml-2"
                aria-label="Toggle sidebar"
              >
                <FaHistory className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center text-black font-bold text-sm">
              {(userProfile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {userProfile?.full_name || user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isTrialMode && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded text-xs mr-2">
                Trial Mode - Progress won't be saved
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 px-3 py-1 rounded hover:bg-gray-800"
              title="Sign out"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* Conversation History Sidebar - Only for non-trial users */}
      {!isTrialMode && (
        <div className={`fixed lg:relative inset-0 lg:inset-auto ${isSidebarOpen ? 'z-40' : 'z-30'}`}>
          <ConversationHistory
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectConversation={(project: ConversationProject) => {
              loadConversation(project)
            }}
            onNewConversation={() => {
              resetConversation()
            }}
            currentProjectId={currentProjectId || undefined}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 flex-1 flex flex-col overflow-hidden ${!isTrialMode && isSidebarOpen ? 'lg:ml-[300px]' : ''} transition-all duration-300`}>
        <AnimatePresence mode="wait">
          {!analysisComplete ? (
            // Single centered chat (initial state)
            <motion.div
              key="single-chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center p-4 md:p-8"
            >
              <motion.div
                className="w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                style={{ height: '600px', maxHeight: '80vh' }}
              >
                {/* Terminal Header */}
                <div className="bg-gray-900 px-4 py-3 flex items-center space-x-2 border-b border-gray-800 flex-shrink-0">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-primary-green font-mono text-sm ml-4">seobot</span>
                </div>

                {/* Chat Interface */}
                <ChatInterface
                  messages={messages}
                  onSendMessage={sendMessage}
                  isTyping={isTyping}
                />
              </motion.div>
            </motion.div>
          ) : (
            // Two-panel layout (after analysis) - wrapped in container box
            <motion.div
              key="two-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden"
            >
              <motion.div
                className="w-full max-w-[95vw] bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col relative"
                style={{ height: '85vh', maxHeight: '85vh' }}
              >
                {/* Terminal Header */}
                <div className="bg-gray-900 px-4 py-3 flex items-center space-x-2 border-b border-gray-800 flex-shrink-0">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-primary-green font-mono text-sm ml-4">
                    seobot {websiteUrl ? getDomainFromUrl(websiteUrl) : ''}
                  </span>
                </div>

                {/* Two-panel layout with resizable panels */}
                <Group orientation="horizontal" className="flex-1 overflow-hidden min-h-0">
                  {/* Left Panel - Chat Interface */}
                  <Panel defaultSize={60} minSize={30} className="flex flex-col overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex-1 flex flex-col bg-gray-950 overflow-hidden h-full"
                    >
                      {/* Chat Interface */}
                      <div className="flex-1 overflow-hidden">
                        <ChatInterface
                          messages={messages}
                          onSendMessage={sendMessage}
                          isTyping={isTyping}
                        />
                      </div>
                    </motion.div>
                  </Panel>

                  {/* Resize Handle */}
                  <Separator className="w-1 bg-gray-800 hover:bg-primary-green/50 transition-colors cursor-col-resize group relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1 h-8 bg-primary-green rounded-full"></div>
                    </div>
                  </Separator>

                  {/* Right Panel - Website Data or Generated Articles */}
                  <Panel defaultSize={40} minSize={30} className="flex flex-col overflow-hidden">
                    {generatedArticles.length > 0 ? (
                      // Show generated articles
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gray-950 overflow-y-auto p-6"
                      >
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-white mb-2">Generated Articles</h2>
                          <p className="text-gray-400 text-sm">
                            {generatedArticles.length} article{generatedArticles.length !== 1 ? 's' : ''} generated successfully
                          </p>
                        </div>
                        {generatedArticles.map((article, index) => (
                          <GeneratedArticle key={index} article={article} index={index} />
                        ))}
                      </motion.div>
                    ) : (
                      // Show website data panel
                      <WebsiteDataPanel
                        websiteData={websiteData}
                        onProceed={handleProceed}
                      />
                    )}
                  </Panel>
                </Group>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded text-sm max-w-md">
            {error}
          </div>
        )}

        {/* Generation Progress Indicator */}
        {isGenerating && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary-green/10 border border-primary-green text-primary-green px-4 py-2 rounded text-sm">
            Generating articles... Please wait.
          </div>
        )}
      </div>

      <style jsx>{`
        .stars-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
            radial-gradient(2px 2px at 60px 70px, white, transparent),
            radial-gradient(1px 1px at 50px 50px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, white, transparent),
            radial-gradient(2px 2px at 90px 10px, white, transparent),
            radial-gradient(1px 1px at 160px 120px, white, transparent);
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: stars 120s linear infinite;
        }

        @keyframes stars {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-200px);
          }
        }
      `}</style>
    </div>
  )
}
