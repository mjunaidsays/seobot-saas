'use client'

import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  animate?: boolean
  id?: string
}

export default function Section({ children, className, animate = true, id }: SectionProps) {
  if (!animate) {
    return (
      <section id={id} className={cn('py-24 md:py-32 px-4 md:px-8', className)}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={cn('py-24 md:py-32 px-4 md:px-8', className)}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </motion.section>
  )
}
