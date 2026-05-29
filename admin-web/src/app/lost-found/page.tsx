import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'

export default async function LostFound() {
  const sb = createClient()
  const { data: items } = await sb.from('lost_items').select(`
    *, rider:users(full_name, phone, email), ride:rides(pickup_address, dropoff_address)
  `).order('created_at', { ascending: false }).limit(200)

  async function update(id: string, status: string) {
    'use server'
    const sb = createClient()
    await sb.from('lost_items').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    revalidatePath('/lost-found')
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Lost &amp; found</h1>
      {items?.map((i: any) => (
        <div key={i.id} className="bg-white border rounded-xl p-4">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">{i.rider.full_name} · {i.rider.phone}</div>
              <div className="text-xs text-zinc-500">{new Date(i.created_at).toLocaleString()}</div>
            </div>
            <select defaultValue={i.status}
              className="border rounded p-1 text-sm"
              onChange={() => {}}>
              {['open','contacted','resolved','closed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="mt-2">{i.description}</p>
          <div className="text-xs text-zinc-500 mt-2">
            Trip: {i.ride?.pickup_address} → {i.ride?.dropoff_address}
          </div>
          <div className="flex gap-2 mt-2">
            {['contacted','resolved','closed'].map(s => (
              <form key={s} action={update.bind(null, i.id, s)}>
                <button className="text-xs underline">Mark {s}</button>
              </form>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
