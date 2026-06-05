// Square payment webhook -> updates rides.payment_status + writes payments row
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SQUARE_SIGNATURE_KEY = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY") ?? "";

serve(async (req) => {
  const body = await req.text();
  // TODO: verify HMAC signature with SQUARE_SIGNATURE_KEY + request URL
  const event = JSON.parse(body);
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const payment = event?.data?.object?.payment;
  const rideId = payment?.reference_id;
  if (!rideId) return new Response("no ride ref", { status: 200 });

  const status = payment.status === "COMPLETED" ? "captured"
               : payment.status === "APPROVED"  ? "authorized"
               : payment.status === "FAILED"    ? "failed"
               : "pending";

  await sb.from("payments").insert({
    ride_id: rideId, provider: "square", provider_ref: payment.id,
    amount: (payment.amount_money?.amount ?? 0) / 100, status, raw: event,
  });
  await sb.from("rides").update({ payment_status: status, payment_ref: payment.id }).eq("id", rideId);

  return new Response("ok");
});
