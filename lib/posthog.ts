'use client';

import posthog from 'posthog-js';

const PRODUCT_NAME = 'SEObot';

// Initialize PostHog only on client side
export const initPostHog = () => {
  if (typeof window === 'undefined') return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogKey || !posthogHost) {
    console.warn('PostHog environment variables are not set. Analytics will be disabled.');
    return;
  }

  // Initialize PostHog if not already initialized
  if (!posthog.__loaded) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      loaded: (posthogInstance) => {
        // Set product identifier as a user property
        posthogInstance.register({
          product_name: PRODUCT_NAME,
        });
      },
      capture_pageview: false, // We'll handle pageviews manually for Next.js App Router
      capture_pageleave: true,
    });
  }

  return posthog;
};

// Get PostHog instance (returns null if not initialized)
export const getPostHog = () => {
  if (typeof window === 'undefined') return null;
  
  // Return the instance if it's loaded, otherwise return null
  // (Initialization is handled by PostHogProvider)
  if (posthog.__loaded) {
    return posthog;
  }
  
  return null;
};

// Ensure product_name is always registered before any PostHog call
// This acts as a safety net to ensure properties are included even if register() wasn't called
const ensureProductName = () => {
  const ph = getPostHog();
  if (ph && ph.__loaded) {
    // Re-register to ensure it's set (this adds to all future events)
    ph.register({
      product_name: PRODUCT_NAME,
    });
  }
};

// Identify user with PostHog
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  const ph = getPostHog();
  if (!ph) return;

  // Ensure product_name is registered before identify
  ensureProductName();

  ph.identify(userId, {
    product_name: PRODUCT_NAME,
    ...properties,
  });
  
  // Also set as person property to ensure it appears in Identify events
  ph.setPersonProperties({
    product_name: PRODUCT_NAME,
  });
};

// Track custom event
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const ph = getPostHog();
  if (!ph) return;

  // Ensure product_name is registered before capture (for autocapture events)
  ensureProductName();

  ph.capture(eventName, {
    product_name: PRODUCT_NAME,
    ...properties,
  });
};

// Track page view
export const trackPageView = (path?: string) => {
  const ph = getPostHog();
  if (!ph) return;

  // Ensure product_name is registered before capture
  ensureProductName();

  ph.capture('$pageview', {
    product_name: PRODUCT_NAME,
    $current_url: typeof window !== 'undefined' ? window.location.href : path,
  });
};

// Reset user session (on logout)
export const resetPostHog = () => {
  const ph = getPostHog();
  if (!ph) return;

  ph.reset();
};
