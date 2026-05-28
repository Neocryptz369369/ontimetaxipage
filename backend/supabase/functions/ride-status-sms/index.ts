// deno-lint-ignore-file no-explicit-any
// Triggered by DB webhook on rides.status change.
// Sends SMS pings to the rider for: driver_assigned, arrived, in_progress, completed.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const TEMPLATES: Record<string, (ctx: any) => string> = {
  driver_assigned: (c) => `On-Time Taxi: ${c.driver_name} is on the way in a ${c.vehicle}. ETA ${c.eta_min} min.`,
  arrived:         (c) => `On-Time Taxi: Your driver has arrived. Look for ${c.vehicle} (${c.plate}).`,
  in_progress:     ( ) => `On-Time Taxi: Trip started. Enjoy your ride!`,
  completed:       (c) => `On-Time Taxi: Trip complete. Total $${(c.fare_cents/100).toFixed(2)}. Thanks for riding!`,
}

serve(async (req) => {
  try {
    const evt = await req.json()
    const row = evt.record ?? evt.new ?? evt
    const oldRow = evt.old_record ?? evt.old ?? {}
    if (row.status === oldRow.status) return new Response('no change')

    const tpl = TEMPLATES[row.status]
    if (!tpl) return new Response('no template')

    const { data: ride } = await sb.from('rides').select(`
      *, rider:users!rides_rider_id_fkey(phone, full_name),
      driver:users!rides_driver_id_fkey(full_name),
      vehicle:vehicles(make, model, plate)
    `).eq('id', row.id).single()

    if (!ride?.rider?.phone) return new Response('no phone')

    const ctx = {
      driver_name: ride.driver?.full_name ?? 'Your driver',
      vehicle: ride.vehicle ? `${ride.vehicle.make} ${ride.vehicle.model}` : 'vehicle',
      plate: ride.vehicle?.plate ?? '',
      eta_min: ride.eta_min ?? 5,
      fare_cents: ride.fare_cents ?? 0,
    }

    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: ride.rider.phone, body: tpl(ctx) }),
    })

    return new Response('ok')
  } catch (e: any) {
    return new Response(String(e?.message ?? e), { status: 500 })
  }
})
