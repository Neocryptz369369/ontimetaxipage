// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

serve(async (req) => {
  try {
    const { ride_id, cancelled_by, reason } = await req.json()
    const { data: ride } = await sb.from('rides').select('*').eq('id', ride_id).single()
    if (!ride) return json({ error: 'ride not found' }, 404)
    if (['completed', 'cancelled'].includes(ride.status)) {
      return json({ error: 'already finalized' }, 400)
    }

    const { data: policy } = await sb.from('cancellation_policies')
      .select('*').eq('tier', ride.tier).eq('active', true).single()

    let fee = 0
    if (cancelled_by === 'rider' && ride.driver_id) {
      const dispatchedAt = new Date(ride.dispatched_at ?? ride.created_at).getTime()
      const elapsed = (Date.now() - dispatchedAt) / 1000
      if (elapsed > (policy?.grace_seconds ?? 120)) fee = policy?.fee_cents ?? 500
    }

    await sb.from('rides').update({
      status: 'cancelled',
      cancelled_by, cancelled_at: new Date().toISOString(),
      cancel_fee_cents: fee, cancel_reason: reason ?? null,
    }).eq('id', ride_id)

    return json({ ok: true, cancel_fee_cents: fee })
  } catch (e: any) { return json({ error: String(e?.message ?? e) }, 500) }
})
const json = (b: any, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
