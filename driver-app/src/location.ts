import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { supabase } from "./supabase";

const LOCATION_TASK = "on-time-driver-location";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) return;
  const loc = data?.locations?.[0];
  if (!loc) return;
  const { data: sess } = await supabase.auth.getSession();
  const driver_id = sess.session?.user.id;
  if (!driver_id) return;

  const { data: ride } = await supabase
    .from("rides").select("id")
    .eq("driver_id", driver_id)
    .in("status", ["accepted","arriving","arrived","in_progress"])
    .maybeSingle();

  await supabase.from("driver_pings").insert({
    driver_id,
    lat: loc.coords.latitude,
    lng: loc.coords.longitude,
    heading: loc.coords.heading ?? null,
    speed_mph: loc.coords.speed != null ? loc.coords.speed * 2.23694 : null,
    ride_id: ride?.id ?? null,
  });
  await supabase.from("drivers").update({
    current_lat: loc.coords.latitude,
    current_lng: loc.coords.longitude,
    last_ping: new Date().toISOString(),
  }).eq("user_id", driver_id);
});

export async function startTracking() {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") throw new Error("Location permission denied");
  try { await Location.requestBackgroundPermissionsAsync(); } catch {}
  const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (running) return;
  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 25,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "On-Time Driver",
      notificationBody: "Sharing your location to receive rides.",
    },
  });
}

export async function stopTracking() {
  const running = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (running) await Location.stopLocationUpdatesAsync(LOCATION_TASK);
}
