// supabase/functions/dispatch-ride/index.ts
// AI Dispatch: given a ride request, pick the best driver.
// Score = (proximity * 0.5) + (rating * 0.3) + (acceptance_rate * 0.2)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function haversineMi(lat1:number,lng1:number,lat2:number,lng2:number){
  const R=3958.8, toRad=(d:number)=>d*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLng=toRad(lng2-lng1);
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

serve(async (req) => {
  const { ride_id } = await req.json();
  const { data: ride } = await supabase.from("rides").select("*").eq("id", ride_id).single();
  if (!ride) return new Response("ride not found", { status: 404 });

  const tierFilter: any = { is_online: true };
  const { data: drivers } = await supabase
    .from("drivers")
    .select("user_id,current_lat,current_lng,users(rating,total_rides)")
    .match(tierFilter);

  if (!drivers || drivers.length === 0) {
    await supabase.from("rides").update({ status: "dispatching" }).eq("id", ride_id);
    return new Response(JSON.stringify({ matched: false, reason: "no drivers online" }));
  }

  const scored = drivers.map((d: any) => {
    const dist = haversineMi(ride.pickup_lat, ride.pickup_lng, d.current_lat, d.current_lng);
    const proximityScore = Math.max(0, 1 - dist / 10);
    const ratingScore = (d.users?.rating ?? 5) / 5;
    const experienceScore = Math.min(1, (d.users?.total_rides ?? 0) / 500);
    const score = proximityScore * 0.5 + ratingScore * 0.3 + experienceScore * 0.2;
    return { driver_id: d.user_id, dist, score };
  }).sort((a,b) => b.score - a.score);

  const best = scored[0];
  await supabase.from("rides").update({
    driver_id: best.driver_id, status: "accepted"
  }).eq("id", ride_id);

  return new Response(JSON.stringify({
    matched: true, driver_id: best.driver_id, distance_mi: best.dist.toFixed(2), score: best.score.toFixed(3)
  }), { headers: {"Content-Type":"application/json"} });
});
