import React, { useState } from 'react'
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native'
import { supabase } from '../supabase'
import { theme } from '../theme'

const TIPS = [0, 15, 20, 25]

export default function Rate({ rideId, fareCents, onDone }:
  { rideId: string; fareCents: number; onDone: () => void }) {
  const [stars, setStars] = useState(0)
  const [tipPct, setTipPct] = useState(15)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      const tipCents = Math.round((fareCents * tipPct) / 100)
      await supabase.from('ratings').insert({ ride_id: rideId, stars })

      if (tipCents > 0) {
        const { error } = await supabase.functions.invoke('charge-tip', {
          body: { ride_id: rideId, tip_cents: tipCents },
        })
        if (error) Alert.alert('Tip skipped', error.message)
      }
      onDone()
    } finally { setBusy(false) }
  }

  return (
    <View style={{ padding: 24, gap: 18 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>How was your ride?</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <Pressable key={n} onPress={() => setStars(n)}>
            <Text style={{ fontSize: 42 }}>{n <= stars ? '★' : '☆'}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginTop: 12 }}>
        Add a tip?
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {TIPS.map(p => (
          <Pressable key={p} onPress={() => setTipPct(p)}
            style={{ flex: 1, padding: 12, borderRadius: 10, alignItems: 'center',
                     backgroundColor: tipPct === p ? theme.primary : '#eee' }}>
            <Text style={{ color: tipPct === p ? '#fff' : theme.text, fontWeight: '600' }}>
              {p === 0 ? 'None' : p + '%'}
            </Text>
            {p > 0 && (
              <Text style={{ color: tipPct === p ? '#fff' : theme.muted, fontSize: 11 }}>
                ${((fareCents * p) / 10000).toFixed(2)}
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      <Pressable onPress={submit} disabled={busy || stars === 0}
        style={{ backgroundColor: stars === 0 ? '#ccc' : theme.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
        {busy ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Submit</Text>}
      </Pressable>
    </View>
  )
}
