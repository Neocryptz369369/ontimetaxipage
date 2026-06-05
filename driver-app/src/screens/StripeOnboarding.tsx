import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Linking } from "react-native";
import { supabase } from "../lib/supabase";
import { a11yButton, a11yHeader } from "../lib/a11y";

export default function StripeOnboarding({ driverId }: { driverId: string }) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke("stripe-connect-status", { body: { driver_id: driverId } });
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const startOnboarding = async () => {
    const { data } = await supabase.functions.invoke("stripe-connect-onboard", {
      body: { driver_id: driverId, return_url: "ontimetaxi://onboard-complete", refresh_url: "ontimetaxi://onboard-refresh" },
    });
    if (data?.url) Linking.openURL(data.url);
  };

  if (loading) return <ActivityIndicator />;
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text {...a11yHeader("Payouts Setup")} style={{ fontSize: 22, fontWeight: "700" }}>Payouts Setup</Text>
      {status?.onboarded ? (
        <Text style={{ color: "green" }}>✓ Your account is ready for direct deposits.</Text>
      ) : (
        <>
          <Text>To receive weekly direct deposits, finish setup with Stripe.</Text>
          <Button title="Set up payouts" onPress={startOnboarding} {...a11yButton("Set up payouts with Stripe")} />
          <Button title="Refresh status" onPress={refresh} {...a11yButton("Refresh onboarding status")} />
        </>
      )}
    </View>
  );
}
