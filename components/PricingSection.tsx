'use client'

import Section from './ui/Section'
import ButtonSeobot from './ui/ButtonSeobot'
import Link from 'next/link'
import { FaCheck } from 'react-icons/fa'
import { motion } from 'framer-motion'

const features = [
  'What you get:',
  'Fully automated onboarding. Just enter your url and press "go"',
  'SEObot will research your site, audience and keywords',
  'SEObot will make a content plan and start producing articles every week',
  'You can approve/decline or even moderate articles if you want to',
  "It'll do internal linking for articles and your site pages",
  'Up to 4000 words, YouTube embeds, Image gen, Google Image insertion, Tables, Lists and more.',
  'Anti typo hallucination and fact checking system, with citation of sources. Agents runs 100s of tasks & jobs per article.',
]

export default function PricingSection() {
  return (
    <Section id="pricing">
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Pricing</p>
        <h3 className="section-heading">Perhaps the best ROI on the market</h3>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-8"
          >
            <h3 className="text-white font-bold text-xl mb-4">
              Built with <span className="text-primary-green">AI-Powered SEO</span>
            </h3>
            
            <div className="space-y-4 text-gray-400">
              <p>
                SEObot leverages advanced AI to analyze your website, understand your audience, and create targeted content that ranks.
              </p>
              <p>
                Our users have seen significant traffic growth with automated, high-quality content generation.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-primary-green rounded-lg p-8"
          >
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-white mb-2">
                $<span className="text-7xl text-primary-green">49</span>
              </div>
              <p className="text-gray-400">/month</p>
              <p className="text-sm text-gray-500 mt-2">Subscriptions start at</p>
            </div>

            <Link href="/app" className="block mb-6">
              <ButtonSeobot variant="primary" size="lg" className="w-full">
                Drive SEO traffic →
              </ButtonSeobot>
            </Link>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <FaCheck className="text-primary-green mt-1 flex-shrink-0" />
                  <p className={`text-sm ${index === 0 ? 'font-bold text-white' : 'text-gray-300'}`}>
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
