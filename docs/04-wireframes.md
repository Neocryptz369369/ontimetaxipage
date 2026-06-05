# Wireframes — Rider App (ASCII spec, ready to design in Figma)

## Screen 1 — Splash / Onboarding
```
┌────────────────────────────┐
│                            │
│        [ LOGO ]            │
│      On Time Taxi          │
│                            │
│   Everyone needs a ride.   │
│                            │
│   ┌────────────────────┐   │
│   │  Continue with     │   │
│   │  📱  Phone number  │   │  ← yellow button
│   └────────────────────┘   │
│   ┌────────────────────┐   │
│   │  Continue as Driver│   │  ← outlined
│   └────────────────────┘   │
└────────────────────────────┘
```

## Screen 2 — Home / Book a Ride
```
┌────────────────────────────┐
│ ☰        OnTimeTaxi    👤 │
├────────────────────────────┤
│ ┌────────────────────────┐ │
│ │ 🟢 Where to?           │ │  ← big tap target
│ └────────────────────────┘ │
│ Quick: 🏠 Home  💼 Work     │
│                            │
│   [ FULL-SCREEN MAP ]      │
│      📍 you are here       │
│      🚕 🚕   🚕            │  ← live driver pins
│                            │
│ ┌────────────────────────┐ │
│ │ Schedule for later  ⏰ │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

## Screen 3 — Choose Tier (after pickup+dropoff set)
```
┌────────────────────────────┐
│ ← Choose your ride         │
├────────────────────────────┤
│ [map preview with route]   │
│ 12.4 mi • ~22 min          │
├────────────────────────────┤
│ 🚗 Standard       $18.50   │
│    4 seats • 6 min away  ✓ │
│ ──────────────────────────│
│ 🚙 XL              $26.00  │
│    7 seats • 8 min away    │
│ ──────────────────────────│
│ 🌾 Country Run     $24.00  │
│ 🐾 Pet-Friendly    $23.50  │
│ ♿ Wheelchair       $18.50  │
│ 👴 Senior Assist   $21.50  │
│ 🛣️  Long Haul      quote   │
├────────────────────────────┤
│ Payment: Square •••• 4242 ▾│
├────────────────────────────┤
│ ┌────────────────────────┐ │
│ │   Confirm $18.50  →    │ │  ← yellow CTA
│ └────────────────────────┘ │
└────────────────────────────┘
```

## Screen 4 — Driver En Route
```
┌────────────────────────────┐
│   [ LIVE MAP w/ driver ]   │
│         🚕→📍              │
├────────────────────────────┤
│ Mike R.  ⭐ 4.9            │
│ Black Toyota Camry • ABC123│
│  ETA  6 min                │
│ [💬 Message]  [📞 Call]    │
│ [🛡️  Share trip]  [🆘 SOS] │
└────────────────────────────┘
```

## Screen 5 — Trip Complete / Rate
```
┌────────────────────────────┐
│        ✅ Arrived          │
│   Thanks for riding!       │
│                            │
│   Mike R.                  │
│   ⭐ ⭐ ⭐ ⭐ ⭐            │
│   [add tip: $2 $3 $5 ✏️]   │
│   Total charged: $20.50    │
│   [Done]                   │
└────────────────────────────┘
```

---

# Wireframes — Driver App

## Driver Home (offline/online toggle)
```
┌────────────────────────────┐
│ Hi Mike   $142 today  ⚙️   │
├────────────────────────────┤
│   ┌──────────────────┐     │
│   │   GO ONLINE  ◯   │     │  ← big yellow switch
│   └──────────────────┘     │
│                            │
│   [ MAP with your dot ]    │
│                            │
│   Today: 8 rides · $142    │
│   Week:  41 rides · $890   │
│                            │
│   [Earnings] [Rides] [Help]│
└────────────────────────────┘
```

## Incoming ride request (full-screen takeover)
```
┌────────────────────────────┐
│ ⏱ 15s                      │
│ Standard ride              │
│ Pickup: 4 min away         │
│ Drop:  12.4 mi · ~22 min   │
│ Estimated payout: $14.80   │
│                            │
│ ┌──────────┐  ┌──────────┐ │
│ │ DECLINE  │  │ ACCEPT ✓ │ │
│ └──────────┘  └──────────┘ │
└────────────────────────────┘
```
