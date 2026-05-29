// deno-lint-ignore-file no-explicit-any
// Cron — recomputes surge multipliers per geohash zone based on demand vs supply.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

// Cheap 5-char geohash (≈ 4.9 km cell).
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'
function geohash(lat: number, lng: number, precision = 5): string {
  let latLo = -90, latHi = 90, lngLo = -180, lngHi = 180
  let bit = 0, ch = 0, even = true, out = ''
  while (out.length < precision) {
    if (even) {
      const mid = (lngLo + lngHi) / 2
      if (lng >= mid) { ch = (ch << 1) | 1; lngLo = mid } else { ch <<= 1; lngHi = mid }
    } else {
      const mid = (latLo + latHi) / 2
      if (lat >= mid) { ch = (ch << 1) | 1; latLo = mid } else { ch <<= 1; latHi = mid }
    }
    even = !even
    if (++bit === 5) { out += BASE32[ch]; bit = 0; ch = 0 }
  }
  return out
}

serve(async () => {
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: reqs } = await sb.from('rides')
    .select('pickup_lat, pickup_lng')
    .gte('created_at', since)
    .in('status', ['searching', 'scheduled'])

  const { data: drvs } = await sb.from('drivers')
    .select('current_lat, current_lng, online')
    .eq('online', true)

  const demand: Record<string, number> = {}, supply: Record<string, number> = {}
  for (const r of reqs ?? []) {
    if (r.pickup_lat == null) continue
    const h = geohash(r.pickup_lat, r.pickup_lng); demand[h] = (demand[h] ?? 0) + 1
  }
  for (const d of drvs ?? []) {
    if (d.current_lat == null) continue
    const h = geohash(d.current_lat, d.current_lng); supply[h] = (supply[h] ?? 0) + 1
  }

  const rows = []
  for (const h of Object.keys(demand)) {
    const ratio = demand[h] / Math.max(1, supply[h] ?? 0)
    let mult = 1.0
    if (ratio >= 1.5) mult = 1.25
    if (ratio >= 2.0) mult = 1.5
    if (ratio >= 3.0) mult = 1.75
    if (ratio >= 4.0) mult = 2.0
    rows.push({ geohash: h, multiplier: mult, computed_at: new Date().toISOString() })
  }
  if (rows.length) await sb.from('surge_zones').upsert(rows, { onConflict: 'geohash' })

  // decay anything we didn't update in 10 minutes
  await sb.from('surge_zones').update({ multiplier: 1.0 })
    .lt('computed_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
    .neq('multiplier', 1.0)

  return new Response(JSON.stringify({ zones: rows.length }),
    { headers: { 'content-type': 'application/json' } })
})
