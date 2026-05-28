// supabase/functions/quote-fare/index.ts
// POST { tier, distance_mi, duration_min, is_rural, is_out_of_state }
// → { quote: number, breakdown: {...} }
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RATES = {
  standard:   { base: 3.50, perMi: 1.85, perMin: 0.30, min: 8 },
  xl:         { base: 5.00, perMi: 2.50, perMin: 0.40, min: 14 },
  country:    { base: 8.00, perMi: 1.85, perMin: 0.30, min: 15, ruralAddon: 4.00 },
  long_haul:  { base: 25.00, perMi: 1.50, perMin: 0,    min: 75, roundTrip: true },
  pet:        { base: 3.50, perMi: 1.85, perMin: 0.30, min: 8, surcharge: 5 },
  wav:        { base: 3.50, perMi: 1.85, perMin: 0.30, min: 8 },
  senior:     { base: 3.50, perMi: 1.85, perMin: 0.30, min: 8, surcharge: 3 },
};

serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const { tier, distance_mi, duration_min, is_rural, is_out_of_state } = await req.json();
  const r = RATES[tier as keyof typeof RATES];
  if (!r) return new Response(JSON.stringify({ error: "invalid tier" }), { status: 400 });

  let miles = distance_mi;
  if (r.roundTrip || is_out_of_state) miles = miles * 2;

  const base = r.base;
  const distance = miles * r.perMi;
  const time = duration_min * r.perMin;
  const ruralAddon = is_rural && tier === "country" ? r.ruralAddon ?? 0 : 0;
  const surcharge = r.surcharge ?? 0;
  const subtotal = base + distance + time + ruralAddon + surcharge;
  const quote = Math.max(subtotal, r.min);

  return new Response(JSON.stringify({
    quote: Math.round(quote * 100) / 100,
    breakdown: { base, distance, time, ruralAddon, surcharge, min: r.min, roundTrip: !!r.roundTrip || !!is_out_of_state }
  }), { headers: { "Content-Type": "application/json" } });
});
