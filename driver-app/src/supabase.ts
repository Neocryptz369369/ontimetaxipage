import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const url = (Constants.expoConfig?.extra as any)?.SUPABASE_URL as string;
const anonKey = (Constants.expoConfig?.extra as any)?.SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
