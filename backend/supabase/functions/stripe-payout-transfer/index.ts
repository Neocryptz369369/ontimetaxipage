import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { httpClient: Stripe.createFetchHttpClient() });
const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { payout_id } = await req.json();
    const { data: payout } = await supa.from("driver_payouts").select("*").eq("id", payout_id).single();
    if (!payout) return new Response(JSON.stringify({ error: "payout not found" }), { status: 404, headers: corsHeaders });
    if (payout.status === "paid") return new Response(JSON.stringify({ error: "already paid" }), { status: 400, headers: corsHeaders });

    const { data: acct } = await supa.from("driver_stripe_accounts").select("*").eq("driver_id", payout.driver_id).single();
    if (!acct || !acct.payouts_enabled) return new Response(JSON.stringify({ error: "driver not Stripe-onboarded" }), { status: 400, headers: corsHeaders });

    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.net_cents),
      currency: "usd",
      destination: acct.stripe_account_id,
      metadata: { payout_id, driver_id: payout.driver_id },
    });

    await supa.from("driver_payouts").update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_transfer_id: transfer.id,
      external_ref: transfer.id,
    }).eq("id", payout_id);

    return new Response(JSON.stringify({ ok: true, transfer_id: transfer.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
