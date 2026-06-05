"use client";
import { useState } from "react";

type Toggle = { key: string; label: string; emoji?: string; desc?: string };

const STATUS_OVERRIDES: Toggle[] = [
  { key: "sosActive", emoji: "🚨", label: "MASTER SOS TOGGLE", desc: "Pulsing red broadcast to all active vehicles." },
  { key: "hospitalActive", emoji: "🏥", label: "HOSPITAL VISITATION MATRIX", desc: "Live room-coordinate broadcast streamer." },
  { key: "birthdayActive", emoji: "🎂", label: "NOVEMBER 16TH TICKER", desc: "Birthday celebration banner loop." },
  { key: "freeRideMode", emoji: "🎟️", label: "ADMINISTRATIVE FREE RIDE ($0.00)", desc: "Sets the next dispatched ride to $0.00 fare." },
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];
const DEFAULT_ON = new Set(["IN"]);

const INFRA = [
  { key: "twilio", label: "Twilio SMS gateway" },
  { key: "googleMaps", label: "Google Maps edge-telemetry" },
  { key: "androidStore", label: "Android .apk package tracking" },
  { key: "appleStore", label: "Apple iOS Store build sync" },
];

export default function ExecutivePage() {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(STATES.map((s) => [s, DEFAULT_ON.has(s)]))
  );
  const [comment, setComment] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [baseFare, setBaseFare] = useState("2.50");
  const [perMile, setPerMile] = useState("1.75");

  const toggleOverride = (k: string) => {
    setOverrides((p) => ({ ...p, [k]: !p[k] }));
    setLog((l) => [`${new Date().toLocaleTimeString()} • toggled ${k} → ${!overrides[k]}`, ...l].slice(0, 50));
  };
  const toggleState = (s: string) => {
    setStates((p) => ({ ...p, [s]: !p[s] }));
    setLog((l) => [`${new Date().toLocaleTimeString()} • state ${s} → ${!states[s] ? "ON" : "OFF"}`, ...l].slice(0, 50));
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-extrabold">Executive Control Suite</h1>
        <p className="text-neutral-500 mt-1">Priority overrides, geofencing, infrastructure, and fare rules.</p>
      </header>

      <section className="card">
        <h2 className="text-xl font-bold mb-4">1 · Priority Overrides</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {STATUS_OVERRIDES.map((t) => (
            <button
              key={t.key}
              onClick={() => toggleOverride(t.key)}
              className={`text-left p-4 rounded-xl border-2 transition ${
                overrides[t.key] ? "bg-red-50 border-red-500 animate-pulse" : "bg-white border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <div className="font-bold">{t.emoji} {t.label}</div>
              {t.desc && <div className="text-sm text-neutral-500 mt-1">{t.desc}</div>}
              <div className="text-xs mt-2 font-mono">{overrides[t.key] ? "● ACTIVE" : "○ standby"}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold mb-4">2 · Fare Rules <span className="text-sm font-normal text-neutral-500">(editable, live)</span></h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-xl">
          <label className="block">
            <span className="text-sm font-semibold">Base fare ($)</span>
            <input type="number" step="0.01" value={baseFare} onChange={(e) => setBaseFare(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Per mile ($)</span>
            <input type="number" step="0.01" value={perMile} onChange={(e) => setPerMile(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
        </div>
        <button className="mt-4 bg-brand text-white px-4 py-2 rounded-lg font-semibold text-sm"
          onClick={() => setLog((l) => [`${new Date().toLocaleTimeString()} • fare → base $${baseFare}, per-mi $${perMile}`, ...l].slice(0, 50))}>
          Save fare rules
        </button>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold mb-4">3 · Multi-State Jurisdictional Geofencing</h2>
        <p className="text-sm text-neutral-500 mb-3">Toggle dispatching per state. Indiana = live by default. All 50 states present.</p>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {STATES.map((s) => (
            <button key={s} onClick={() => toggleState(s)}
              className={`px-2 py-2 rounded-lg text-sm font-bold border-2 ${
                states[s] ? "bg-green-50 border-green-500 text-green-700" : "bg-neutral-50 border-neutral-200 text-neutral-400"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold mb-4">4 · Core Infrastructure Network Metrics</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {INFRA.map((i) => (
            <div key={i.key} className="flex items-center justify-between p-3 rounded-lg border">
              <span className="font-semibold">{i.label}</span>
              <span className="text-xs font-mono px-2 py-1 rounded bg-green-100 text-green-700">● online</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold mb-4">5 · Activity Log</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Priority note</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 h-28" placeholder="Operational note..." />
            <button className="mt-2 bg-brand text-white px-4 py-2 rounded-lg font-semibold text-sm"
              onClick={() => { if (comment.trim()) { setLog((l) => [`${new Date().toLocaleTimeString()} • note: ${comment}`, ...l].slice(0, 50)); setComment(""); } }}>
              Log signal
            </button>
          </div>
          <div className="bg-neutral-900 text-green-400 font-mono text-xs p-4 rounded-xl h-40 overflow-auto">
            {log.length === 0 ? <div className="opacity-50">no signals yet</div> : log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </section>
    </div>
  );
}
