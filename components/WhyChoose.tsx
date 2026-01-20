'use client'

import Section from './ui/Section'
import CardSeobot from './ui/CardSeobot'
import { motion } from 'framer-motion'

export default function WhyChoose() {
  return (
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Why choose SEObot?</p>
        <h3 className="section-heading">SEO for project-busy founders</h3>
        <p className="text-gray-400 text-lg">
          SEO Bot is an all-in-one SEO AI agent that saves you time and effort.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <CardSeobot className="glass bg-gradient-to-br from-white/5 to-white/0 border-emerald-500/30 glass-hover">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold text-white">Santiago Poli</span>
                <span className="text-gray-500 text-sm">@santiagopoli</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Hey John, I need to give you an update on that!
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>1. <span className="text-emerald-400 font-semibold">500 clicks a day</span></p>
                  <p>2. The cost was <span className="text-emerald-400 font-semibold">$1000 in article</span></p>
                  <p>3. We closed a <span className="text-emerald-400 font-semibold">$6500 client</span> when the business wasn&apos;t even operational.</p>
                </div>
              </div>
            </div>
          </div>
        </CardSeobot>
      </motion.div>
    </Section>
  )
}
