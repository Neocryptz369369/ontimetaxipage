import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { httpClient: Stripe.createFetchHttpClient() });
const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { driver_id, return_url, refresh_url } = await req.json();
    if (!driver_id) return new Response(JSON.stringify({ error: "driver_id required" }), { status: 400, headers: corsHeaders });

    let { data: existing } = await supa.from("driver_stripe_accounts").select("*").eq("driver_id", driver_id).maybeSingle();
    let accountId = existing?.stripe_account_id;

    if (!accountId) {
      const { data: drv } = await supa.from("drivers").select("email,phone,full_name").eq("id", driver_id).single();
      const acct = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: drv?.email ?? undefined,
        capabilities: { transfers: { requested: true } },
        business_type: "individual",
      });
      accountId = acct.id;
      await supa.from("driver_stripe_accounts").insert({ driver_id, stripe_account_id: accountId });
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refresh_url ?? "https://example.com/refresh",
      return_url: return_url ?? "https://example.com/return",
      type: "account_onboarding",
    });

    return new Response(JSON.stringify({ url: link.url, account_id: accountId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
