'use client'

import Section from './ui/Section'
import CardSeobot from './ui/CardSeobot'
import { LazyMotion, m } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import articlesData from '@/data/articles.json'

const categoryColors: { [key: string]: string } = {
  'Listicles': 'bg-emerald-500 text-white',
  'How-to Guides': 'bg-purple-600 text-white',
  'Checklists': 'bg-blue-600 text-white',
  'QA Articles': 'bg-orange-600 text-white',
  'Versus Articles': 'bg-pink-600 text-white',
  'Roundups': 'bg-yellow-600 text-black',
  'Ultimate Guides': 'bg-red-600 text-white',
}

export default function ArticleGrid() {
  return (
    <LazyMotion features={loadFeatures} strict>
    <Section>
      <div className="text-center mb-16">
        <p className="section-title">{'//'} Articles examples</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {articlesData.map((article, index) => (
          <m.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <CardSeobot className="h-full glass-hover cursor-pointer">
              <div className="mb-3">
                <span className={`${categoryColors[article.category] || 'bg-gray-700 text-white'} px-3 py-1 rounded-md text-sm font-semibold`}>
                  {article.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 hover:text-emerald-400 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                {article.description}
              </p>
              
              <Link
                href={article.link}
                className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 hover:underline font-medium text-sm group transition-colors"
              >
                <span>Read more</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardSeobot>
          </m.div>
        ))}
      </div>
    </Section>
    </LazyMotion>
  )
}
