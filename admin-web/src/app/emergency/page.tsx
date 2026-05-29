"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EmergencyBroadcastPage() {
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<"info" | "warning" | "critical">("warning");
  const [expiresIn, setExpiresIn] = useState<number | "">(60);
  const [sending, setSending] = useState(false);
  const [recent, setRecent] = useState<any[]>([]);
  const [result, setResult] = useState<string>("");

  const loadRecent = async () => {
    const { data } = await supabase
      .from("emergency_alerts").select("*")
      .order("created_at", { ascending: false }).limit(20);
    setRecent(data ?? []);
  };
  useEffect(() => { loadRecent(); }, []);

  const send = async () => {
    if (!title || !body) return alert("Title and body required");
    if (!confirm(`Broadcast "${title}" to ALL drivers as ${severity.toUpperCase()}?`)) return;
    setSending(true);
    setResult("");
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/emergency-broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ title, body, severity, expires_in_minutes: expiresIn || null }),
    });
    const j = await res.json();
    setSending(false);
    if (j.ok) {
      setResult(`✅ Sent to ${j.pushed} drivers`);
      setTitle(""); setBody("");
      loadRecent();
    } else {
      setResult(`❌ ${j.error}`);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>🚨 Emergency Broadcast</h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Push notification + in-app alert delivered to every driver with the app installed.
      </p>

      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <label>
          <div>Severity</div>
          <select value={severity} onChange={(e) => setSeverity(e.target.value as any)}
            style={{ width: "100%", padding: 8, fontSize: 16 }}>
            <option value="info">Info (blue)</option>
            <option value="warning">Warning (orange)</option>
            <option value="critical">Critical (red, loud)</option>
          </select>
        </label>
        <label>
          <div>Title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80}
            placeholder="e.g. Severe weather — pull over"
            style={{ width: "100%", padding: 8, fontSize: 16 }} />
        </label>
        <label>
          <div>Message</div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} rows={4}
            placeholder="Details drivers need to know..."
            style={{ width: "100%", padding: 8, fontSize: 16 }} />
        </label>
        <label>
          <div>Auto-expire after (minutes, blank = never)</div>
          <input type="number" value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value === "" ? "" : Number(e.target.value))}
            style={{ width: "100%", padding: 8, fontSize: 16 }} />
        </label>
      </div>

      <button onClick={send} disabled={sending}
        style={{
          width: "100%", padding: 14, fontSize: 18, fontWeight: 600, color: "#fff",
          background: severity === "critical" ? "#dc2626" : severity === "warning" ? "#d97706" : "#2563eb",
          border: "none", borderRadius: 8, cursor: "pointer", opacity: sending ? 0.6 : 1,
        }}>
        {sending ? "Broadcasting..." : `Broadcast to all drivers`}
      </button>
      {result && <div style={{ marginTop: 12, fontWeight: 600 }}>{result}</div>}

      <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>Recent broadcasts</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {recent.map((a) => (
          <div key={a.id} style={{
            padding: 12, borderLeft: `4px solid ${a.severity === "critical" ? "#dc2626" : a.severity === "warning" ? "#d97706" : "#2563eb"}`,
            background: "#f9fafb", borderRadius: 6,
          }}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {a.severity.toUpperCase()} · {new Date(a.created_at).toLocaleString()}
            </div>
            <div style={{ fontWeight: 600 }}>{a.title}</div>
            <div style={{ fontSize: 14 }}>{a.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
