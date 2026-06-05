import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Riders() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("users").select("id, full_name, phone, email, rating, total_rides, status, created_at")
    .eq("role", "rider").order("created_at", { ascending: false }).limit(200);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Riders</h1>
      <div className="card overflow-x-auto">
        <table className="dt">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Rating</th><th>Rides</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            {(data ?? []).map((u: any) => (
              <tr key={u.id}>
                <td className="font-semibold">{u.full_name ?? "—"}</td>
                <td>{u.phone}</td>
                <td className="text-neutral-500">{u.email ?? "—"}</td>
                <td>★ {Number(u.rating).toFixed(1)}</td>
                <td>{u.total_rides}</td>
                <td><span className={`badge ${u.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{u.status}</span></td>
                <td className="text-neutral-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
