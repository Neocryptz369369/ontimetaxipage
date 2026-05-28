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
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) return Alert.alert("Error", error.message);
    setSent(true);
  }

  async function verify() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
    setLoading(false);
    if (error) return Alert.alert("Error", error.message);
    nav.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: theme.colors.bg, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.text }}>Sign in with your phone</Text>
      <TextInput
        placeholder="+1 812 555 1234"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        style={inputStyle}
      />
      {sent && (
        <TextInput
          placeholder="6-digit code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={inputStyle}
        />
      )}
      <Pressable
        disabled={loading}
        onPress={sent ? verify : sendOtp}
        style={{ backgroundColor: theme.colors.primary, padding: 16, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ fontWeight: "700", color: theme.colors.primaryText }}>
          {loading ? "..." : sent ? "Verify code" : "Send code"}
        </Text>
      </Pressable>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 12,
  padding: 14,
  fontSize: 16,
  color: theme.colors.text,
};
