import * as Sentry from 'sentry-expo'
import PostHog from 'posthog-react-native'

let posthog: PostHog | null = null

export function initObservability() {
  if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      enableInExpoDevelopment: false,
      debug: false,
      tracesSampleRate: 0.2,
    })
  }
  if (process.env.EXPO_PUBLIC_POSTHOG_KEY) {
    posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY, {
      host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    })
  }
}

export function track(event: string, props?: Record<string, any>) {
  posthog?.capture(event, props)
}

export function identify(userId: string, props?: Record<string, any>) {
  posthog?.identify(userId, props)
}

export function captureError(err: unknown, ctx?: Record<string, any>) {
  console.error(err, ctx)
  Sentry.Native.captureException(err, { extra: ctx })
}
