'use client'

import Section from './ui/Section'
import { LazyMotion, m } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)

const statsData = [
  {
    site: 'techstartup.io',
    rotation: -2,
    color: 'bg-blue-600',
  },
  {
    site: 'digitalmarketing.pro',
    rotation: 3,
    color: 'bg-purple-600',
  },
  {
    site: 'contentstudio.app',
    rotation: -3,
    color: 'bg-blue-500',
  },
  {
    site: 'growthhacker.xyz',
    rotation: 2,
    color: 'bg-purple-500',
  },
]

export default function StatsShowcase() {
  return (
    <LazyMotion features={loadFeatures} strict>
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Transform your content strategy</p>
        <h3 className="section-heading">Millions of articles generated</h3>
        <p className="text-gray-400 text-lg">
          Powering content strategies for thousands of businesses worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
        {statsData.map((stat, index) => (
          <m.div
            key={stat.site}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            <div
              className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:rotate-0 glass-hover"
              style={{ transform: `rotate(${stat.rotation}deg)` }}
            >
              {/* Orange Label */}
              <div className="absolute -top-3 -right-3 bg-orange-accent text-black px-4 py-2 rounded-lg font-bold text-sm rotate-3 shadow-lg">
                {stat.site}
              </div>

              {/* Mock Analytics Card */}
              <div className="space-y-4">
                {/* Stats Header */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className={`${stat.color} px-3 py-1 rounded text-white text-xs font-semibold`}>
                      Total clicks
                    </div>
                    <div className="text-gray-400 text-xs">Last 3 months</div>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-48 bg-black/30 rounded-xl relative overflow-hidden border border-white/5">
                  <div className="absolute inset-0 flex items-end p-4">
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <path
                        d="M 0,130 Q 50,120 100,110 T 200,80 T 300,40 T 400,20"
                        fill="none"
                        stroke={stat.color.replace('bg-', '#')}
                        strokeWidth="2"
                        className="opacity-70"
                      />
                      <path
                        d="M 0,140 Q 50,135 100,125 T 200,100 T 300,70 T 400,50"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {/* Stats overlay */}
                  <div className="absolute top-4 left-4 space-y-1">
                    <div className="text-white text-2xl font-bold">
                      {index === 0 ? '2.5K' : index === 1 ? '8.9K' : index === 2 ? '52.3K' : '6.7K'}
                    </div>
                    <div className="text-emerald-400 text-sm">
                      ↑ {index === 0 ? '56.2K' : index === 1 ? '312K' : index === 2 ? '1.8M' : '178K'} impressions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        ))}
      </div>
    </Section>
    </LazyMotion>
  )
}
