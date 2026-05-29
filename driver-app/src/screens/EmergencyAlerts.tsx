import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../lib/supabase";

type AlertRow = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  created_at: string;
  expires_at: string | null;
};

const COLORS: Record<string, string> = {
  info: "#2563eb",
  warning: "#d97706",
  critical: "#dc2626",
};

export default function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("emergency_alerts")
      .select("*")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) Alert.alert("Error", error.message);
    else setAlerts(data ?? []);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("emergency_alerts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "emergency_alerts" }, (payload) => {
        setAlerts((prev) => [payload.new as AlertRow, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  const markRead = async (alertId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", user.id).single();
    if (!driver) return;
    await supabase.from("emergency_alert_reads").upsert({ alert_id: alertId, driver_id: driver.id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚨 Emergency Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={(a) => a.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No active alerts</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markRead(item.id)}
            style={[styles.card, { borderLeftColor: COLORS[item.severity] }]}
          >
            <View style={styles.row}>
              <Text style={[styles.sev, { color: COLORS[item.severity] }]}>{item.severity.toUpperCase()}</Text>
              <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  card: { borderLeftWidth: 6, padding: 14, marginBottom: 10, backgroundColor: "#f9fafb", borderRadius: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  sev: { fontWeight: "700", fontSize: 12 },
  time: { color: "#6b7280", fontSize: 12 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  body: { fontSize: 14, color: "#374151" },
});
