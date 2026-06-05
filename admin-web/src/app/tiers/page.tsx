import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function updateTier(formData: FormData) {
  "use server";
  const sb = supabaseAdmin();
  const code = String(formData.get("code"));
  await sb.from("tiers").update({
    base_fare: Number(formData.get("base_fare")),
    per_mile: Number(formData.get("per_mile")),
    per_minute: Number(formData.get("per_minute")),
    minimum_fare: Number(formData.get("minimum_fare")),
    surcharge: Number(formData.get("surcharge") || 0),
    long_haul_per_mile_rt: formData.get("long_haul_per_mile_rt") ? Number(formData.get("long_haul_per_mile_rt")) : null,
    active: formData.get("active") === "on",
  }).eq("code", code);
  revalidatePath("/tiers");
}

export default async function Tiers() {
  const sb = supabaseAdmin();
  const { data } = await sb.from("tiers").select("*").order("code");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tiers &amp; Pricing</h1>
      <p className="text-sm text-neutral-500 mb-4">Live values — edits take effect immediately for new quotes.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {(data ?? []).map((t: any) => (
          <form key={t.code} action={updateTier} className="card space-y-2">
            <input type="hidden" name="code" value={t.code} />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{t.name}</div>
                <div className="text-xs font-mono text-neutral-500">{t.code}</div>
              </div>
              <label className="text-sm flex items-center gap-1">
                <input type="checkbox" name="active" defaultChecked={t.active} /> active
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Base ($)" name="base_fare" defaultValue={t.base_fare} />
              <Field label="Min fare ($)" name="minimum_fare" defaultValue={t.minimum_fare} />
              <Field label="$/mile" name="per_mile" defaultValue={t.per_mile} />
              <Field label="$/min" name="per_minute" defaultValue={t.per_minute} />
              <Field label="Surcharge ($)" name="surcharge" defaultValue={t.surcharge ?? 0} />
              <Field label="$/mi RT (long haul)" name="long_haul_per_mile_rt" defaultValue={t.long_haul_per_mile_rt ?? ""} />
            </div>
            <button className="btn-primary w-full mt-2">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: any }) {
  return (
    <label className="text-xs text-neutral-600">
      <span className="block mb-1">{label}</span>
      <input name={name} defaultValue={defaultValue} step="0.01" type="number"
        className="w-full border border-neutral-300 rounded px-2 py-1 text-sm" />
    </label>
  );
}
