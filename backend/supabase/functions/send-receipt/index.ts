// deno-lint-ignore-file no-explicit-any
// Triggered by DB webhook when rides.status transitions to 'completed'.
// Sends an email receipt via Resend and logs to public.receipts.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM = Deno.env.get('RECEIPT_FROM_EMAIL') ?? 'receipts@on-time-taxi.com'

serve(async (req) => {
  try {
    const evt = await req.json()
    const row = evt.record ?? evt.new ?? evt
    const oldRow = evt.old_record ?? evt.old ?? {}
    if (row.status !== 'completed' || oldRow.status === 'completed') return new Response('skip')

    const { data: ride } = await sb.from('rides').select(`
      *, rider:users!rides_rider_id_fkey(email, full_name),
      driver:users!rides_driver_id_fkey(full_name)
    `).eq('id', row.id).single()
    if (!ride?.rider?.email) return new Response('no email')

    const total = ride.fare_cents + (ride.tip_cents ?? 0)
    const html = `
      <h2>Thanks for riding with On-Time Taxi</h2>
      <p>Hi ${ride.rider.full_name ?? 'rider'},</p>
      <table cellpadding="6" style="border-collapse:collapse;border:1px solid #ddd">
        <tr><td>From</td><td>${ride.pickup_address}</td></tr>
        <tr><td>To</td><td>${ride.dropoff_address}</td></tr>
        <tr><td>Tier</td><td>${ride.tier}</td></tr>
        <tr><td>Driver</td><td>${ride.driver?.full_name ?? ''}</td></tr>
        <tr><td>Fare</td><td>$${(ride.fare_cents / 100).toFixed(2)}</td></tr>
        <tr><td>Tip</td><td>$${((ride.tip_cents ?? 0) / 100).toFixed(2)}</td></tr>
        <tr><td><b>Total</b></td><td><b>$${(total / 100).toFixed(2)}</b></td></tr>
      </table>
      <p>Ride ID: ${ride.id}</p>
    `

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM, to: ride.rider.email,
        subject: `Your On-Time Taxi receipt – $${(total / 100).toFixed(2)}`, html,
      }),
    })
    const data = await r.json()
    if (!r.ok) return new Response(JSON.stringify(data), { status: 502 })

    await sb.from('receipts').insert({
      ride_id: ride.id, email: ride.rider.email, provider_id: data.id,
    })
    return new Response('ok')
  } catch (e: any) { return new Response(String(e?.message ?? e), { status: 500 }) }
})
