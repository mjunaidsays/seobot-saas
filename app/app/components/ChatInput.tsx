'use client'

import { useState, KeyboardEvent } from 'react'
import { FaPaperPlane } from 'react-icons/fa'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center space-x-3 p-4 border-t border-gray-800 bg-black/50">
      <span className="text-primary-green font-mono text-sm md:text-base flex-shrink-0">
        &gt;
      </span>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none text-white font-mono text-sm md:text-base placeholder-gray-600 focus:outline-none disabled:opacity-50"
        autoFocus
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="text-primary-green hover:text-primary-lime transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <FaPaperPlane className="w-5 h-5" />
      </button>
    </div>
  )
}
