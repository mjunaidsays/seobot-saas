'use client'

import { useState } from 'react'
import { FaComments } from 'react-icons/fa'

export default function ChatWidget() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 bg-white text-black px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <p className="font-medium">Need help?</p>
            <p className="text-sm text-gray-600">The team typically replies in a day.</p>
          </div>
        )}

        {/* Chat Button */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Open chat"
        >
          <FaComments className="text-2xl" />
        </button>
      </div>
    </div>
  )
}
