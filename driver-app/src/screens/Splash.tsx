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
      nav.reset({ index: 0, routes: [{ name: data.session ? "DriverHome" : "Login" }] });
    })();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: theme.colors.text }}>On-Time Driver</Text>
      <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 24 }} />
    </View>
  );
}
