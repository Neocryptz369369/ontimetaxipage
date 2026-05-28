import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

export default function EnRoute() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { ride_id } = route.params;
  const [ride, setRide] = useState<any>(null);
  const [driverLoc, setDriverLoc] = useState<{lat:number,lng:number} | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("rides").select("*").eq("id", ride_id).single();
      if (active) setRide(data);
    })();

    const rideChan = supabase
      .channel(`ride-${ride_id}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${ride_id}` },
        (payload) => {
          setRide(payload.new);
          if (payload.new.status === "completed") nav.replace("Rate", { ride_id });
        })
      .subscribe();

    const pingChan = supabase
      .channel(`pings-${ride_id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "driver_pings", filter: `ride_id=eq.${ride_id}` },
        (payload) => setDriverLoc({ lat: Number(payload.new.lat), lng: Number(payload.new.lng) }))
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(rideChan);
      supabase.removeChannel(pingChan);
    };
  }, [ride_id]);

  async function cancel() {
    Alert.alert("Cancel ride?", "Driver may charge a cancellation fee.", [
      { text: "No" },
      { text: "Yes, cancel", style: "destructive", onPress: async () => {
        await supabase.from("rides").update({ status: "canceled", canceled_at: new Date().toISOString(), cancel_reason: "rider_canceled" }).eq("id", ride_id);
        nav.popToTop();
      }},
    ]);
  }

  if (!ride) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <MapView style={{ flex: 1 }}
        initialRegion={{
          latitude: Number(ride.pickup_lat), longitude: Number(ride.pickup_lng),
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}>
        <Marker coordinate={{ latitude: Number(ride.pickup_lat), longitude: Number(ride.pickup_lng) }} pinColor="green" title="Pickup" />
        <Marker coordinate={{ latitude: Number(ride.dropoff_lat), longitude: Number(ride.dropoff_lng) }} pinColor="red" title="Drop-off" />
        {driverLoc && <Marker coordinate={{ latitude: driverLoc.lat, longitude: driverLoc.lng }} title="Driver" pinColor="orange" />}
      </MapView>
      <View style={{ padding: 16, gap: 8, borderTopWidth: 1, borderColor: theme.colors.border }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.text }}>Status: {ride.status}</Text>
        <Text style={{ color: theme.colors.muted }}>Fare: ${Number(ride.quoted_fare).toFixed(2)}</Text>
        {ride.status !== "completed" && ride.status !== "canceled" && (
          <Pressable onPress={cancel} style={{ padding: 14, borderRadius: 12, backgroundColor: theme.colors.danger, alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "700" }}>Cancel ride</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
