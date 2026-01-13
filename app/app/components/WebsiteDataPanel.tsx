'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WebsiteData } from '../types/website'
import { FaBars } from 'react-icons/fa'

interface WebsiteDataPanelProps {
  websiteData: WebsiteData | null
  onProceed: () => void
}

export default function WebsiteDataPanel({ websiteData, onProceed }: WebsiteDataPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (!websiteData) {
    return null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low':
        return 'bg-blue-600 text-white'
      case 'med':
        return 'bg-yellow-600 text-black'
      case 'high':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #000000 100%)' }}
    >
      {/* Header */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <span className="text-white font-mono text-sm">{websiteData.domain}</span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaBars className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Blog Focus Summary */}
        {websiteData.blogFocus && (
          <div className="mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">{websiteData.blogFocus}</p>
          </div>
        )}

        {/* Sources Section */}
        <div>
          <h3 className="text-primary-green font-mono text-sm mb-3">&gt; Sources</h3>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {websiteData.sources.map((source, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded p-3 hover:border-primary-green/50 transition-colors cursor-pointer"
              >
                <div className="text-primary-green font-mono text-xs mb-1 font-semibold">{source.type}</div>
                <div className="text-gray-400 text-xs line-clamp-3">{source.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h3 className="text-primary-green font-mono text-sm mb-3">&gt; About</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{websiteData.about}</p>
        </div>

        {/* Features Section */}
        <div className="mb-6">
          <h3 className="text-primary-green font-mono text-sm mb-3">&gt; Features</h3>
          <ul className="space-y-2">
            {websiteData.features.map((feature, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start">
                <span className="text-primary-green mr-2 font-semibold">{index + 1}.</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Headlines Section */}
        <div className="mb-6">
          <h3 className="text-primary-green font-mono text-sm mb-3">&gt; Headlines</h3>
          <div className="space-y-3">
            {websiteData.headlines.map((headline, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded p-3 hover:border-primary-green/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`${getDifficultyColor(headline.difficulty)} px-2 py-1 rounded text-xs font-semibold`}>
                    {headline.difficulty}
                  </span>
                  <span className="text-gray-400 text-xs font-mono">{headline.volume}</span>
                </div>
                <h4 className="text-white text-sm font-medium leading-snug">{headline.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-gray-500 text-xs italic mb-6">
          * You can adjust the text and choose articles later
        </div>
      </div>

      {/* Proceed Button */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={onProceed}
          className="w-full bg-orange-accent hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Proceed
        </button>
      </div>
    </motion.div>
  )
}
