import { Metadata } from 'next'
import NavbarSeobot from '@/components/NavbarSeobot'
import FooterSeobot from '@/components/FooterSeobot'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use | Up Rank',
}

const linkClass =
  'text-emerald-400 hover:text-emerald-300 transition-all duration-300 underline underline-offset-2 hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]'

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <NavbarSeobot />
      <div className="pt-24 md:pt-28 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-lg border border-white/10 p-6 md:p-10">
            <h1 className="section-heading text-white mb-6">Terms of Service</h1>
            <p className="text-slate-400 leading-relaxed mb-8">
              These Terms of Use govern your use of Up Rank and our website at{' '}
              <Link href="https://up-rank.vercel.app/" target="_blank" className={linkClass}>
                https://up-rank.vercel.app/
              </Link>
              . By accessing or using our services, you agree to these terms.
            </p>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-400 leading-relaxed">
                By creating an account or using Up Rank, you agree to be bound by these Terms of
                Use and our Privacy Policy. If you do not agree, do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">2. Description of Service</h2>
              <p className="text-slate-400 leading-relaxed">
                Up Rank provides SEO and content-related tools and services. We reserve the
                right to modify, suspend, or discontinue any part of the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">3. Account and Registration</h2>
              <p className="text-slate-400 leading-relaxed">
                You must provide accurate information when registering. You are responsible for
                maintaining the confidentiality of your account and for all activity under
                your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">4. Acceptable Use</h2>
              <p className="text-slate-400 leading-relaxed">
                You agree not to use the service for any unlawful purpose or in any way that
                could damage, disable, or impair the service or interfere with others&apos; use.
                You must comply with all applicable laws and our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">
                5. Payments and Subscriptions
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Paid plans are subject to the pricing and billing terms presented at the time
                of purchase. Fees are non-refundable except as required by law or as stated
                in our refund policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">6. Intellectual Property</h2>
              <p className="text-slate-400 leading-relaxed">
                Up Rank and its content, features, and functionality are owned by us and
                protected by intellectual property laws. You may not copy, modify, or
                distribute our materials without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">7. Disclaimers</h2>
              <p className="text-slate-400 leading-relaxed">
                The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
                any kind. We do not guarantee specific SEO or business results from use of
                our tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">
                8. Limitation of Liability
              </h2>
              <p className="text-slate-400 leading-relaxed">
                To the maximum extent permitted by law, Up Rank shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any
                loss of profits or data arising from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">9. Termination</h2>
              <p className="text-slate-400 leading-relaxed">
                We may suspend or terminate your access to the service at any time for
                violation of these terms or for any other reason. You may cancel your
                account at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">10. Governing Law</h2>
              <p className="text-slate-400 leading-relaxed">
                These terms are governed by the laws applicable in our jurisdiction. Any
                disputes shall be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-3">11. Contact Us</h2>
              <p className="text-slate-400 leading-relaxed">
                For questions about these Terms of Use, contact us at:{' '}
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
