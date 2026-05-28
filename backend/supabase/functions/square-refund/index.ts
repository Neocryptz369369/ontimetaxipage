// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN')!
const BASE = Deno.env.get('SQUARE_ENV') === 'production'
  ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'

serve(async (req) => {
  try {
    const { payment_id, amount_cents, reason } = await req.json()
    const { data: pay } = await sb.from('payments').select('*').eq('id', payment_id).single()
    if (!pay) return json({ error: 'payment not found' }, 404)

    const r = await fetch(`${BASE}/v2/refunds`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json',
                 'Square-Version': '2024-10-17' },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        payment_id: pay.provider_payment_id,
        amount_money: { amount: amount_cents, currency: 'USD' },
        reason: reason ?? 'requested_by_customer',
      }),
    })
    const data = await r.json()
    if (!r.ok) return json({ error: data?.errors?.[0]?.detail ?? 'refund failed', data }, 502)

    await sb.from('payments').update({
      refunded_cents: pay.refunded_cents + amount_cents,
      refund_id: data.refund.id,
      refunded_at: new Date().toISOString(),
      refund_reason: reason,
    }).eq('id', payment_id)

    return json({ ok: true, refund_id: data.refund.id })
  } catch (e: any) { return json({ error: String(e?.message ?? e) }, 500) }
})
const json = (b: any, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
