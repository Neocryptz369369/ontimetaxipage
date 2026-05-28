import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { theme } from "../theme";

const CLARK_COUNTY = { latitude: 38.4783, longitude: -85.7585, latitudeDelta: 0.2, longitudeDelta: 0.2 };

export default function Home() {
  const nav = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  const [pickup, setPickup] = useState<{lat:number,lng:number,address:string} | null>(null);
  const [dropoff, setDropoff] = useState<{lat:number,lng:number,address:string} | null>(null);
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const here = { lat: loc.coords.latitude, lng: loc.coords.longitude, address: "Current location" };
      setPickup(here);
      setPickupText("Current location");
      mapRef.current?.animateToRegion({
        latitude: here.lat, longitude: here.lng,
        latitudeDelta: 0.05, longitudeDelta: 0.05,
      });
    })();
  }, []);

  function next() {
    if (!pickup) return Alert.alert("Pickup required");
    if (!dropoff) {
      Alert.alert("Drop-off required", "Tap the map or type an address. (Geocoding hooks live in src/geocode.ts.)");
      return;
    }
    nav.navigate("TierSelect", { pickup, dropoff });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={CLARK_COUNTY}
        showsUserLocation
        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          const place = { lat: latitude, lng: longitude, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` };
          if (!dropoff) { setDropoff(place); setDropoffText(place.address); }
          else { setPickup(place); setPickupText(place.address); }
        }}
      >
        {pickup && <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} title="Pickup" pinColor="green" />}
        {dropoff && <Marker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} title="Drop-off" pinColor="red" />}
      </MapView>

      <View style={{ padding: 16, gap: 10, borderTopWidth: 1, borderColor: theme.colors.border }}>
        <TextInput value={pickupText} onChangeText={setPickupText} placeholder="Pickup address" style={inputStyle} />
        <TextInput value={dropoffText} onChangeText={setDropoffText} placeholder="Drop-off address" style={inputStyle} />
        <Pressable onPress={next} style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: "center" }}>
          <Text style={{ fontWeight: "700", color: theme.colors.primaryText }}>See prices</Text>
        </Pressable>
        <Text style={{ color: theme.colors.muted, fontSize: 12, textAlign: "center" }}>
          Tip: long-press the map to drop drop-off, then pickup.
        </Text>
      </View>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 12,
  padding: 12,
  fontSize: 16,
  color: theme.colors.text,
};
