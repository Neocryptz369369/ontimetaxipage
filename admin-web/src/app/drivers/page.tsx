import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Drivers() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("drivers")
    .select("user_id, is_online, background_check_status, accepts_pets, accepts_long_haul, senior_certified, last_ping, users(full_name, phone, rating, total_rides, status), vehicles(make, model, year, plate, is_wav, is_xl)")
    .order("is_online", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>
      <div className="card overflow-x-auto">
        <table className="dt">
          <thead><tr><th>Name</th><th>Phone</th><th>Vehicle</th><th>Status</th><th>BG check</th><th>Certs</th><th>Rating</th><th>Rides</th></tr></thead>
          <tbody>
            {(data ?? []).map((d: any) => (
              <tr key={d.user_id}>
                <td className="font-semibold">{d.users?.full_name ?? "—"}</td>
                <td>{d.users?.phone}</td>
                <td>{d.vehicles ? `${d.vehicles.year} ${d.vehicles.make} ${d.vehicles.model} · ${d.vehicles.plate}` : "—"}</td>
                <td><span className={`badge ${d.is_online ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-600"}`}>{d.is_online ? "Online" : "Offline"}</span></td>
                <td><span className={`badge ${d.background_check_status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{d.background_check_status}</span></td>
                <td className="text-xs">{[d.accepts_pets && "pets", d.accepts_long_haul && "long-haul", d.senior_certified && "senior", d.vehicles?.is_wav && "WAV", d.vehicles?.is_xl && "XL"].filter(Boolean).join(", ") || "—"}</td>
                <td>★ {d.users?.rating?.toFixed?.(1) ?? "5.0"}</td>
                <td>{d.users?.total_rides ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
