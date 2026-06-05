# 🚖 On Time Taxi

> **Everyone needs a ride.**  
> Anywhere pickup. Anywhere drop-off. Even out of state, same day.

**Launch market:** Clark County, Indiana

## What's in this repo

| Folder | Purpose |
|---|---|
| `docs/` | Brand, pricing, schema, wireframes, HTML mockups |
| `rider-app/` | React Native (Expo) — iOS + Android rider app |
| `driver-app/` | React Native (Expo) — iOS + Android driver app |
| `admin-web/` | Next.js 14 + Tailwind operations dashboard |
| `backend/supabase/` | Postgres migrations + edge functions (fare quote, AI dispatch) |

## Quickstart

### 1. Backend (Supabase)
```bash
# install Supabase CLI: https://supabase.com/docs/guides/cli
supabase init
supabase start                    # local dev
supabase db push                  # apply migrations
supabase functions deploy quote-fare
supabase functions deploy dispatch-ride
```

### 2. Rider app
```bash
cd rider-app
cp .env.example .env              # fill SUPABASE keys
npm install
npx expo start                    # scan QR with Expo Go on phone
```

### 3. Driver app
```bash
cd driver-app
cp .env.example .env
npm install && npx expo start
```

### 4. Admin
```bash
cd admin-web
cp .env.example .env
npm install && npm run dev        # http://localhost:3000
```

## Visual mockups
Open `docs/mockups.html` in your browser to see styled previews of all 6 main screens (no install needed).

## Architecture
```
┌───────────┐   ┌───────────┐   ┌───────────┐
│ Rider App │   │ Driver App│   │ Admin Web │
└─────┬─────┘   └─────┬─────┘   └─────┬─────┘
      └───────────────┼───────────────┘
                      ▼
              ┌──────────────┐
              │   Supabase   │
              │ Postgres+Auth│
              │  + Realtime  │
              └──────┬───────┘
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
   quote-fare   dispatch-ride   webhooks
   (edge fn)    (AI matching)   (Square/PayPal)
```

## Pricing model
**Upfront flat-rate quotes.** No surge games. See `docs/02-tiers-pricing.md`.

## Tiers
Standard · XL · Country Run · Long Haul · Pet · Wheelchair · Senior Assist

## Roadmap
- [x] Brand + schema + wireframes
- [x] App scaffolds (rider, driver, admin)
- [x] Edge functions: fare quote + AI dispatch
- [ ] Square + PayPal payment integration
- [ ] SMS/voice masking (Twilio)
- [ ] Beta launch — Jeffersonville, IN
- [ ] Phase 2 — crypto payments (BTC, ETH, stablecoins)
- [ ] Phase 3 — franchise platform (multi-city/state)
- [ ] Phase 4 — super-app (delivery, logistics, services)

## License
Proprietary © On Time Taxi

## 🚀 Quick start
```bash
./scripts/bootstrap.sh
```
Then fill `.env` files and run `supabase db push && supabase functions deploy --no-verify-jwt`.
