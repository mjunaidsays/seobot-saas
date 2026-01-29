// 'use client';

// import { useEffect, Suspense } from 'react';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { initPostHog, trackPageView } from '@/lib/posthog';

// function PostHogPageView() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     // Track page views when route changes
//     if (pathname) {
//       let url = window.origin + pathname;
//       if (searchParams && searchParams.toString()) {
//         url = url + '?' + searchParams.toString();
//       }
//       trackPageView(url);
//     }
//   }, [pathname, searchParams]);

//   return null;
// }

// export default function PostHogProvider({ children }: { children: React.ReactNode }) {
//   useEffect(() => {
//     // Initialize PostHog on mount
//     initPostHog();
//   }, []);

//   return (
//     <>
//       <Suspense fallback={null}>
//         <PostHogPageView />
//       </Suspense>
//       {children}
//     </>
//   );
// }


'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const PRODUCT_NAME = 'SEObot'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      // Track pageview with product identifier
      posthog.capture('$pageview', {
        $current_url: url,
        product_name: PRODUCT_NAME,
      })
      console.log('PostHog Debug: Pageview tracked', { url, product_name: PRODUCT_NAME })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProviderComponent({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only initialize once on the client
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'

      console.log('PostHog Debug: Initializing...', {
        key: key ? 'Present' : 'Missing',
        keyPrefix: key ? key.substring(0, 10) + '...' : 'N/A',
        host,
        windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A',
      })

      if (key) {
        // Validate API key format
        if (!key.startsWith('phc_')) {
          console.error(
            'PostHog Debug: ❌ Invalid API key format!',
            'The key should start with "phc_" (Project API Key).',
            'You are using a Personal API Key which is not valid for client-side tracking.',
            'Get your Project API Key from: PostHog Dashboard → Project Settings → Project API Key'
          )
        }

        try {
          posthog.init(key, {
            api_host: host,
            person_profiles: 'always',
            capture_pageview: false, // We'll handle pageviews manually
            capture_pageleave: true,
            autocapture: true,
            disable_session_recording: false,
            debug: true,
            loaded: (posthogInstance) => {
              // Register product_name as a super property (included in all events including autocapture)
              posthogInstance.register({
                product_name: PRODUCT_NAME,
              })
              
              // Also set as person property (affects Identify events)
              posthogInstance.setPersonProperties({
                product_name: PRODUCT_NAME,
              })
              
              // Ensure properties persist by re-registering
              // This ensures autocapture events get the property even if they fire before full initialization
              if (posthogInstance.__loaded) {
                posthogInstance.register({
                  product_name: PRODUCT_NAME,
                })
              }
              
              console.log('PostHog Debug: ✅ Initialized successfully!', {
                product_name: PRODUCT_NAME,
                isLoaded: posthogInstance.__loaded,
              })
              setIsInitialized(true)
              
              // Test event to verify it's working
              posthogInstance.capture('posthog_initialized', {
                product_name: PRODUCT_NAME,
                timestamp: new Date().toISOString(),
              })
              console.log('PostHog Debug: Test event sent')
            },
          })
          console.log('PostHog Debug: Init called')
        } catch (error) {
          console.error('PostHog Debug: ❌ Initialization error:', error)
        }
      } else {
        console.error(
          'PostHog Debug: ❌ Key is missing! Check .env.local and restart dev server.'
        )
      }
    } else if (posthog.__loaded) {
      console.log('PostHog Debug: Already initialized')
      // Ensure product_name is registered even if PostHog was initialized elsewhere
      posthog.register({
        product_name: PRODUCT_NAME,
      })
      posthog.setPersonProperties({
        product_name: PRODUCT_NAME,
      })
      setIsInitialized(true)
    }
  }, [])
  
  // Ensure product_name is registered whenever PostHog becomes available
  useEffect(() => {
    if (posthog.__loaded && !isInitialized) {
      posthog.register({
        product_name: PRODUCT_NAME,
      })
      posthog.setPersonProperties({
        product_name: PRODUCT_NAME,
      })
    }
  }, [isInitialized])

  // Always render children, PostHogProvider is optional
  return (
    <>
      {isInitialized && posthog.__loaded ? (
        <PostHogProvider client={posthog}>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      ) : (
        <>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </>
      )}
    </>
  )
}
