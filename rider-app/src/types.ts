export type TierCode = "standard" | "xl" | "country" | "long_haul" | "pet" | "wav" | "senior";
export type PaymentMethod = "square" | "paypal" | "cash";

export interface Place { lat: number; lng: number; address: string; }

export interface Quote {
  tier: TierCode;
  fare: number;
  miles: number;
  minutes: number;
  is_out_of_state: boolean;
  is_round_trip: boolean;
  breakdown: Record<string, number>;
}

export const TIERS: { code: TierCode; name: string; blurb: string; emoji: string }[] = [
  { code: "standard",  name: "Standard",              blurb: "Sedan, 1–4 riders",                         emoji: "🚗" },
  { code: "xl",        name: "XL",                    blurb: "SUV/Minivan, 5–7 riders",                   emoji: "🚙" },
  { code: "country",   name: "Country Run",           blurb: "Rural pickup/dropoff, flat zone pricing",   emoji: "🌾" },
  { code: "long_haul", name: "Long Haul",             blurb: "Out-of-state same-day round trip",          emoji: "🛣️" },
  { code: "pet",       name: "Pet-Friendly",          blurb: "Pets welcome (+$5)",                        emoji: "🐾" },
  { code: "wav",       name: "Wheelchair Accessible", blurb: "ADA ramp/lift vehicle, same price",         emoji: "♿" },
  { code: "senior",    name: "Senior Assist",         blurb: "Help in/out, bags, door-to-door (+$3)",     emoji: "🧓" },
];
