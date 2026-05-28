// deno-lint-ignore-file no-explicit-any
// Cron-invoked (every minute via pg_cron or external scheduler).
// Promotes scheduled rides to 'searching' at T-15min so dispatch can find a driver.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

serve(async () => {
  const cutoff = new Date(Date.now() + 15 * 60 * 1000).toISOString()
  const { data, error } = await sb.from('rides')
    .update({ status: 'searching' })
    .eq('status', 'scheduled')
    .lte('scheduled_for', cutoff)
    .select('id')

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  for (const r of (data ?? [])) {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/dispatch-ride`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ride_id: r.id }),
    })
  }
  return new Response(JSON.stringify({ promoted: data?.length ?? 0 }), { headers: { 'content-type': 'application/json' } })
})
