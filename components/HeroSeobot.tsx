'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ButtonSeobot from './ui/ButtonSeobot'
import Link from 'next/link'
import Image from 'next/image'
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import SeobotAuthModal from './AuthForms/SeobotAuthModal'

const audiences = [
  'solo makers',
  'busy founders',
  'marketers',
  'project-busy founders',
  'entrepreneurs',
  'startups',
]

export default function HeroSeobot() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % audiences.length)
        setIsTyping(true)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary-green text-sm md:text-base font-mono font-bold mb-6"
        >
          {'//'} Powered by AI and GPT agents
        </motion.p>

        {/* Main Heading with Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-mono leading-tight">
            SEObot — fully autonomous «SEO Robot»
            <br />
            with AI agents for{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary-green inline-block"
                >
                  {audiences[currentIndex]}
                </motion.span>
              </AnimatePresence>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-1 text-primary-green"
              >
                |
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto"
        >
          SEObot takes 100% of SEO work out of your way so that you
          <br />
          can focus on building your product.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          <ButtonSeobot
            variant="primary"
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Get more SEO traffic
          </ButtonSeobot>
        </motion.div>

        {/* Pricing Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-gray-400 text-sm mb-12"
        >
          * subscriptions start at $49/mo
        </motion.p>

        {/* Founder Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="inline-block bg-gray-900 border border-gray-800 rounded-lg p-6 text-left"
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0" />
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-primary-green font-medium">Got a question?</span>
                <span className="text-2xl">↗</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                DM me on{' '}
                <Link
                  href="https://www.linkedin.com/in/johnrushx/"
                  target="_blank"
                  className="text-primary-green hover:underline"
                >
                  LinkedIn
                </Link>
                ,{' '}
                <Link
                  href="https://twitter.com/johnrushx"
                  target="_blank"
                  className="text-primary-green hover:underline"
                >
                  Twitter
                </Link>
                , or by{' '}
                <Link
                  href="mailto:john@seobotai.com"
                  className="text-primary-green hover:underline"
                >
                  Email
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <SeobotAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  )
}
