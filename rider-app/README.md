# On-Time Taxi — Rider App (Expo / React Native)

## Setup
```bash
npm install
cp .env.example .env   # then edit values (or update app.json -> expo.extra)
npx expo start
```

Set in `app.json` under `expo.extra`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

And the Google Maps API key in `expo.ios.config.googleMapsApiKey` and `expo.android.config.googleMaps.apiKey`.

## Screens
- **Splash** → routes to Login or Home based on session
- **Login** — phone OTP via Supabase Auth
- **Home** — Map + pickup/dropoff (long-press to drop pins)
- **TierSelect** — parallel quote across all 7 tiers
- **Confirm** — payment method (Square / PayPal / Cash) → inserts ride + calls `dispatch-ride`
- **EnRoute** — realtime ride status + driver location (Supabase Realtime)
- **Rate** — 5-star rating after completion
