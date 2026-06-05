// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

serve(async (req) => {
  try {
    const { code, user_id, fare_cents } = await req.json()
    const { data: promo } = await sb.from('promo_codes').select('*')
      .eq('code', code.toUpperCase()).eq('active', true).single()
    if (!promo) return j({ error: 'invalid code' }, 404)
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) return j({ error: 'expired' }, 400)
    if (promo.max_uses && promo.uses >= promo.max_uses) return j({ error: 'redeemed out' }, 400)
    if (fare_cents < promo.min_fare_cents) return j({ error: 'fare below minimum' }, 400)

    const { count } = await sb.from('promo_redemptions')
      .select('*', { count: 'exact', head: true })
      .eq('promo_id', promo.id).eq('user_id', user_id)
    if ((count ?? 0) >= promo.per_user_limit) return j({ error: 'already used' }, 400)

    const discount = promo.kind === 'percent'
      ? Math.round(fare_cents * (Number(promo.amount) / 100))
      : Math.round(Number(promo.amount) * 100)

    return j({ ok: true, promo_id: promo.id, discount_cents: Math.min(discount, fare_cents) })
  } catch (e: any) { return j({ error: String(e?.message ?? e) }, 500) }
})
const j = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
