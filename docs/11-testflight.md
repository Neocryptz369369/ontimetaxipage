# TestFlight & Play Store Internal — Launch Checklist

## Prereqs (one-time)
1. **Apple Developer** — $99/yr enrolled; create App ID `com.ontimetaxi.rider` and `com.ontimetaxi.driver`.
2. **App Store Connect** — create two app records (Rider, Driver), bundle IDs match above.
3. **Google Play Console** — $25 once; create two app entries.
4. **EAS** — `npm i -g eas-cli && eas login`. From each app dir: `eas init --id <expo-project-id>`.

## Env / secrets to set on EAS
```bash
cd rider-app
eas secret:create --scope project --name SUPABASE_URL --value https://...
eas secret:create --scope project --name SUPABASE_ANON_KEY --value eyJ...
eas secret:create --scope project --name SENTRY_DSN --value https://...
eas secret:create --scope project --name POSTHOG_KEY --value phc_...
eas secret:create --scope project --name GOOGLE_MAPS_KEY --value AIza...
# repeat for driver-app
```

## Build & submit — Rider
```bash
cd rider-app
eas build --platform ios --profile production --auto-submit
eas build --platform android --profile production --auto-submit
```

## Build & submit — Driver
```bash
cd driver-app
eas build --platform ios --profile production --auto-submit
eas build --platform android --profile production --auto-submit
```

## App Store Connect metadata (paste into each app)

**Rider — On-Time Taxi**
- Subtitle: Fast, fair rides on demand
- Category: Travel, Secondary: Navigation
- Keywords: taxi,ride,cab,rideshare,airport,booking
- Description: see `docs/app-store-rider.txt`
- Support URL: https://ontimetaxi.com/support
- Privacy URL: https://ontimetaxi.com/privacy

**Driver — On-Time Taxi Driver**
- Subtitle: Drive. Earn. Cash out weekly.
- Category: Business, Secondary: Navigation
- Description: see `docs/app-store-driver.txt`

## Required privacy disclosures (App Store + Play)
- **Location** — Precise (foreground + background) — required for ride pickup/dispatch, not used for tracking.
- **Contact info** — Email, phone (for receipts/SMS).
- **Identifiers** — User ID (Supabase UUID).
- **Payment info** — Handled by Square / PayPal / Stripe; not stored by us.
- **Diagnostics** — Sentry/PostHog, NOT linked to identity (we anonymize).

## TestFlight internal testers
Add your 5–10 testers' Apple IDs in App Store Connect → TestFlight → Internal Testing. They receive an email + can install via TestFlight app.

## Play Internal track
Console → Testing → Internal testing → Create release → upload AAB (eas does this) → add testers by email or Google Group → share opt-in URL.

## Smoke test script (run on a real device after install)
See `docs/12-smoke-test.md`.
