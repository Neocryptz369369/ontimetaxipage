// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'
function geohash(lat: number, lng: number, p = 5): string {
  let latLo=-90,latHi=90,lngLo=-180,lngHi=180,bit=0,ch=0,even=true,out=''
  while (out.length<p) {
    if (even){const m=(lngLo+lngHi)/2; if(lng>=m){ch=(ch<<1)|1;lngLo=m}else{ch<<=1;lngHi=m}}
    else    {const m=(latLo+latHi)/2; if(lat>=m){ch=(ch<<1)|1;latLo=m}else{ch<<=1;latHi=m}}
    even=!even; if(++bit===5){out+=BASE32[ch];bit=0;ch=0}
  }
  return out
}

serve(async (req) => {
  try {
    const { tier, distance_mi, duration_min, pickup_lat, pickup_lng, promo_code, user_id } = await req.json()
    const { data: t } = await sb.from('tiers').select('*').eq('slug', tier).single()
    if (!t) return j({ error: 'unknown tier' }, 400)

    let base =
        t.base_cents
      + Math.round(distance_mi * t.per_mile_cents)
      + Math.round(duration_min * t.per_min_cents)
    if (t.longhaul_per_mile_cents && distance_mi > 50) {
      base += Math.round(distance_mi * 2 * t.longhaul_per_mile_cents)
    }
    base = Math.max(base, t.min_fare_cents) + (t.surcharge_cents ?? 0)

    let surge = 1.0
    if (pickup_lat != null) {
      const h = geohash(pickup_lat, pickup_lng)
      const { data: z } = await sb.from('surge_zones').select('multiplier').eq('geohash', h).single()
      if (z) surge = Number(z.multiplier)
    }
    const surged = Math.round(base * surge)

    let discount = 0, promo_id: string | null = null
    if (promo_code && user_id) {
      const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/redeem-promo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promo_code, user_id, fare_cents: surged }),
      })
      const d = await r.json()
      if (r.ok && d.ok) { discount = d.discount_cents; promo_id = d.promo_id }
    }

    return j({
      ok: true,
      base_cents: base, surge_multiplier: surge, surged_cents: surged,
      discount_cents: discount, promo_id,
      total_cents: surged - discount,
    })
  } catch (e: any) { return j({ error: String(e?.message ?? e) }, 500) }
})
const j = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
