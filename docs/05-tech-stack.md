# Tech Stack & Folder Structure

## Stack
- **Mobile apps (rider + driver):** React Native + Expo (one codebase → iOS + Android)
- **Admin dashboard:** Next.js 14 (App Router) + Tailwind + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + Realtime + Storage) — replaces 80% of custom backend
- **Edge functions:** Supabase Edge Functions (Deno) for fare quoting, dispatch, webhooks
- **Maps & routing:** Google Maps Platform (Directions, Distance Matrix, Places, Maps SDK)
- **Payments:** Square SDK (cards) + PayPal SDK (wallet) — cash also supported
- **Push notifications:** Expo Push
- **SMS/voice (driver↔rider mask):** Twilio
- **AI dispatch:** custom matching algorithm in Edge Function (nearest driver weighted by rating, acceptance, tier, distance)
- **Analytics:** PostHog
- **Error tracking:** Sentry

## Repo layout
```
on-time-taxi/
├── docs/                    # specs, schemas, wireframes
├── rider-app/               # Expo React Native
├── driver-app/              # Expo React Native
├── admin-web/               # Next.js dashboard
├── backend/
│   ├── supabase/
│   │   ├── migrations/      # SQL schema
│   │   └── functions/       # edge functions
│   │       ├── quote-fare/
│   │       ├── dispatch-ride/
│   │       ├── square-webhook/
│   │       └── paypal-webhook/
│   └── shared/              # TS types shared across apps
└── README.md
```
