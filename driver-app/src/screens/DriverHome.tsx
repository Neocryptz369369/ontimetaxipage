import { useEffect, useState } from "react";
import { View, Text, Switch, Pressable, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { startTracking, stopTracking } from "../location";
import { theme } from "../theme";

export default function DriverHome() {
  const nav = useNavigation<any>();
  const [online, setOnline] = useState(false);
  const [stats, setStats] = useState<{ rides: number; gross: number }>({ rides: 0, gross: 0 });
  const [driverId, setDriverId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const id = sess.session?.user.id ?? null;
      setDriverId(id);
      if (!id) return;
      const { data: d } = await supabase.from("drivers").select("is_online").eq("user_id", id).single();
      setOnline(!!d?.is_online);

      const today = new Date(); today.setHours(0,0,0,0);
      const { data: rides } = await supabase
        .from("rides").select("final_fare, quoted_fare")
        .eq("driver_id", id).eq("status", "completed")
        .gte("completed_at", today.toISOString());
      const list = rides ?? [];
      setStats({
        rides: list.length,
        gross: list.reduce((s, r: any) => s + Number(r.final_fare ?? r.quoted_fare ?? 0), 0),
      });
    })();
  }, []);

  useEffect(() => {
    if (!driverId) return;
    const chan = supabase.channel(`offers-${driverId}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `driver_id=eq.${driverId}` },
        (payload) => {
          if (payload.new.status === "searching" || (payload.new.status === "requested" && payload.new.driver_id === driverId)) {
            nav.navigate("IncomingRide", { ride_id: payload.new.id });
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(chan); };
  }, [driverId]);

  async function toggle(v: boolean) {
    if (!driverId) return;
    setOnline(v);
    await supabase.from("drivers").update({ is_online: v }).eq("user_id", driverId);
    try {
      if (v) await startTracking();
      else await stopTracking();
    } catch (e: any) {
      Alert.alert("Location error", e.message);
      setOnline(false);
      await supabase.from("drivers").update({ is_online: false }).eq("user_id", driverId);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={card}>
        <Text style={{ color: theme.colors.muted }}>Status</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800" }}>
            {online ? "🟢 Online" : "⚪ Offline"}
          </Text>
          <Switch value={online} onValueChange={toggle} thumbColor={online ? theme.colors.primary : "#999"} />
        </View>
      </View>

      <View style={card}>
        <Text style={{ color: theme.colors.muted }}>Today</Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800", marginTop: 4 }}>
          ${stats.gross.toFixed(2)}
        </Text>
        <Text style={{ color: theme.colors.muted, marginTop: 2 }}>{stats.rides} rides</Text>
      </View>

      <Pressable onPress={() => nav.navigate("Earnings")} style={{ ...card, alignItems: "center" }}>
        <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>View all earnings →</Text>
      </Pressable>

      <Pressable onPress={async () => { await supabase.auth.signOut(); nav.reset({ index: 0, routes: [{ name: "Login" }] }); }}
        style={{ padding: 14, alignItems: "center", marginTop: 24 }}>
        <Text style={{ color: theme.colors.muted }}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const card = {
  backgroundColor: theme.colors.surface,
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: theme.colors.border,
} as const;
