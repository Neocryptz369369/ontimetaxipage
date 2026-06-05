import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n: string) => cookieStore.get(n)?.value,
        set: (n: string, v: string, o: CookieOptions) => {
          try { cookieStore.set({ name: n, value: v, ...o }) } catch {}
        },
        remove: (n: string, o: CookieOptions) => {
          try { cookieStore.set({ name: n, value: '', ...o }) } catch {}
        },
      },
    }
  )
}
