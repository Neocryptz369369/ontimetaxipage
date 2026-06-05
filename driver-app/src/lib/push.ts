import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "./supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return null;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("emergency", {
      name: "Emergency Alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: "#dc2626",
      sound: "default",
    });
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/register-push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ expo_push_token: token }),
    });
  }
  return token;
}

export function usePushRegistration() {
  useEffect(() => { registerForPushNotificationsAsync().catch(() => {}); }, []);
}
