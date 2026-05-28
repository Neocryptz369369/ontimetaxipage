# On-Time Taxi — Admin Dashboard (Next.js 14)

## Setup
```bash
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```
Open http://localhost:3000

## Pages
- `/` — KPIs (rides today, active rides, drivers online, revenue today)
- `/rides` — recent rides with status, route, fare, payment
- `/drivers` — roster with online/offline, BG check, certs, vehicle, rating
- `/riders` — rider list
- `/tiers` — live edit base/per-mile/per-min/min-fare/surcharge per tier (server action)
- `/payouts` — payout ledger

Uses `SUPABASE_SERVICE_ROLE_KEY` server-side only. Lock this app behind your own auth (Supabase Auth + role check) before going to prod.
