"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StripePayoutButton({ payoutId, onDone }: { payoutId: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const run = async () => {
    if (!confirm("Send Stripe transfer for this payout?")) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("stripe-payout-transfer", { body: { payout_id: payoutId } });
    setLoading(false);
    if (error || data?.error) return alert("Failed: " + (error?.message || data?.error));
    alert("Transfer sent: " + data.transfer_id);
    onDone();
  };
  return <button onClick={run} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">{loading ? "Sending..." : "Pay via Stripe"}</button>;
}
