'use client'

import { motion } from 'framer-motion'
import { FaRobot } from 'react-icons/fa'

export interface Message {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user'
  const isBot = message.type === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start space-x-2 mb-3 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <span className="text-primary-green flex-shrink-0 font-mono">&gt;</span>
      )}
      
      <div className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {isBot && <FaRobot className="text-primary-green mt-1 flex-shrink-0" />}
        
        <div
          className={`font-mono text-sm md:text-base ${
            isUser
              ? 'bg-primary-green/10 border border-primary-green/30 text-white px-4 py-2 rounded-lg max-w-md'
              : 'text-white'
          }`}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}
