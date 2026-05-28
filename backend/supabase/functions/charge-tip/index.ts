// deno-lint-ignore-file no-explicit-any
// Charges an additional tip amount on the existing payment provider for a completed ride.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

serve(async (req) => {
  try {
    const { ride_id, tip_cents, source_id } = await req.json()
    if (tip_cents <= 0) return json({ error: 'tip must be > 0' }, 400)

    const { data: ride } = await sb.from('rides').select('*').eq('id', ride_id).single()
    if (!ride) return json({ error: 'ride not found' }, 404)
    const { data: pay } = await sb.from('payments').select('*')
      .eq('ride_id', ride_id).order('created_at', { ascending: false }).limit(1).single()
    if (!pay) return json({ error: 'no original payment' }, 400)

    let providerTipId: string | null = null

    if (pay.provider === 'square' && source_id) {
      const BASE = Deno.env.get('SQUARE_ENV') === 'production'
        ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
      const r = await fetch(`${BASE}/v2/payments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Deno.env.get('SQUARE_ACCESS_TOKEN')}`,
                   'Content-Type': 'application/json', 'Square-Version': '2024-10-17' },
        body: JSON.stringify({
          idempotency_key: crypto.randomUUID(),
          source_id,
          amount_money: { amount: tip_cents, currency: 'USD' },
          location_id: Deno.env.get('SQUARE_LOCATION_ID'),
          reference_id: `tip-${ride_id}`,
        }),
      })
      const data = await r.json()
      if (!r.ok) return json({ error: data?.errors?.[0]?.detail ?? 'tip failed' }, 502)
      providerTipId = data.payment.id
    } else if (pay.provider === 'cash') {
      // record tip without external charge
    } else {
      return json({ error: 'tip flow requires Square card on file' }, 400)
    }

    await sb.from('payments').update({ tip_cents: pay.tip_cents + tip_cents }).eq('id', pay.id)
    await sb.from('rides').update({ tip_cents: ride.tip_cents + tip_cents }).eq('id', ride_id)
    return json({ ok: true, provider_tip_id: providerTipId })
  } catch (e: any) { return json({ error: String(e?.message ?? e) }, 500) }
})
const json = (b: any, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
