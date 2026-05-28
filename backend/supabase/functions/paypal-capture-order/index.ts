// PayPal: capture an approved order
// POST { ride_id, order_id }  ->  { status, capture_id }
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAYPAL_CLIENT = Deno.env.get("PAYPAL_CLIENT_ID")!;
const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET")!;
const PAYPAL_API = Deno.env.get("PAYPAL_ENV") === "prod"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function token() {
  const r = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const j = await r.json();
  return j.access_token as string;
}

serve(async (req) => {
  try {
    const { ride_id, order_id } = await req.json();
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const tok = await token();
    const r = await fetch(`${PAYPAL_API}/v2/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${tok}`, "Content-Type": "application/json" },
    });
    const result = await r.json();
    if (!r.ok) return json({ error: "paypal_capture_failed", detail: result }, 400);

    const cap = result.purchase_units?.[0]?.payments?.captures?.[0];
    const amount = Number(cap?.amount?.value ?? 0);
    const status = result.status === "COMPLETED" ? "captured" : "pending";

    await sb.from("payments").insert({
      ride_id, provider: "paypal", provider_ref: cap?.id ?? order_id,
      amount, status, raw: result,
    });
    await sb.from("rides").update({ payment_status: status, payment_ref: cap?.id ?? order_id }).eq("id", ride_id);

    return json({ status, capture_id: cap?.id });
  } catch (e) { return json({ error: String(e) }, 500); }
});
function json(b: any, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
}
