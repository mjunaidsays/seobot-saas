import Link from 'next/link'

export default function FooterSeobot() {
  return (
    <footer className="bg-black border-t border-gray-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-2xl font-bold text-primary-green">seobot</span>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact Founders */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact founders</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:support@seobotai.com"
                  className="text-gray-400 hover:text-primary-green transition-colors text-sm"
                >
                  support@seobotai.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/johnrushx"
                  target="_blank"
                  className="text-gray-400 hover:text-primary-green transition-colors text-sm"
                >
                  x.com/johnrushx
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/vitalik_may"
                  target="_blank"
                  className="text-gray-400 hover:text-primary-green transition-colors text-sm"
                >
                  x.com/vitalik_may
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/seobotai"
                  target="_blank"
                  className="text-gray-400 hover:text-primary-green transition-colors text-sm"
                >
                  x.com/seobotai
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* API & Integrations */}
          <div>
            <h3 className="text-white font-semibold mb-4">API & Integrations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  REST API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  NextJs integration
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Webhooks
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  WordPress
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Webflow
                </Link>
              </li>
            </ul>
          </div>

          {/* Mars Verse */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mars Verse</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  John Rush
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  MarsX
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  Unicorn Platform
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary-green transition-colors text-sm">
                  DevHunt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Copyright © 2025 SEO Bot AI
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <span>Built on </span>
            <Link
              href="https://unicornplatform.com"
              target="_blank"
              className="ml-1 text-primary-green hover:underline"
            >
              Unicorn Platform
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
