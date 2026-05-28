import React, { useState } from 'react'
import { View, Text, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../supabase'
import { theme } from '../theme'

type DocKind = 'license' | 'insurance' | 'registration' | 'vehicle_photo'
const STEPS: { kind: DocKind; label: string }[] = [
  { kind: 'license',       label: "Driver's License" },
  { kind: 'insurance',     label: 'Insurance Card' },
  { kind: 'registration',  label: 'Vehicle Registration' },
  { kind: 'vehicle_photo', label: 'Photo of Vehicle' },
]

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [uploaded, setUploaded] = useState<Record<DocKind, boolean>>({} as any)
  const [busy, setBusy] = useState<DocKind | null>(null)

  async function upload(kind: DocKind) {
    setBusy(kind)
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync()
      if (!perm.granted) { Alert.alert('Camera required'); return }
      const r = await ImagePicker.launchCameraAsync({ quality: 0.6, base64: false })
      if (r.canceled) return
      const asset = r.assets[0]
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      const path = `${user.id}/${kind}-${Date.now()}.jpg`
      const blob = await (await fetch(asset.uri)).blob()
      const { error: upErr } = await supabase.storage
        .from('driver-docs').upload(path, blob, { contentType: 'image/jpeg', upsert: true })
      if (upErr) throw upErr

      const { error: dbErr } = await supabase.from('driver_documents').insert({
        driver_id: user.id, kind, storage_path: path, status: 'pending',
      })
      if (dbErr) throw dbErr

      setUploaded(s => ({ ...s, [kind]: true }))
    } catch (e: any) {
      Alert.alert('Upload failed', String(e?.message ?? e))
    } finally { setBusy(null) }
  }

  async function submitForReview() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('drivers').update({ onboarding_status: 'in_review' }).eq('id', user.id)
    Alert.alert('Submitted', 'We\'ll review within 24 hours.')
    onComplete()
  }

  const allDone = STEPS.every(s => uploaded[s.kind])

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 14 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>Driver onboarding</Text>
      <Text style={{ color: theme.muted }}>Upload 4 photos. Admins will review within 24 hours.</Text>

      {STEPS.map(s => (
        <Pressable key={s.kind} onPress={() => upload(s.kind)}
          style={{ padding: 16, borderRadius: 12, borderWidth: 1,
                   borderColor: uploaded[s.kind] ? '#10b981' : '#ddd',
                   backgroundColor: uploaded[s.kind] ? '#ecfdf5' : '#fff' }}>
          {busy === s.kind
            ? <ActivityIndicator />
            : <Text style={{ fontSize: 16, color: theme.text }}>
                {uploaded[s.kind] ? '✓ ' : ''}{s.label}
              </Text>}
        </Pressable>
      ))}

      <Pressable disabled={!allDone} onPress={submitForReview}
        style={{ backgroundColor: allDone ? theme.primary : '#ccc', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Submit for review</Text>
      </Pressable>
    </ScrollView>
  )
}
