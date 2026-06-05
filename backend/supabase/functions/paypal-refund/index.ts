// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const BASE = Deno.env.get('PAYPAL_ENV') === 'live'
  ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'

async function token() {
  const r = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${Deno.env.get('PAYPAL_CLIENT_ID')}:${Deno.env.get('PAYPAL_SECRET')}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  return (await r.json()).access_token
}

serve(async (req) => {
  try {
    const { payment_id, amount_cents, reason } = await req.json()
    const { data: pay } = await sb.from('payments').select('*').eq('id', payment_id).single()
    if (!pay?.provider_capture_id) return json({ error: 'no capture id' }, 400)

    const t = await token()
    const r = await fetch(`${BASE}/v2/payments/captures/${pay.provider_capture_id}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: { value: (amount_cents / 100).toFixed(2), currency_code: 'USD' },
        note_to_payer: reason ?? 'Refund issued',
      }),
    })
    const data = await r.json()
    if (!r.ok) return json({ error: 'refund failed', data }, 502)

    await sb.from('payments').update({
      refunded_cents: pay.refunded_cents + amount_cents,
      refund_id: data.id,
      refunded_at: new Date().toISOString(),
      refund_reason: reason,
    }).eq('id', payment_id)
    return json({ ok: true, refund_id: data.id })
  } catch (e: any) { return json({ error: String(e?.message ?? e) }, 500) }
})
const json = (b: any, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
