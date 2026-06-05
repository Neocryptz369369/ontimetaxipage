import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'

export default async function Payouts() {
  const sb = createClient()
  const { data: payouts } = await sb.from('driver_payouts').select(`
    *, driver:users!driver_payouts_driver_id_fkey(full_name, email),
    period:payout_periods(starts_on, ends_on)
  `).order('created_at', { ascending: false }).limit(200)

  async function markPaid(id: string, ref: string) {
    'use server'
    const sb = createClient()
    await sb.from('driver_payouts').update({
      status: 'paid', paid_at: new Date().toISOString(), external_ref: ref,
    }).eq('id', id)
    revalidatePath('/payouts')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Driver payouts</h1>
      <table className="w-full bg-white border rounded-xl text-sm">
        <thead className="bg-zinc-50"><tr><th className="p-2">Period</th><th>Driver</th><th>Rides</th><th>Net</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {payouts?.map((p: any) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.period.starts_on} → {p.period.ends_on}</td>
              <td>{p.driver.full_name}</td>
              <td>{p.ride_count}</td>
              <td>${(p.net_cents / 100).toFixed(2)}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'pending' && (
                  <form action={async (fd: FormData) => { 'use server'; await markPaid(p.id, String(fd.get('ref') || 'manual')) }}>
                    <input name="ref" placeholder="ref" className="border rounded p-1 text-xs w-24" />
                    <button className="bg-green-600 text-white text-xs px-2 py-1 rounded ml-1">Mark paid</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
