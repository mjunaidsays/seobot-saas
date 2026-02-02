import { Metadata } from 'next'
import NavbarSeobot from '@/components/NavbarSeobot'
import FooterSeobot from '@/components/FooterSeobot'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Up Rank',
}

const linkClass =
  'text-emerald-400 hover:text-emerald-300 transition-all duration-300 underline underline-offset-2 hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <NavbarSeobot />
      <div className="pt-24 md:pt-28 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-lg border border-white/10 p-6 md:p-10">
            <h1 className="section-heading text-white mb-6">Privacy Policy</h1>
            <p className="text-slate-400 leading-relaxed mb-8">
              This Privacy Policy describes how Up Rank (&quot;we&quot;) collects, uses, and
              protects your data on our website{' '}
              <Link href="https://up-rank.vercel.app/" target="_blank" className={linkClass}>
                https://up-rank.vercel.app/
              </Link>
              .
            </p>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">1. Data We Collect</h2>
              <p className="text-slate-400 leading-relaxed">
                We collect the following data: Name, Email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">2. Use of Data</h2>
              <p className="text-slate-400 leading-relaxed">
                Collected data is used to provide services, improve the website, and for
                analytics purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">3. Data Protection</h2>
              <p className="text-slate-400 leading-relaxed">
                We implement technical and organizational measures to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">
                4. Sharing Data with Third Parties
              </h2>
              <p className="text-slate-400 leading-relaxed">
                We do not share your data with third parties, except as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">5. Your Rights</h2>
              <p className="text-slate-400 leading-relaxed">
                You may request access, correction, or deletion of your data by contacting us
                at:{' '}
                <Link href="mailto:bilal.shahid@nuclieos.com" className={linkClass}>
                  bilal.shahid@nuclieos.com
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">6. Contact Us</h2>
              <p className="text-slate-400 leading-relaxed">
                If you have any questions, please contact us at:{' '}
                <Link href="mailto:bilal.shahid@nuclieos.com" className={linkClass}>
                  bilal.shahid@nuclieos.com
                </Link>
                .
              </p>
            </section>

            <p className="text-slate-500 text-sm">Last updated: February 2nd, 2026</p>
          </div>
        </div>
      </div>
      <FooterSeobot />
    </main>
  )
}
