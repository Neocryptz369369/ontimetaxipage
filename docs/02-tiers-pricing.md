# Ride Tiers & Pricing

All quotes are **upfront flat-rate** (no mystery surge). Rider sees exact total before booking.

## Tiers
| Tier | Vehicle | Capacity | Use case |
|---|---|---|---|
| **Standard** | Sedan | 1–4 | Daily rides, in-town |
| **XL** | SUV / Minivan | 5–7 | Groups, airport runs with luggage |
| **Country Run** | Sedan/SUV | 1–6 | Rural pickup/dropoff outside city limits — flat zone pricing |
| **Long Haul** | Sedan/SUV | 1–6 | Out-of-state, same-day round trip (e.g. Louisville → Indianapolis → home) |
| **Pet-Friendly** | Sedan/SUV | 1–4 + pet | Pets allowed, driver opt-in |
| **Wheelchair Accessible** | WAV | 1–3 + chair | ADA-compliant ramp/lift vehicle |
| **Senior Assist** | Sedan | 1–3 | Driver helps in/out, carries bags, walks to door |

## Pricing formula (internal)
```
fare = base_fare
     + (miles * per_mile_rate)
     + (minutes * per_minute_rate)
     + tier_multiplier
     + tolls
     + (out_of_zone_flat if rural)
     + (long_haul_flat if out_of_state)
fare = max(fare, minimum_fare)
```
Rider only sees the final number. Driver sees breakdown.

### Starting rates (Clark County, IN — editable in admin)
| Tier | Base | $/mi | $/min | Min fare |
|---|---|---|---|---|
| Standard | $3.50 | $1.85 | $0.30 | $8 |
| XL | $5.00 | $2.50 | $0.40 | $14 |
| Country Run | $8.00 + zone | $1.85 | $0.30 | $15 |
| Long Haul | $25 + $1.50/mi round trip | — | — | $75 |
| Pet | Standard + $5 | — | — | — |
| WAV | Standard, no surcharge | — | — | — |
| Senior | Standard + $3 service | — | — | — |
