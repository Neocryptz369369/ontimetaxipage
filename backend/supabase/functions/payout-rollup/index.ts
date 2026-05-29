// deno-lint-ignore-file no-explicit-any
// Weekly cron — aggregates completed rides from the prior week into driver_payouts.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const PLATFORM_FEE_PCT = Number(Deno.env.get('PLATFORM_FEE_PCT') ?? 20)

serve(async () => {
  const now = new Date()
  const day = now.getUTCDay()
  const endsOn = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - day))
  const startsOn = new Date(endsOn.getTime() - 7 * 86400000)

  const { data: period } = await sb.from('payout_periods')
    .upsert({ starts_on: startsOn.toISOString().slice(0, 10),
              ends_on:   endsOn.toISOString().slice(0, 10),
              status: 'locked' },
            { onConflict: 'starts_on,ends_on' })
    .select().single()

  const { data: rides } = await sb.from('rides')
    .select('driver_id, fare_cents, tip_cents')
    .eq('status', 'completed')
    .gte('completed_at', startsOn.toISOString())
    .lt('completed_at', endsOn.toISOString())

  const agg: Record<string, { gross: number; tips: number; count: number }> = {}
  for (const r of rides ?? []) {
    if (!r.driver_id) continue
    const a = agg[r.driver_id] ??= { gross: 0, tips: 0, count: 0 }
    a.gross += r.fare_cents; a.tips += r.tip_cents ?? 0; a.count += 1
  }

  const rows = Object.entries(agg).map(([driver_id, v]) => {
    const fees = Math.round(v.gross * (PLATFORM_FEE_PCT / 100))
    return {
      driver_id, period_id: period!.id,
      gross_cents: v.gross, tips_cents: v.tips, fees_cents: fees,
      net_cents: v.gross - fees + v.tips, ride_count: v.count, status: 'pending',
    }
  })
  if (rows.length) await sb.from('driver_payouts').upsert(rows, { onConflict: 'driver_id,period_id' })

  return new Response(JSON.stringify({ period: period!.id, drivers: rows.length }),
    { headers: { 'content-type': 'application/json' } })
})
