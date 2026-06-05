# On-Time Taxi — Master Feature List
## HOMEPAGE / RIDER-FACING (Blue/White + Thin Red/Black Checker Border)
### Visual Design
- [x] Blue gradient hero (from-blue-600 to-[#1a4d8f]) with white headline
- [x] White content sections below hero
- [x] Thin red + black taxi checkerboard border on all 4 edges (2 rows, ~12px mobile / 16px desktop)
- [x] Footer: "Copyright 2026 © Neocryptz LLC"
### Core Booking
- [ ] Pickup address input with Google Places autocomplete
- [ ] Destination input with autocomplete
- [ ] See price / Get estimate button
- [ ] Fare display (base + per-mile, editable in admin)
### App Download Section (4 buttons)
- [x] 🚖 Rider · iPhone
- [x] 🚖 Rider · Android (yellow accent)
- [x] 🧑‍✈️ Driver · iPhone
- [x] 🧑‍✈️ Driver · Android (yellow accent)
### Trust Signals
- [x] ⏰ Always on Time (5-minute availability)
- [x] 💵 Upfront Pricing (no hidden fees)
- [x] 🛡️ Safer Rides (background checks)
### Admin Access
- [x] CONSOLE GATE button (bright orange, top right header)
- [x] @ backup trigger (bottom-right footer)
---
## ADMIN CONSOLE FEATURES
### 1. Executive Control Suite
- [x] Admin login modal (toggleable with @ key)
- [x] Username/password fields
- [x] Activity log with timestamps
- [x] 🚨 Administrative Free Ride Command ($0.00 fare)
- [x] 🚨 ALL FLEET EMERGENCY SOS PANIC
- [x] 🏥 HOSPITAL VISITATION MATRIX
- [x] 🎂 NOVEMBER 16TH TICKER (birthday banner)
### 2. Status Overrides
- [x] isSosActive toggle
- [x] isHospitalActive toggle
- [x] isBirthdayActive toggle
### 3. Multi-State Geofencing (50 States)
- [x] IN - Indiana HQ Core (Sellersburg) - LIVE
- [x] KY - Kentucky Hub toggle
- [x] OH - Ohio Hub toggle
- [x] IL - Illinois Hub toggle
- [ ] Remaining 46 states (toggleable on/off)
- [ ] Visual map showing zones
### 4. Driver Registry & Compliance
- [ ] Driver profiles (Arthur Pendelton example)
- [ ] License verification checklist
- [ ] Registration verification
- [ ] Insurance proof verification
- [ ] 7-year background check
- [ ] National Sex Offender Registry check
- [ ] Cross-border radar alerts
- [ ] Lifetime ban warnings
### 5. Infrastructure Metrics
- [x] Twilio API status tile
- [x] Google Maps API status tile
- [x] Android store sync status
- [x] Apple iOS store sync status
### 6. Pricing & Payments Admin
- [x] Editable base fare
- [x] Editable per-mile rate
- [ ] Platform fee percentage setting
- [ ] Out-of-town threshold definition
- [ ] Out-of-town upfront payment rule
---
## APPS (PWAs)
### Rider App
- [ ] Separate login from drivers
- [ ] Book ride flow
- [ ] Payment method selection (Stripe)
- [ ] Track driver location
- [ ] Ride history
### Driver App
- [ ] Separate login from riders
- [ ] Accept/decline requests
- [ ] Navigation
- [ ] Earnings tracker
- [ ] PayPal email on file
- [ ] Document upload
### Install Pages
- [x] /get-app/rider/iphone
- [x] /get-app/rider/android
- [x] /get-app/driver/iphone
- [x] /get-app/driver/android
---
## BACKEND / INFRASTRUCTURE
- [x] Google Maps API (restricted to ontimetaxi.biz)
- [x] Places Autocomplete
- [ ] Stripe integration (rider payments)
- [ ] PayPal Payouts API (driver payments)
- [ ] Twilio SMS gateway
- [ ] Database (riders, drivers, rides, payments)
---
## PENDING CLARIFICATION
- [ ] Base fare amount ($?)
- [ ] Per-mile rate ($?)
- [ ] Platform fee percentage (%?)
- [ ] "Out of town" definition (miles or boundary?)
- [ ] Logo file (placeholder for now)
---
**Total Features:** ~125 identified  
**Status:** ~35 implemented | ~90 pending  
**Last Updated:** $(date '+%Y-%m-%d')
