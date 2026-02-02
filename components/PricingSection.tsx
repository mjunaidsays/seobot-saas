'use client'

import Section from './ui/Section'
import ButtonSeobot from './ui/ButtonSeobot'
import Link from 'next/link'
import { FaCheck, FaRocket, FaCrown, FaBuilding } from 'react-icons/fa'
import { LazyMotion, m } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)

const pricingPlans = [
  {
    name: 'Starter',
    icon: FaRocket,
    price: 49,
    description: 'Perfect for small projects and solo creators',
    features: [
      'Up to 20 articles per month',
      'Basic keyword research',
      'Content optimization tools',
      'Email support',
      'Standard templates',
      'Analytics dashboard',
    ],
    popular: false,
    color: 'emerald',
  },
  {
    name: 'Pro',
    icon: FaCrown,
    price: 99,
    description: 'Ideal for growing businesses and teams',
    features: [
      'Up to 100 articles per month',
      'Advanced keyword research',
      'AI-powered content generation',
      'Priority support',
      'Custom templates',
      'Advanced analytics',
      'Internal linking automation',
      'Multi-language support',
    ],
    popular: true,
    color: 'cyan',
  },
  {
    name: 'Enterprise',
    icon: FaBuilding,
    price: 249,
    description: 'For large organizations with high-volume needs',
    features: [
      'Unlimited articles',
      'Custom AI training',
      'Dedicated account manager',
      '24/7 priority support',
      'White-label options',
      'Advanced integrations',
      'Custom workflows',
      'Team collaboration tools',
      'API access',
    ],
    popular: false,
    color: 'purple',
  },
]

export default function PricingSection() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <Section id="pricing">
        <div className="text-center mb-16">
        <p className="section-title">{'//'} Pricing</p>
        <h3 className="section-heading">Choose the plan that fits your needs</h3>
        <p className="text-slate-400 text-lg mt-4">
          Flexible pricing designed to scale with your business
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            const isPopular = plan.popular
            
            return (
              <m.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`glass rounded-2xl p-8 h-full flex flex-col transition-all duration-300 ${
                    isPopular
                      ? 'border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105'
                      : 'glass-hover'
                  }`}
                >
                  {/* Icon and Plan Name */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      plan.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/20' :
                      plan.color === 'cyan' ? 'from-cyan-500/20 to-cyan-600/20' :
                      'from-purple-500/20 to-purple-600/20'
                    }`}>
                      <Icon className={`text-2xl ${
                        plan.color === 'emerald' ? 'text-emerald-400' :
                        plan.color === 'cyan' ? 'text-cyan-400' :
                        'text-purple-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-slate-400 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">$</span>
                      <span className={`text-6xl font-bold ml-1 ${
                        plan.color === 'emerald' ? 'text-emerald-400' :
                        plan.color === 'cyan' ? 'text-cyan-400' :
                        'text-purple-400'
                      }`}>
                        {plan.price}
                      </span>
                      <span className="text-slate-400 ml-2">/month</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/app" className="block mb-6">
                    <ButtonSeobot
                      variant={isPopular ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                    >
                      Get Started
                    </ButtonSeobot>
                  </Link>

                  {/* Features List */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <FaCheck className={`mt-1 flex-shrink-0 ${
                          plan.color === 'emerald' ? 'text-emerald-400' :
                          plan.color === 'cyan' ? 'text-cyan-400' :
                          'text-purple-400'
                        }`} />
                        <p className="text-sm text-slate-300 leading-relaxed">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </m.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 text-sm">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Need a custom plan? <Link href="#" className="text-emerald-400 hover:underline">Contact us</Link>
          </p>
        </m.div>
        </div>
      </Section>
    </LazyMotion>
  )
}
