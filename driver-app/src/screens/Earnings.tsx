import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { supabase } from "../supabase";
import { theme } from "../theme";

export default function Earnings() {
  const [rides, setRides] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const id = sess.session?.user.id;
      if (!id) return setRides([]);
      const since = new Date(); since.setDate(since.getDate() - 30);
      const { data } = await supabase.from("rides")
        .select("id, completed_at, tier_code, quoted_fare, final_fare, pickup_address, dropoff_address")
        .eq("driver_id", id).eq("status", "completed")
        .gte("completed_at", since.toISOString())
        .order("completed_at", { ascending: false });
      setRides(data ?? []);
    })();
  }, []);

  if (rides === null) return <View style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: "center" }}><ActivityIndicator /></View>;
  const total = rides.reduce((s, r) => s + Number(r.final_fare ?? r.quoted_fare ?? 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: theme.colors.muted }}>Last 30 days</Text>
        <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800" }}>${total.toFixed(2)}</Text>
        <Text style={{ color: theme.colors.muted }}>{rides.length} rides</Text>
      </View>
      <FlatList
        data={rides}
        keyExtractor={r => r.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: theme.colors.border }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.colors.text, fontWeight: "700" }}>{item.tier_code}</Text>
              <Text style={{ color: theme.colors.text, fontWeight: "700" }}>${Number(item.final_fare ?? item.quoted_fare).toFixed(2)}</Text>
            </View>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }} numberOfLines={1}>{item.pickup_address} → {item.dropoff_address}</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 11 }}>{new Date(item.completed_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
