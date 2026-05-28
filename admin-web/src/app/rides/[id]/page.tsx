import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function RideDetail({ params }: { params: { id: string } }) {
  const sb = createClient()
  const { data: ride } = await sb.from('rides').select('*').eq('id', params.id).single()
  const { data: payments } = await sb.from('payments').select('*').eq('ride_id', params.id)

  async function refund(paymentId: string, provider: 'square' | 'paypal', amountCents: number) {
    'use server'
    const fn = provider === 'square' ? 'square-refund' : 'paypal-refund'
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${fn}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payment_id: paymentId, amount_cents: amountCents, reason: 'admin refund' }),
    })
    revalidatePath(`/rides/${params.id}`)
  }

  if (!ride) return <div className="p-6">Ride not found</div>

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Ride {ride.id.slice(0, 8)}</h1>
      <div className="bg-white border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div><b>Status:</b> {ride.status}</div>
        <div><b>Tier:</b> {ride.tier}</div>
        <div className="col-span-2"><b>From:</b> {ride.pickup_address}</div>
        <div className="col-span-2"><b>To:</b> {ride.dropoff_address}</div>
        <div><b>Fare:</b> ${(ride.fare_cents / 100).toFixed(2)}</div>
        <div><b>Tip:</b> ${(ride.tip_cents / 100).toFixed(2)}</div>
      </div>

      <h2 className="text-lg font-semibold mt-4">Payments</h2>
      {payments?.map((p: any) => {
        const refundable = (p.amount_cents + p.tip_cents) - p.refunded_cents
        return (
          <div key={p.id} className="bg-white border rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.provider.toUpperCase()} · ${(p.amount_cents / 100).toFixed(2)}</div>
              <div className="text-xs text-zinc-500">
                {p.status} · refunded ${(p.refunded_cents / 100).toFixed(2)}
              </div>
            </div>
            {refundable > 0 && (
              <form action={refund.bind(null, p.id, p.provider, refundable)}>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm">
                  Refund ${(refundable / 100).toFixed(2)}
                </button>
              </form>
            )}
          </div>
        )
      })}
    </div>
  )
}
