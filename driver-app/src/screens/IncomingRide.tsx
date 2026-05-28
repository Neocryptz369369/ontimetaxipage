import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

const OFFER_SECONDS = 20;

export default function IncomingRide() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { ride_id } = route.params;
  const [ride, setRide] = useState<any>(null);
  const [secondsLeft, setSecondsLeft] = useState(OFFER_SECONDS);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("rides").select("*").eq("id", ride_id).single();
      setRide(data);
    })();
    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (secondsLeft <= 0) decline(); }, [secondsLeft]);

  async function accept() {
    const { data: sess } = await supabase.auth.getSession();
    const driver_id = sess.session?.user.id;
    const { error } = await supabase.from("rides").update({
      driver_id, status: "accepted", accepted_at: new Date().toISOString(),
    }).eq("id", ride_id).eq("status", "searching");
    if (error) return Alert.alert("Could not accept", error.message);
    nav.replace("ActiveRide", { ride_id });
  }
  async function decline() {
    await supabase.functions.invoke("dispatch-ride", { body: { ride_id, skip_driver: true } });
    nav.goBack();
  }

  if (!ride) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 24, gap: 12 }}>
      <Text style={{ color: theme.colors.muted }}>New ride · {secondsLeft}s</Text>
      <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800" }}>
        ${Number(ride.quoted_fare).toFixed(2)}
      </Text>
      <Text style={{ color: theme.colors.muted }}>{ride.tier_code.toUpperCase()} · {ride.estimated_miles ?? "?"} mi</Text>
      <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 8 }} />
      <Row label="Pickup" value={ride.pickup_address} />
      <Row label="Drop-off" value={ride.dropoff_address} />
      <Row label="Payment" value={ride.payment_method} />
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable onPress={decline} style={{ flex: 1, padding: 18, borderRadius: 14, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, alignItems: "center" }}>
          <Text style={{ color: theme.colors.text, fontWeight: "700" }}>Decline</Text>
        </Pressable>
        <Pressable onPress={accept} style={{ flex: 2, padding: 18, borderRadius: 14, backgroundColor: theme.colors.primary, alignItems: "center" }}>
          <Text style={{ color: theme.colors.primaryText, fontWeight: "800", fontSize: 16 }}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
