import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors() });
  try {
    const { title, body, severity = "info", expires_in_minutes } = await req.json();
    if (!title || !body) return json({ error: "title and body required" }, 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const expires_at = expires_in_minutes
      ? new Date(Date.now() + expires_in_minutes * 60_000).toISOString()
      : null;

    const { data: alert, error } = await supabase
      .from("emergency_alerts")
      .insert({ title, body, severity, expires_at })
      .select()
      .single();
    if (error) throw error;

    const { data: drivers } = await supabase
      .from("drivers")
      .select("expo_push_token")
      .not("expo_push_token", "is", null);

    const tokens = (drivers ?? []).map((d: any) => d.expo_push_token).filter(Boolean);
    const messages = tokens.map((to: string) => ({
      to,
      sound: severity === "critical" ? "default" : null,
      title: `🚨 ${title}`,
      body,
      priority: severity === "critical" ? "high" : "default",
      data: { type: "emergency_alert", alert_id: alert.id, severity },
    }));

    if (messages.length) {
      const chunks: any[] = [];
      for (let i = 0; i < messages.length; i += 100) chunks.push(messages.slice(i, i + 100));
      await Promise.all(chunks.map((c) =>
        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(c),
        })
      ));
    }

    return json({ ok: true, alert, pushed: tokens.length });
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
