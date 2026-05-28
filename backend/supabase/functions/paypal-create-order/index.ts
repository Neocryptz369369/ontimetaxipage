// PayPal: create order for a ride; rider approves in PayPal SDK, then call paypal-capture-order
// POST { ride_id }  ->  { order_id, approve_url }
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
    const { ride_id } = await req.json();
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: ride, error } = await sb.from("rides").select("*").eq("id", ride_id).single();
    if (error || !ride) return json({ error: "ride not found" }, 404);

    const amount = Number(ride.final_fare ?? ride.quoted_fare).toFixed(2);
    const tok = await token();
    const r = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          custom_id: ride_id,
          invoice_id: ride_id,
          description: `On-Time Taxi ride ${ride_id}`,
          amount: { currency_code: "USD", value: amount },
        }],
        application_context: {
          brand_name: "On-Time Taxi",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
        },
      }),
    });
    const order = await r.json();
    if (!r.ok) return json({ error: "paypal_error", detail: order }, 400);

    const approve = (order.links ?? []).find((l: any) => l.rel === "approve")?.href ?? null;
    await sb.from("rides").update({ payment_ref: order.id, payment_status: "pending" }).eq("id", ride_id);
    return json({ order_id: order.id, approve_url: approve });
  } catch (e) { return json({ error: String(e) }, 500); }
});
function json(b: any, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
}
