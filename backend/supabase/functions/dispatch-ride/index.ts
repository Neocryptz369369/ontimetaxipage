// supabase/functions/dispatch-ride
// POST { ride_id }
// Finds best driver within radius, offers ride. Re-runs on driver decline.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SEARCH_RADIUS_MILES = 15;

function haversine(a:{lat:number,lng:number}, b:{lat:number,lng:number}) {
  const R = 3958.8;
  const dLat = (b.lat-a.lat) * Math.PI/180;
  const dLng = (b.lng-a.lng) * Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

serve(async (req) => {
  try {
    const { ride_id } = await req.json();
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: ride, error: re } = await sb.from("rides").select("*").eq("id", ride_id).single();
    if (re || !ride) return new Response(JSON.stringify({ error: "ride not found" }), { status: 404 });
    if (ride.status !== "requested" && ride.status !== "searching") {
      return new Response(JSON.stringify({ skipped: true, status: ride.status }));
    }

    const pickup = { lat: Number(ride.pickup_lat), lng: Number(ride.pickup_lng) };

    const { data: drivers } = await sb
      .from("drivers")
      .select("user_id, current_lat, current_lng, accepts_pets, accepts_long_haul, accepts_country_run, senior_certified, vehicle_id, users(rating, status)")
      .eq("is_online", true)
      .not("current_lat", "is", null);

    const eligible = (drivers ?? [])
      .filter((d: any) => d.users?.status === "active")
      .filter((d: any) => {
        if (ride.tier_code === "pet" && !d.accepts_pets) return false;
        if (ride.tier_code === "long_haul" && !d.accepts_long_haul) return false;
        if (ride.tier_code === "country" && !d.accepts_country_run) return false;
        if (ride.tier_code === "senior" && !d.senior_certified) return false;
        return true;
      })
      .map((d: any) => ({
        ...d,
        distance: haversine(pickup, { lat: Number(d.current_lat), lng: Number(d.current_lng) }),
      }))
      .filter((d: any) => d.distance <= SEARCH_RADIUS_MILES)
      .sort((a: any, b: any) => {
        const scoreA = a.distance - (a.users?.rating ?? 5) * 0.5;
        const scoreB = b.distance - (b.users?.rating ?? 5) * 0.5;
        return scoreA - scoreB;
      });

    if (eligible.length === 0) {
      await sb.from("rides").update({ status: "searching" }).eq("id", ride_id);
      return new Response(JSON.stringify({ matched: false, reason: "no drivers in radius" }));
    }

    const best = eligible[0];
    await sb.from("rides").update({ status: "searching", driver_id: null }).eq("id", ride_id);

    return new Response(JSON.stringify({
      matched: true,
      offered_driver_id: best.user_id,
      distance_miles: Math.round(best.distance * 100) / 100,
      candidates_in_radius: eligible.length,
    }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
