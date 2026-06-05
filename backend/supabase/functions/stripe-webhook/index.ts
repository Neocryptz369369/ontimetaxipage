import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { httpClient: Stripe.createFetchHttpClient() });
const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const whSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

serve(async (req) => {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, whSecret);
  } catch (e) {
    return new Response(`Webhook error: ${e}`, { status: 400 });
  }

  if (event.type === "account.updated") {
    const a = event.data.object as any;
    await supa.from("driver_stripe_accounts").update({
      charges_enabled: a.charges_enabled,
      payouts_enabled: a.payouts_enabled,
      details_submitted: a.details_submitted,
      updated_at: new Date().toISOString(),
    }).eq("stripe_account_id", a.id);
  }
  if (event.type === "payout.paid" || event.type === "payout.failed") {
    const p = event.data.object as any;
    await supa.from("driver_payouts").update({ stripe_payout_id: p.id, status: event.type === "payout.paid" ? "paid" : "failed" }).eq("stripe_transfer_id", p.source_transfer);
  }

  return new Response("ok");
});
