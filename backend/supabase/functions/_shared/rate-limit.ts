import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

export async function rateLimit(key: string, max: number, windowSec: number): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / (windowSec * 1000)) * windowSec * 1000).toISOString()
  const { data, error } = await sb.from('rate_limits').upsert(
    { key, window_start: windowStart, count: 1 },
    { onConflict: 'key,window_start', ignoreDuplicates: false },
  ).select('count').single()

  if (error) {
    // race — increment via RPC fallback
    const { data: row } = await sb.from('rate_limits').select('count')
      .eq('key', key).eq('window_start', windowStart).single()
    if (!row) return true
    if (row.count >= max) return false
    await sb.from('rate_limits').update({ count: row.count + 1 })
      .eq('key', key).eq('window_start', windowStart)
    return row.count + 1 <= max
  }

  if ((data?.count ?? 1) > 1) {
    const { data: row } = await sb.from('rate_limits').select('count')
      .eq('key', key).eq('window_start', windowStart).single()
    if ((row?.count ?? 0) > max) return false
    await sb.from('rate_limits').update({ count: (row?.count ?? 0) + 1 })
      .eq('key', key).eq('window_start', windowStart)
  }
  return true
}

export function clientKey(req: Request, prefix: string): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const auth = req.headers.get('authorization') ?? ''
  return `${prefix}:${auth.slice(-12) || ip}`
}
