import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { theme } from "../theme";

export default function Login() {
  const nav = useNavigation<any>();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  async function send() {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) return Alert.alert("Error", error.message);
    setSent(true);
  }
  async function verify() {
    const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
    if (error) return Alert.alert("Error", error.message);
    nav.reset({ index: 0, routes: [{ name: "DriverHome" }] });
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, backgroundColor: theme.colors.bg }}>
      <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "700" }}>Driver sign in</Text>
      <TextInput placeholder="+1 812 555 1234" placeholderTextColor={theme.colors.muted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={input} />
      {sent && <TextInput placeholder="6-digit code" placeholderTextColor={theme.colors.muted} value={code} onChangeText={setCode} keyboardType="number-pad" style={input} />}
      <Pressable onPress={sent ? verify : send} style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: "center" }}>
        <Text style={{ fontWeight: "700", color: theme.colors.primaryText }}>{sent ? "Verify" : "Send code"}</Text>
      </Pressable>
    </View>
  );
}
const input = { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 14, color: theme.colors.text, fontSize: 16 } as const;
