import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

export default function Splash() {
  const nav = useNavigation<any>();
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      nav.reset({ index: 0, routes: [{ name: data.session ? "Home" : "Login" }] });
    })();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "800", color: theme.colors.text }}>On-Time Taxi</Text>
      <Text style={{ color: theme.colors.muted, marginTop: 8 }}>Anywhere in Clark County. And beyond.</Text>
      <ActivityIndicator style={{ marginTop: 24 }} color={theme.colors.primary} />
    </View>
  );
}
