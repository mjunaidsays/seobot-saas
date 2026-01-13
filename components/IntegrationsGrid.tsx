'use client'

import Section from './ui/Section'
import { motion } from 'framer-motion'
import { SiWebflow, SiWordpress, SiNotion, SiShopify, SiFramer, SiNextdotjs } from 'react-icons/si'
import { FaGhost, FaCode } from 'react-icons/fa'

const integrations = [
  { name: 'Unicorn Platform', icon: '🦄', badge: 'Unicorn Platform' },
  { name: 'Webflow', icon: SiWebflow, badge: 'Ui&ux ready' },
  { name: 'Ghost', icon: FaGhost, badge: '100% no code' },
  { name: 'WordPress', icon: SiWordpress, badge: '' },
  { name: 'Framer', icon: SiFramer, badge: '' },
  { name: 'WIX', icon: '🔷', badge: '' },
  { name: 'Shopify', icon: SiShopify, badge: '' },
  { name: 'Notion', icon: SiNotion, badge: '' },
  { name: 'HubSpot', icon: '🔶', badge: '' },
  { name: 'Next.js', icon: SiNextdotjs, badge: '' },
  { name: 'Webhooks', icon: '🔗', badge: '' },
  { name: 'REST_API', icon: FaCode, badge: '' },
]

export default function IntegrationsGrid() {
  return (
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Auto sync with popular CMS</p>
        <h3 className="section-heading">Integrations</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative group"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-primary-green transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center h-40">
              {integration.badge && (
                <div className="absolute -top-2 -right-2 bg-primary-green text-black px-2 py-1 rounded text-xs font-bold">
                  ■
                </div>
              )}
              
              <div className="text-5xl mb-3 text-white">
                {typeof integration.icon === 'string' ? (
                  integration.icon
                ) : (
                  <integration.icon className="text-white" />
                )}
              </div>
              
              <p className="text-white text-sm font-semibold text-center">
                {integration.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
