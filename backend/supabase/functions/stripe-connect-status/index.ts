import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { httpClient: Stripe.createFetchHttpClient() });
const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { driver_id } = await req.json();
  const { data: row } = await supa.from("driver_stripe_accounts").select("*").eq("driver_id", driver_id).maybeSingle();
  if (!row) return new Response(JSON.stringify({ onboarded: false }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const acct = await stripe.accounts.retrieve(row.stripe_account_id);
  const updates = {
    charges_enabled: acct.charges_enabled,
    payouts_enabled: acct.payouts_enabled,
    details_submitted: acct.details_submitted,
    updated_at: new Date().toISOString(),
  };
  await supa.from("driver_stripe_accounts").update(updates).eq("driver_id", driver_id);
  return new Response(JSON.stringify({ onboarded: acct.details_submitted && acct.payouts_enabled, ...updates }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
