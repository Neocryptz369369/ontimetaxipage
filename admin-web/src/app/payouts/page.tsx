import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Payouts() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("payouts")
    .select("id, driver_id, period_start, period_end, gross, platform_fee, net, status, provider, created_at, users:driver_id(full_name, phone)")
    .order("created_at", { ascending: false }).limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payouts</h1>
      <div className="card overflow-x-auto">
        <table className="dt">
          <thead><tr><th>Driver</th><th>Period</th><th>Gross</th><th>Fee</th><th>Net</th><th>Provider</th><th>Status</th></tr></thead>
          <tbody>
            {(data ?? []).map((p: any) => (
              <tr key={p.id}>
                <td className="font-semibold">{p.users?.full_name ?? p.driver_id}</td>
                <td className="text-xs">{p.period_start} → {p.period_end}</td>
                <td>${Number(p.gross).toFixed(2)}</td>
                <td className="text-neutral-500">${Number(p.platform_fee).toFixed(2)}</td>
                <td className="font-bold">${Number(p.net).toFixed(2)}</td>
                <td className="text-xs">{p.provider ?? "—"}</td>
                <td><span className={`badge ${p.status === "sent" ? "bg-green-100 text-green-800" : p.status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{p.status}</span></td>
              </tr>
            ))}
            {(!data || data.length === 0) && <tr><td colSpan={7} className="text-center text-neutral-500 py-8">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
