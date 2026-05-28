// Square: create payment from a card nonce (client tokenized via Square Web Payments SDK or React Native plugin)
// POST { ride_id, source_id, idempotency_key }  ->  { payment_id, status }
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN")!;
const SQUARE_LOCATION_ID = Deno.env.get("SQUARE_LOCATION_ID")!;
const SQUARE_API = Deno.env.get("SQUARE_ENV") === "prod"
  ? "https://connect.squareup.com/v2"
  : "https://connect.squareupsandbox.com/v2";

serve(async (req) => {
  try {
    const { ride_id, source_id, idempotency_key } = await req.json();
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: ride, error } = await sb.from("rides").select("*").eq("id", ride_id).single();
    if (error || !ride) return json({ error: "ride not found" }, 404);
    const amount_cents = Math.round(Number(ride.final_fare ?? ride.quoted_fare) * 100);

    const res = await fetch(`${SQUARE_API}/payments`, {
      method: "POST",
      headers: {
        "Square-Version": "2024-07-17",
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_id,
        idempotency_key: idempotency_key ?? crypto.randomUUID(),
        amount_money: { amount: amount_cents, currency: "USD" },
        location_id: SQUARE_LOCATION_ID,
        reference_id: ride_id,
        note: `On-Time Taxi ride ${ride_id}`,
        autocomplete: true,
      }),
    });
    const body = await res.json();
    if (!res.ok) return json({ error: "square_error", detail: body }, 400);

    const payment = body.payment;
    await sb.from("payments").insert({
      ride_id, provider: "square", provider_ref: payment.id,
      amount: amount_cents / 100, status: payment.status === "COMPLETED" ? "captured" : "authorized", raw: body,
    });
    await sb.from("rides").update({
      payment_status: payment.status === "COMPLETED" ? "captured" : "authorized",
      payment_ref: payment.id,
    }).eq("id", ride_id);

    return json({ payment_id: payment.id, status: payment.status });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
function json(b: any, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { "content-type": "application/json" } });
}
