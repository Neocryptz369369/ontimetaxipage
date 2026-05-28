import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

export default function Rate() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { ride_id } = route.params;
  const [stars, setStars] = useState(5);

  async function submit() {
    await supabase.from("rides").update({ rider_rating: stars }).eq("id", ride_id);
    nav.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 24, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>How was your ride?</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[1,2,3,4,5].map(n => (
          <Pressable key={n} onPress={() => setStars(n)}>
            <Text style={{ fontSize: 40 }}>{n <= stars ? "★" : "☆"}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={submit} style={{ backgroundColor: theme.colors.primary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 }}>
        <Text style={{ fontWeight: "700" }}>Submit</Text>
      </Pressable>
    </View>
  );
}
