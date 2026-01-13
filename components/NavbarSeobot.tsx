'use client'

import { useState } from 'react'
import Link from 'next/link'
import ButtonSeobot from './ui/ButtonSeobot'
import SeobotAuthModal from './AuthForms/SeobotAuthModal'

export default function NavbarSeobot() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-primary-green">
                seobot
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="https://seobot.tolt.io/"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Refer to earn
              </Link>
              <Link
                href="#pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              <ButtonSeobot
                variant="primary"
                size="md"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Try now
              </ButtonSeobot>
            </div>
          </div>
        </div>
      </nav>
      <SeobotAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
