import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  searching: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  arriving: "bg-blue-100 text-blue-800",
  arrived: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  no_show: "bg-red-100 text-red-800",
};

export default async function Rides() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("rides")
    .select("id, requested_at, status, tier_code, pickup_address, dropoff_address, quoted_fare, final_fare, payment_method, payment_status")
    .order("requested_at", { ascending: false }).limit(200);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rides</h1>
      <div className="card overflow-x-auto">
        <table className="dt">
          <thead>
            <tr><th>When</th><th>Status</th><th>Tier</th><th>From → To</th><th>Fare</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id}>
                <td className="text-neutral-500">{new Date(r.requested_at).toLocaleString()}</td>
                <td><span className={`badge ${STATUS_COLORS[r.status] ?? "bg-neutral-100"}`}>{r.status}</span></td>
                <td className="font-mono text-xs">{r.tier_code}</td>
                <td className="max-w-md truncate">{r.pickup_address} → {r.dropoff_address}</td>
                <td className="font-semibold">${Number(r.final_fare ?? r.quoted_fare).toFixed(2)}</td>
                <td className="text-xs">{r.payment_method} · <span className="text-neutral-500">{r.payment_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
