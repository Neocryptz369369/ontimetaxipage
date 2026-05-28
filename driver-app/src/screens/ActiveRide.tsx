import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

const FLOW: Record<string, { next: string; label: string }> = {
  accepted:    { next: "arriving",    label: "Heading to pickup" },
  arriving:    { next: "arrived",     label: "Arrived at pickup" },
  arrived:     { next: "in_progress", label: "Start trip" },
  in_progress: { next: "completed",   label: "Complete trip" },
};

export default function ActiveRide() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { ride_id } = route.params;
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("rides").select("*").eq("id", ride_id).single();
      if (active) setRide(data);
    })();
    const chan = supabase.channel(`ride-${ride_id}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${ride_id}` },
        (payload) => setRide(payload.new))
      .subscribe();
    return () => { active = false; supabase.removeChannel(chan); };
  }, [ride_id]);

  async function advance() {
    if (!ride) return;
    const step = FLOW[ride.status];
    if (!step) return;
    const patch: any = { status: step.next };
    if (step.next === "in_progress") patch.picked_up_at = new Date().toISOString();
    if (step.next === "completed") {
      patch.completed_at = new Date().toISOString();
      patch.final_fare = ride.quoted_fare;
    }
    await supabase.from("rides").update(patch).eq("id", ride_id);
    if (step.next === "completed") nav.reset({ index: 0, routes: [{ name: "DriverHome" }] });
  }

  function navigate(toPickup: boolean) {
    if (!ride) return;
    const lat = toPickup ? ride.pickup_lat : ride.dropoff_lat;
    const lng = toPickup ? ride.pickup_lng : ride.dropoff_lng;
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`);
  }

  async function cancel() {
    Alert.alert("Cancel ride?", undefined, [
      { text: "No" },
      { text: "Yes", style: "destructive", onPress: async () => {
        await supabase.from("rides").update({ status: "canceled", canceled_at: new Date().toISOString(), cancel_reason: "driver_canceled" }).eq("id", ride_id);
        nav.reset({ index: 0, routes: [{ name: "DriverHome" }] });
      }}
    ]);
  }

  if (!ride) return null;
  const step = FLOW[ride.status];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <MapView style={{ flex: 1 }}
        initialRegion={{
          latitude: Number(ride.pickup_lat), longitude: Number(ride.pickup_lng),
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}>
        <Marker coordinate={{ latitude: Number(ride.pickup_lat), longitude: Number(ride.pickup_lng) }} pinColor="green" title="Pickup" />
        <Marker coordinate={{ latitude: Number(ride.dropoff_lat), longitude: Number(ride.dropoff_lng) }} pinColor="red" title="Drop-off" />
      </MapView>
      <View style={{ padding: 16, gap: 10, borderTopWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
        <Text style={{ color: theme.colors.muted }}>Status</Text>
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800" }}>{ride.status}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => navigate(ride.status === "accepted" || ride.status === "arriving" || ride.status === "arrived")}
            style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: theme.colors.accent, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Open in Maps</Text>
          </Pressable>
          {step && (
            <Pressable onPress={advance} style={{ flex: 1, padding: 14, borderRadius: 12, backgroundColor: theme.colors.primary, alignItems: "center" }}>
              <Text style={{ color: theme.colors.primaryText, fontWeight: "800" }}>{step.label}</Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={cancel} style={{ padding: 10, alignItems: "center" }}>
          <Text style={{ color: theme.colors.danger }}>Cancel ride</Text>
        </Pressable>
      </View>
    </View>
  );
}
