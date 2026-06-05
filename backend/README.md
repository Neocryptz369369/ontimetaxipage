# On-Time Taxi — Backend (Supabase)

## Quickstart
```bash
# 1. install supabase CLI
brew install supabase/tap/supabase   # or: npm i -g supabase

# 2. login & link
supabase login
supabase init                # already initialized
supabase link --project-ref <your-ref>

# 3. push schema
supabase db push

# 4. seed (dev only)
supabase db reset --linked   # WARNING: drops data
# or apply seed manually:
psql "$DATABASE_URL" -f supabase/seed.sql

# 5. set secrets
supabase secrets set GOOGLE_MAPS_KEY=...
supabase secrets set SQUARE_WEBHOOK_SIGNATURE_KEY=...

# 6. deploy edge functions
supabase functions deploy quote-fare
supabase functions deploy dispatch-ride
supabase functions deploy square-webhook
supabase functions deploy paypal-webhook
```

## Endpoints

### POST /functions/v1/quote-fare
```json
{
  "tier": "standard",
  "pickup":  { "lat": 38.4783, "lng": -85.7585, "address": "Jeffersonville, IN" },
  "dropoff": { "lat": 38.2527, "lng": -85.7585, "address": "Louisville, KY" },
  "is_round_trip": false
}
```

### POST /functions/v1/dispatch-ride
```json
{ "ride_id": "<uuid>" }
```

## Env vars
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auto in edge runtime
- `GOOGLE_MAPS_KEY` — for distance matrix
- `SQUARE_WEBHOOK_SIGNATURE_KEY` — webhook HMAC verify
