'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'
  const err = params.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(err === 'not_admin' ? 'Account is not an admin.' : null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setMsg(error.message); return }
    router.push(next)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow space-y-4">
        <h1 className="text-2xl font-bold">On-Time Taxi Admin</h1>
        <p className="text-sm text-zinc-500">Sign in with an admin account.</p>
        {msg && <div className="bg-red-50 text-red-700 text-sm p-2 rounded">{msg}</div>}
        <input className="w-full border rounded p-2" type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading}
          className="w-full bg-black text-white rounded p-2 font-medium disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
