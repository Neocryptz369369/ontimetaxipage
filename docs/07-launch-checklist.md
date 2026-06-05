# Launch checklist

## Secrets to set (Supabase → Project Settings → Edge Function secrets)
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENV` (sandbox/production)
- `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_ENV` (sandbox/live)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- `GOOGLE_MAPS_SERVER_KEY`

## GitHub Action secrets
- `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`
- `VERCEL_TOKEN`
- `EXPO_TOKEN`

## App env (`.env` files)
### rider-app & driver-app (`.env`)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SQUARE_APP_ID=
EXPO_PUBLIC_GOOGLE_MAPS_KEY=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_POSTHOG_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### admin-web (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Promote first admin
```sql
update public.users set role = 'admin' where email = 'you@example.com';
```

## Supabase DB Webhook
- Table: `public.rides`, event: `UPDATE`
- HTTP: `POST {SUPABASE_URL}/functions/v1/ride-status-sms`
- Headers: `Authorization: Bearer {SERVICE_ROLE_KEY}`

## Manual preview builds
GitHub → Actions → "EAS Preview Build" → pick `rider-app` / `driver-app` + platform.

## Edge functions deployed automatically on push to `main`
(See `.github/workflows/deploy-edge.yml`.)
