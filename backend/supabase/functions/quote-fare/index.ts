// supabase/functions/quote-fare
// POST { tier, pickup:{lat,lng,address}, dropoff:{lat,lng,address}, is_round_trip?, pets? }
// -> { fare, miles, minutes, breakdown }
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_KEY = Deno.env.get("GOOGLE_MAPS_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const INDIANA_BOUNDS = { minLat: 37.77, maxLat: 41.76, minLng: -88.10, maxLng: -84.78 };
const CLARK_COUNTY_CENTER = { lat: 38.4783, lng: -85.7585 };

function isOutOfState(lat: number, lng: number) {
  return !(lat >= INDIANA_BOUNDS.minLat && lat <= INDIANA_BOUNDS.maxLat
        && lng >= INDIANA_BOUNDS.minLng && lng <= INDIANA_BOUNDS.maxLng);
}
function haversineMiles(a:{lat:number,lng:number}, b:{lat:number,lng:number}) {
  const R = 3958.8;
  const dLat = (b.lat-a.lat) * Math.PI/180;
  const dLng = (b.lng-a.lng) * Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

async function getDistance(origin:any, dest:any) {
  if (!GOOGLE_KEY) {
    const miles = haversineMiles(origin, dest);
    return { miles, minutes: miles * 1.8 };
  }
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${dest.lat},${dest.lng}&units=imperial&key=${GOOGLE_KEY}`;
  const r = await fetch(url).then(r => r.json());
  const el = r.rows?.[0]?.elements?.[0];
  if (!el || el.status !== "OK") {
    const miles = haversineMiles(origin, dest);
    return { miles, minutes: miles * 1.8 };
  }
  return { miles: el.distance.value / 1609.34, minutes: el.duration.value / 60 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() });
  try {
    const { tier, pickup, dropoff, is_round_trip = false } = await req.json();
    if (!tier || !pickup || !dropoff) return json({ error: "missing fields" }, 400);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: t, error } = await supabase.from("tiers").select("*").eq("code", tier).single();
    if (error || !t) return json({ error: "unknown tier" }, 400);

    const oos = isOutOfState(dropoff.lat, dropoff.lng) || isOutOfState(pickup.lat, pickup.lng);
    const { miles, minutes } = await getDistance(pickup, dropoff);
    const effMiles = is_round_trip ? miles * 2 : miles;

    let fare = 0;
    const breakdown: Record<string, number> = {};

    if (tier === "long_haul") {
      fare = Number(t.base_fare) + effMiles * Number(t.long_haul_per_mile_rt);
      breakdown.base = Number(t.base_fare);
      breakdown.mileage_rt = effMiles * Number(t.long_haul_per_mile_rt);
    } else {
      fare = Number(t.base_fare) + miles * Number(t.per_mile) + minutes * Number(t.per_minute);
      breakdown.base = Number(t.base_fare);
      breakdown.miles = miles * Number(t.per_mile);
      breakdown.time = minutes * Number(t.per_minute);
    }
    if (Number(t.surcharge) > 0) { fare += Number(t.surcharge); breakdown.surcharge = Number(t.surcharge); }
    fare = Math.max(fare, Number(t.minimum_fare));

    return json({
      tier: t.code,
      fare: Math.round(fare * 100) / 100,
      miles: Math.round(miles * 100) / 100,
      minutes: Math.round(minutes),
      is_out_of_state: oos,
      is_round_trip,
      breakdown,
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}
function json(body:any, status=200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(), "content-type": "application/json" } });
}
