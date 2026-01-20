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
    <section className="min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-16 px-4 md:px-8 relative">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-emerald-400 text-sm md:text-base font-mono font-bold mb-8 tracking-tight"
        >
          {'//'} Powered by AI and GPT agents
        </motion.p>

        {/* Main Heading with Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="gradient-text">SEObot</span> — fully autonomous{' '}
            <span className="gradient-text-accent">«SEO Robot»</span>
            <br />
            <span className="text-slate-100">with AI agents for{' '}</span>
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-emerald-400 inline-block font-semibold"
                >
                  {audiences[currentIndex]}
                </motion.span>
              </AnimatePresence>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block ml-1 text-emerald-400"
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
          className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <ButtonSeobot
            variant="primary"
            size="lg"
            onClick={() => setIsAuthModalOpen(true)}
            className="text-lg px-10 py-5"
          >
            Get more SEO traffic
          </ButtonSeobot>
        </motion.div>

        {/* Pricing Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-slate-400 text-sm mb-16 font-mono"
        >
          * subscriptions start at $49/mo
        </motion.p>

        {/* Founder Card */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="inline-block glass rounded-2xl p-6 md:p-8 text-left glass-hover"
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex-shrink-0 border border-emerald-500/30"></div>
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-emerald-400 font-semibold">Got a question?</span>
                <span className="text-2xl">↗</span>
              </div>
              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                DM me on{' '}
                <Link
                  href="https://www.linkedin.com/in/johnrushx/"
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  LinkedIn
                </Link>
                ,{' '}
                <Link
                  href="https://twitter.com/johnrushx"
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Twitter
                </Link>
                , or by{' '}
                <Link
                  href="mailto:john@seobotai.com"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                >
                  Email
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
      <SeobotAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  )
}
