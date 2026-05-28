import { useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";
import { PaymentMethod } from "../types";

export default function Confirm() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { quote, pickup, dropoff, tier } = route.params;
  const [method, setMethod] = useState<PaymentMethod>("square");
  const [booking, setBooking] = useState(false);

  async function book() {
    setBooking(true);
    const { data: sess } = await supabase.auth.getSession();
    const rider_id = sess.session?.user.id;
    if (!rider_id) { setBooking(false); return Alert.alert("Please sign in."); }

    const { data, error } = await supabase.from("rides").insert({
      rider_id,
      tier_code: tier,
      pickup_address: pickup.address,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_address: dropoff.address,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      is_out_of_state: quote.is_out_of_state,
      is_round_trip: quote.is_round_trip,
      estimated_miles: quote.miles,
      estimated_minutes: quote.minutes,
      quoted_fare: quote.fare,
      payment_method: method,
      status: "requested",
    }).select("id").single();

    if (error || !data) {
      setBooking(false);
      return Alert.alert("Could not book", error?.message ?? "unknown");
    }

    await supabase.functions.invoke("dispatch-ride", { body: { ride_id: data.id } });
    setBooking(false);
    nav.replace("EnRoute", { ride_id: data.id });
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.bg, gap: 12 }}>
      <Row label="From" value={pickup.address} />
      <Row label="To" value={dropoff.address} />
      <Row label="Distance" value={`${quote.miles} mi · ~${quote.minutes} min`} />
      <Row label="Tier" value={tier} />
      <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 8 }} />
      <Text style={{ fontSize: 14, color: theme.colors.muted }}>Payment method</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["square","paypal","cash"] as PaymentMethod[]).map(m => (
          <Pressable key={m} onPress={() => setMethod(m)}
            style={{
              flex: 1, padding: 12, borderRadius: 12, alignItems: "center",
              borderWidth: 2,
              borderColor: method === m ? theme.colors.primary : theme.colors.border,
              backgroundColor: method === m ? theme.colors.primary : theme.colors.bg,
            }}>
            <Text style={{ fontWeight: "700", color: theme.colors.text }}>
              {m === "square" ? "Card (Square)" : m === "paypal" ? "PayPal" : "Cash"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      <Text style={{ fontSize: 36, fontWeight: "800", color: theme.colors.text, textAlign: "center" }}>
        ${quote.fare.toFixed(2)}
      </Text>
      <Pressable disabled={booking} onPress={book}
        style={{ backgroundColor: theme.colors.primary, padding: 18, borderRadius: 14, alignItems: "center" }}>
        {booking ? <ActivityIndicator /> :
          <Text style={{ fontWeight: "800", fontSize: 16, color: theme.colors.primaryText }}>Book ride</Text>}
      </Pressable>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: theme.colors.muted }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: "600", flexShrink: 1, textAlign: "right" }}>{value}</Text>
    </View>
  );
}
