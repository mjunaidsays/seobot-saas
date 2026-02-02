'use client'

import Section from './ui/Section'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { LazyMotion, m, AnimatePresence } from 'framer-motion'
import faqData from '@/data/faq.json'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <LazyMotion features={loadFeatures} strict>
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} FAQ</p>
        <h3 className="section-heading">Got any questions?</h3>
        <p className="text-gray-400 text-lg">
          Find answers to common questions about Up Rank.
        </p>
        <p className="text-gray-500 mt-2">Or find an answer in the faq below 👇</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqData.map((faq, index) => (
          <m.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glass rounded-2xl overflow-hidden glass-hover"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-white font-medium pr-8">
                {faq.id}. {faq.question}
              </span>
              <FaChevronDown
                className={`text-emerald-400 flex-shrink-0 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openId === faq.id && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        ))}
      </div>
    </Section>
    </LazyMotion>
  )
}
