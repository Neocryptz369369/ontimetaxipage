import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const sb = supabaseAdmin();
  const today = new Date(); today.setHours(0,0,0,0);

  const [{ count: rides_today }, { count: active }, { count: drivers_online }, { data: revenue }] = await Promise.all([
    sb.from("rides").select("*", { count: "exact", head: true }).gte("requested_at", today.toISOString()),
    sb.from("rides").select("*", { count: "exact", head: true }).in("status", ["requested","searching","accepted","arriving","arrived","in_progress"]),
    sb.from("drivers").select("*", { count: "exact", head: true }).eq("is_online", true),
    sb.from("rides").select("final_fare, quoted_fare").eq("status", "completed").gte("completed_at", today.toISOString()),
  ]);
  const gross = (revenue ?? []).reduce((s: number, r: any) => s + Number(r.final_fare ?? r.quoted_fare ?? 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="Rides today" value={String(rides_today ?? 0)} />
        <Kpi label="Active rides" value={String(active ?? 0)} />
        <Kpi label="Drivers online" value={String(drivers_online ?? 0)} />
        <Kpi label="Revenue today" value={`$${gross.toFixed(2)}`} />
      </div>
    </div>
  );
}
function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="text-neutral-500 text-sm">{label}</div><div className="kpi mt-1">{value}</div></div>;
}
