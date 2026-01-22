'use client'

import Section from './ui/Section'
import { motion } from 'framer-motion'

const languages = [
  'Arabic', 'Basque', 'Bengali', 'Bulgarian', 'Catalan', 'Chinese',
  'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Estonian',
  'Finnish', 'French', 'Galician', 'German', 'Gujarati', 'Hebrew',
  'Hindi', 'Hungarian', 'Italian', 'Japanese', 'Korean', 'Latvian',
  'Portuguese', 'Russian', 'Spanish', 'Swedish', 'Turkish', 'Ukrainian'
]

export default function LanguagePills() {
  // Duplicate languages array for seamless infinite scroll
  const duplicatedLanguages = [...languages, ...languages, ...languages]
  
  // Split languages into 4 rows for visual variety
  const row1 = duplicatedLanguages.slice(0, 24)
  const row2 = duplicatedLanguages.slice(24, 48)
  const row3 = duplicatedLanguages.slice(48, 72)

  return (
    <Section className="overflow-hidden">
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Supported Languages</p>
        <h3 className="section-heading">SEO bot supports 50+ languages</h3>
      </div>

      <div className="relative space-y-4">
        {/* Row 1 - Scroll Left */}
        <motion.div
          animate={{
            x: [0, -1200],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-3"
        >
          {row1.map((language, index) => (
            <div
              key={`${language}-1-${index}`}
              className="flex-shrink-0 glass hover:border-emerald-500/50 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 cursor-default hover:scale-105"
            >
              {language}
            </div>
          ))}
        </motion.div>

        {/* Row 2 - Scroll Right */}
        <motion.div
          animate={{
            x: [-1200, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-3"
        >
          {row2.map((language, index) => (
            <div
              key={`${language}-2-${index}`}
              className="flex-shrink-0 glass hover:border-emerald-500/50 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 cursor-default hover:scale-105"
            >
              {language}
            </div>
          ))}
        </motion.div>

        {/* Row 3 - Scroll Left */}
        <motion.div
          animate={{
            x: [0, -1200],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-3"
        >
          {row3.map((language, index) => (
            <div
              key={`${language}-3-${index}`}
              className="flex-shrink-0 glass hover:border-emerald-500/50 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 cursor-default hover:scale-105"
            >
              {language}
            </div>
          ))}
        </motion.div>

        {/* Row 4 - Scroll Right */}
        <motion.div
          animate={{
            x: [-1200, 0],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-3"
        >
        </motion.div>
      </div>
    </Section>
  )
}
