'use client'
import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

let inited = false

export function initObservability() {
  if (inited || typeof window === 'undefined') return
  inited = true

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0,
    })
  }
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: true,
    })
  }
}

export function track(event: string, props?: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) posthog.capture(event, props)
}
