// PayPal webhook -> updates rides.payment_status + writes payments row
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  const event = await req.json();
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const resource = event?.resource;
  const rideId = resource?.custom_id || resource?.invoice_id;
  if (!rideId) return new Response("no ride ref", { status: 200 });

  const type = event.event_type ?? "";
  const status = type.includes("CAPTURE.COMPLETED") ? "captured"
               : type.includes("AUTHORIZATION")     ? "authorized"
               : type.includes("DENIED") || type.includes("FAILED") ? "failed"
               : "pending";

  await sb.from("payments").insert({
    ride_id: rideId, provider: "paypal", provider_ref: resource?.id,
    amount: Number(resource?.amount?.value ?? 0), status, raw: event,
  });
  await sb.from("rides").update({ payment_status: status, payment_ref: resource?.id }).eq("id", rideId);

  return new Response("ok");
});
