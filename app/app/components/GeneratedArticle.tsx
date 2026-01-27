'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCopy, FaDownload, FaTimes } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { trackEvent } from '@/lib/posthog'

export interface GeneratedArticle {
  title: string
  article: string
  keywords: string[]
  word_count: number
}

interface GeneratedArticleProps {
  article: GeneratedArticle
  index: number
}

export default function GeneratedArticle({ article, index }: GeneratedArticleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article.article)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy article:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([article.article], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleOpenFullscreen = () => {
    setIsFullscreen(true)
    // Track article viewed event
    trackEvent('article_viewed', {
      article_title: article.title,
      word_count: article.word_count,
      keywords_count: article.keywords.length,
    })
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  // Handle Escape key to close fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isFullscreen])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6 cursor-pointer hover:border-primary-green/50 transition-colors"
        onClick={handleOpenFullscreen}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {article.keywords.slice(0, 5).map((keyword, idx) => (
                <span
                  key={idx}
                  className="bg-primary-green/20 text-primary-green px-2 py-1 rounded text-xs font-mono"
                >
                  {keyword}
                </span>
              ))}
              {article.keywords.length > 5 && (
                <span className="text-gray-400 text-xs">+{article.keywords.length - 5} more</span>
              )}
            </div>
            <p className="text-gray-400 text-sm font-mono">
              {article.word_count.toLocaleString()} words
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCopy}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors"
              title="Copy article"
            >
              <FaCopy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors"
              title="Download article"
            >
              <FaDownload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Content Preview */}
        <div className="bg-gray-950 border border-gray-800 rounded p-4 max-h-96 overflow-y-auto">
          <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-code:text-primary-green prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:text-gray-400 prose-blockquote:border-gray-700 prose-a:text-primary-green prose-a:no-underline hover:prose-a:underline prose-table:text-gray-300 prose-th:border-gray-700 prose-td:border-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.article}
            </ReactMarkdown>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 rounded-xl flex items-center justify-center p-6"
            onClick={handleCloseFullscreen}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90%] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseFullscreen}
                className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                title="Close (Esc)"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {/* Article Header */}
              <div className="p-6 border-b border-gray-800 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white mb-3 pr-10">{article.title}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.keywords.slice(0, 5).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-green/20 text-primary-green px-2 py-1 rounded text-xs font-mono"
                    >
                      {keyword}
                    </span>
                  ))}
                  {article.keywords.length > 5 && (
                    <span className="text-gray-400 text-xs">+{article.keywords.length - 5} more</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm font-mono">
                  {article.word_count.toLocaleString()} words
                </p>
              </div>

              {/* Article Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-code:text-primary-green prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-blockquote:text-gray-400 prose-blockquote:border-gray-700 prose-a:text-primary-green prose-a:no-underline hover:prose-a:underline prose-table:text-gray-300 prose-th:border-gray-700 prose-td:border-gray-700 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.article}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-800 flex gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopy()
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <FaCopy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
