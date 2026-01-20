'use client'

import Section from './ui/Section'
import { motion } from 'framer-motion'
import testimonialsData from '@/data/testimonials.json'

export default function Testimonials() {
  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData]

  return (
    <Section className="overflow-hidden">
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Wall of love 😍</p>
        <h3 className="section-heading">Thousands of users</h3>
        <p className="text-gray-400 text-lg">
          used SEObot and brought traffic to their blogs
        </p>
      </div>

      <div className="relative">
        {/* First Row - Scroll Left */}
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-6 mb-6"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-80 glass rounded-2xl p-6 glass-hover"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white truncate">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm truncate">{testimonial.username}</p>
                    </div>
                    <span className="text-xl">𝕏</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {testimonial.content}
              </p>
              
              {testimonial.image && (
                <div className="bg-black/30 rounded-xl h-32 mb-3 border border-white/5" />
              )}
              
              <p className="text-gray-500 text-xs">{testimonial.date}</p>
            </div>
          ))}
        </motion.div>

        {/* Second Row - Scroll Right */}
        <motion.div
          animate={{
            x: [-1000, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex space-x-6"
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-rev-${index}`}
              className="flex-shrink-0 w-80 glass rounded-2xl p-6 glass-hover"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white truncate">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm truncate">{testimonial.username}</p>
                    </div>
                    <span className="text-xl">𝕏</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {testimonial.content}
              </p>
              
              {testimonial.image && (
                <div className="bg-black/30 rounded-xl h-32 mb-3 border border-white/5" />
              )}
              
              <p className="text-gray-500 text-xs">{testimonial.date}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
