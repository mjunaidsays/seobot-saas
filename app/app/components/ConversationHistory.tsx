'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrash, FaHistory, FaPlus } from 'react-icons/fa'
import { listConversations, deleteConversation, ConversationProject } from '@/utils/database/conversations'
import { createClient } from '@/utils/supabase/client'

interface ConversationHistoryProps {
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (project: ConversationProject) => void
  onNewConversation: () => void
  currentProjectId?: string | null
}

export default function ConversationHistory({
  isOpen,
  onClose,
  onSelectConversation,
  onNewConversation,
  currentProjectId,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<ConversationProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadConversations()
    }
  }, [isOpen])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        const convos = await listConversations(user.id)
        setConversations(convos)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId) return

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return
    }

    const success = await deleteConversation(userId, projectId)
    if (success) {
      setConversations((prev) => prev.filter((c) => c.id !== projectId))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getDomainFromUrl = (url: string): string => {
    try {
      let domain = url.replace(/^https?:\/\//, '')
      domain = domain.replace(/^www\./, '')
      domain = domain.split('/')[0]
      domain = domain.split(':')[0]
      return domain
    } catch {
      return url
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile/tablet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:fixed left-0 top-0 h-full w-full lg:w-[300px] xl:w-[300px] bg-gray-950 border-r border-gray-800 z-50 flex flex-col overflow-hidden shadow-2xl lg:shadow-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <FaHistory className="text-emerald-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Conversations</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 -mr-2"
                aria-label="Close sidebar"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* New Conversation Button */}
            <div className="p-4 border-b border-gray-800 flex-shrink-0">
              <button
                onClick={() => {
                  onNewConversation()
                  onClose()
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <FaPlus className="w-4 h-4" />
                <span>New Conversation</span>
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-400 text-sm">Loading...</div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FaHistory className="text-gray-600 w-12 h-12 mb-4" />
                  <p className="text-gray-400 text-sm">No conversations yet</p>
                  <p className="text-gray-500 text-xs mt-2">Start a new conversation to get started</p>
                </div>
              ) : (
                <div className="p-2">
                  {conversations.map((conversation) => {
                    const isActive = conversation.id === currentProjectId
                    const domain = getDomainFromUrl(conversation.url)
                    const messageCount = conversation.chat_history?.length || 0

                    return (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative mb-2 p-3 rounded-lg cursor-pointer transition-all duration-200 min-h-[64px] ${
                          isActive
                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                            : 'bg-gray-900/50 hover:bg-gray-900 border border-transparent hover:border-gray-700'
                        }`}
                        onClick={() => {
                          onSelectConversation(conversation)
                          onClose()
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1"></div>
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive ? 'text-emerald-300' : 'text-white'
                                }`}
                              >
                                {domain}
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 truncate mb-1">{conversation.url}</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{messageCount} messages</span>
                              <span>•</span>
                              <span>{formatDate(conversation.updated_at)}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDelete(conversation.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-400 flex-shrink-0 ml-2"
                            aria-label="Delete conversation"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
