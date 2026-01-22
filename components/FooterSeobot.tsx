import Link from 'next/link'

export default function FooterSeobot() {
  return (
    <footer className="glass border-t border-white/10 py-12 md:py-16 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-2xl font-bold text-emerald-400 tracking-tight">seobot</span>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Contact Founders */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact founders</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:contact@nuclieos.com"
                  className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                >
                  contact@nuclieos.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/company/nuclieos/posts/?feedView=all"
                  target="_blank"
                  className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                >
                  LinkedIn
                </Link>
              </li>
              {/* <li>
                <Link
                  href="https://x.com/vitalik_may"
                  target="_blank"
                  className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                >
                  x.com/vitalik_may
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/seobotai"
                  target="_blank"
                  className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"
                >
                  x.com/seobotai
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
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
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  REST API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  NextJs integration
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Webhooks
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  WordPress
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
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
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  John Rush
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  MarsX
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  Unicorn Platform
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-sm hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">
                  DevHunt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            Copyright © 2025 SEO Bot AI
          </p>
          {/* <div className="flex items-center text-gray-500 text-sm">
            <span>Built on </span>
            <Link
              href="https://unicornplatform.com"
              target="_blank"
              className="ml-1 text-emerald-400 hover:underline"
            >
              Unicorn Platform
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
