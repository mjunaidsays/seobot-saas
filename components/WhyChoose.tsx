'use client'

import Section from './ui/Section'
import CardSeobot from './ui/CardSeobot'
import { motion } from 'framer-motion'

export default function WhyChoose() {
  return (
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Why choose our platform?</p>
        <h3 className="section-heading">Built for modern content teams</h3>
        <p className="text-gray-400 text-lg">
          Streamline your content workflow with intelligent automation and powerful insights.
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
                <span className="font-semibold text-white">Alex Morgan</span>
                <span className="text-gray-500 text-sm">@alexmorgan</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  This platform transformed our content operations!
                </h3>
                <div className="space-y-2 text-gray-300">
                  <p>1. <span className="text-emerald-400 font-semibold">3x increase in organic traffic</span></p>
                  <p>2. Reduced content creation time by <span className="text-emerald-400 font-semibold">80%</span></p>
                  <p>3. Generated <span className="text-emerald-400 font-semibold">150+ articles</span> in the first quarter with minimal oversight.</p>
                </div>
              </div>
            </div>
          </div>
        </CardSeobot>
      </motion.div>
    </Section>
  )
}
