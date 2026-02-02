'use client'

import Section from './ui/Section'
import { LazyMotion, m } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)

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
    <LazyMotion features={loadFeatures} strict>
    <Section className="overflow-hidden">
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Supported Languages</p>
        <h3 className="section-heading">Up Rank supports 50+ languages</h3>
      </div>

      <div className="relative space-y-4">
        {/* Row 1 - Scroll Left */}
        <m.div
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
        </m.div>

        {/* Row 2 - Scroll Right */}
        <m.div
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
        </m.div>

        {/* Row 3 - Scroll Left */}
        <m.div
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
        </m.div>

        {/* Row 4 - Scroll Right */}
        <m.div
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
        </m.div>
      </div>
    </Section>
    </LazyMotion>
  )
}
