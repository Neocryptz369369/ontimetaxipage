# On-Time Taxi — Driver App (Expo / React Native)

## Setup
```bash
npm install
npx expo start
```

Fill in `app.json` → `expo.extra.SUPABASE_URL`, `SUPABASE_ANON_KEY` and the Google Maps API keys.

## Screens
- **Splash** — session check
- **Login** — phone OTP
- **DriverHome** — online toggle (starts background location task), today's earnings, listens for offers
- **IncomingRide** — 20s offer modal, accept/decline
- **ActiveRide** — status machine (accepted → arriving → arrived → in_progress → completed), Open-in-Maps
- **Earnings** — last 30 days

## Background location
`src/location.ts` uses `expo-task-manager` to write to `driver_pings` and update `drivers.current_*` every 5s while online — this is what feeds the rider's live tracking map and the dispatch algorithm.
