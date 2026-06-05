import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { callEdge } from "../supabase";
import { TIERS, Quote, TierCode } from "../types";
import { theme } from "../theme";

export default function TierSelect() {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { pickup, dropoff } = route.params;
  const [quotes, setQuotes] = useState<Record<string, Quote | { error: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results: Record<string, Quote | { error: string }> = {};
      await Promise.all(TIERS.map(async (t) => {
        try {
          const q = await callEdge<Quote>("quote-fare", {
            tier: t.code, pickup, dropoff,
            is_round_trip: t.code === "long_haul",
          });
          results[t.code] = q;
        } catch (e: any) {
          results[t.code] = { error: e.message ?? "unavailable" };
        }
      }));
      setQuotes(results);
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={{ marginTop: 12, color: theme.colors.muted }}>Fetching prices…</Text>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: theme.colors.bg }}
      data={TIERS}
      keyExtractor={(t) => t.code}
      renderItem={({ item }) => {
        const q = quotes[item.code];
        const ok = q && !("error" in q);
        return (
          <Pressable
            disabled={!ok}
            onPress={() => ok && nav.navigate("Confirm", { quote: q, pickup, dropoff, tier: item.code })}
            style={{
              padding: 16, marginHorizontal: 12, marginTop: 12,
              backgroundColor: theme.colors.surface, borderRadius: 16,
              opacity: ok ? 1 : 0.5,
              flexDirection: "row", alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginRight: 12 }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: 16, color: theme.colors.text }}>{item.name}</Text>
              <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{item.blurb}</Text>
              {ok && (
                <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 2 }}>
                  {(q as Quote).miles} mi · ~{(q as Quote).minutes} min
                  {(q as Quote).is_out_of_state ? " · out-of-state" : ""}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: 20, fontWeight: "800", color: theme.colors.text }}>
              {ok ? `$${(q as Quote).fare.toFixed(2)}` : "—"}
            </Text>
          </Pressable>
        );
      }}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  );
}
