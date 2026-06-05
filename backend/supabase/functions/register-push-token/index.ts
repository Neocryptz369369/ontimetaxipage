import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() });
  try {
    const { expo_push_token } = await req.json();
    const auth = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const { error } = await supabase
      .from("drivers")
      .update({ expo_push_token })
      .eq("user_id", user.id);
    if (error) throw error;
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...cors(), "Content-Type": "application/json" } });
}
