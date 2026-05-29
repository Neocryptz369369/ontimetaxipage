import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'

export default async function Promos() {
  const sb = createClient()
  const { data: promos } = await sb.from('promo_codes').select('*').order('starts_at', { ascending: false })

  async function create(form: FormData) {
    'use server'
    const sb = createClient()
    await sb.from('promo_codes').insert({
      code: String(form.get('code')).toUpperCase(),
      kind: String(form.get('kind')),
      amount: Number(form.get('amount')),
      min_fare_cents: Math.round(Number(form.get('min_fare') || 0) * 100),
      max_uses: form.get('max_uses') ? Number(form.get('max_uses')) : null,
      per_user_limit: Number(form.get('per_user_limit') || 1),
      expires_at: form.get('expires_at') || null,
    })
    revalidatePath('/promos')
  }
  async function toggle(id: string, active: boolean) {
    'use server'
    const sb = createClient()
    await sb.from('promo_codes').update({ active: !active }).eq('id', id)
    revalidatePath('/promos')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Promo codes</h1>
      <form action={create} className="bg-white border rounded-xl p-4 grid grid-cols-7 gap-2">
        <input name="code" placeholder="WELCOME10" required className="border rounded p-2 col-span-2" />
        <select name="kind" className="border rounded p-2"><option value="percent">%</option><option value="flat">flat $</option></select>
        <input name="amount" type="number" step="0.01" placeholder="10" required className="border rounded p-2" />
        <input name="min_fare" type="number" step="0.01" placeholder="min fare $" className="border rounded p-2" />
        <input name="max_uses" type="number" placeholder="max uses" className="border rounded p-2" />
        <button className="bg-black text-white rounded p-2 col-span-7">Create</button>
      </form>
      <table className="w-full bg-white border rounded-xl text-sm">
        <thead className="bg-zinc-50"><tr><th className="p-2">Code</th><th>Kind</th><th>Amount</th><th>Uses</th><th>Active</th><th></th></tr></thead>
        <tbody>
          {promos?.map((p: any) => (
            <tr key={p.id} className="border-t">
              <td className="p-2 font-mono">{p.code}</td>
              <td>{p.kind}</td>
              <td>{p.kind === 'percent' ? `${p.amount}%` : `$${p.amount}`}</td>
              <td>{p.uses}{p.max_uses ? `/${p.max_uses}` : ''}</td>
              <td>{p.active ? '✓' : '—'}</td>
              <td><form action={toggle.bind(null, p.id, p.active)}>
                <button className="text-blue-600 underline text-xs">{p.active ? 'disable' : 'enable'}</button>
              </form></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
