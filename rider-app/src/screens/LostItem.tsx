import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native'
import { supabase } from '../supabase'
import { theme } from '../theme'

export default function LostItem({ rideId, onDone }: { rideId: string; onDone: () => void }) {
  const [desc, setDesc] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit() {
    if (!desc.trim()) return
    setBusy(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('lost_items').insert({
      ride_id: rideId, rider_id: user.id, description: desc.trim(),
    })
    setBusy(false)
    if (error) return Alert.alert('Error', error.message)
    Alert.alert('Reported', 'Support will contact you within 24 hours.')
    onDone()
  }
  return (
    <View style={{ padding: 24, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>Lost an item?</Text>
      <Text style={{ color: theme.muted }}>Describe what you left in the vehicle.</Text>
      <TextInput multiline value={desc} onChangeText={setDesc}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, minHeight: 120, padding: 12 }}
        placeholder="e.g. Black wallet with red lining…" />
      <Pressable onPress={submit} disabled={busy}
        style={{ backgroundColor: theme.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        {busy ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontWeight: '700' }}>Submit report</Text>}
      </Pressable>
    </View>
  )
}
