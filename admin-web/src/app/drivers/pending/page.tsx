import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function PendingDrivers() {
  const sb = createClient()
  const { data: drivers } = await sb
    .from('drivers')
    .select('id, onboarding_status, users:users!inner(full_name, email, phone), documents:driver_documents(*)')
    .in('onboarding_status', ['pending', 'in_review'])
    .order('id')

  async function decide(driverId: string, status: 'approved' | 'rejected') {
    'use server'
    const sb = createClient()
    await sb.from('drivers').update({ onboarding_status: status }).eq('id', driverId)
    await sb.from('driver_documents').update({ status }).eq('driver_id', driverId)
    revalidatePath('/drivers/pending')
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Driver approval queue</h1>
      {!drivers?.length && <p className="text-zinc-500">No pending drivers.</p>}
      {drivers?.map((d: any) => (
        <div key={d.id} className="border rounded-xl p-4 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{d.users.full_name}</div>
              <div className="text-sm text-zinc-500">{d.users.email} · {d.users.phone}</div>
              <div className="text-xs mt-1 inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                {d.onboarding_status}
              </div>
            </div>
            <div className="flex gap-2">
              <form action={decide.bind(null, d.id, 'approved')}>
                <button className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
              </form>
              <form action={decide.bind(null, d.id, 'rejected')}>
                <button className="bg-red-600 text-white px-4 py-2 rounded">Reject</button>
              </form>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {d.documents?.map((doc: any) => (
              <DocThumb key={doc.id} path={doc.storage_path} label={doc.kind} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

async function DocThumb({ path, label }: { path: string; label: string }) {
  const sb = createClient()
  const { data } = await sb.storage.from('driver-docs').createSignedUrl(path, 600)
  return (
    <a href={data?.signedUrl} target="_blank" className="block">
      <img src={data?.signedUrl} alt={label} className="w-full h-32 object-cover rounded border" />
      <div className="text-xs text-center mt-1">{label.replace('_', ' ')}</div>
    </a>
  )
}
