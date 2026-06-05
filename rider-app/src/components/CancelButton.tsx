import React, { useState } from 'react'
import { Pressable, Text, Alert, ActivityIndicator } from 'react-native'
import { supabase } from '../supabase'

export default function CancelButton({ rideId, onCancelled }: { rideId: string; onCancelled: () => void }) {
  const [busy, setBusy] = useState(false)
  async function cancel() {
    Alert.alert('Cancel ride?', 'A fee may apply if the driver has been dispatched for more than 2 minutes.', [
      { text: 'Keep ride', style: 'cancel' },
      { text: 'Cancel ride', style: 'destructive', onPress: async () => {
        setBusy(true)
        const { data, error } = await supabase.functions.invoke('cancel-ride', {
          body: { ride_id: rideId, cancelled_by: 'rider', reason: 'rider_cancel' },
        })
        setBusy(false)
        if (error) return Alert.alert('Error', error.message)
        if (data?.cancel_fee_cents > 0) {
          Alert.alert('Ride cancelled', `A cancellation fee of $${(data.cancel_fee_cents/100).toFixed(2)} was applied.`)
        }
        onCancelled()
      }},
    ])
  }
  return (
    <Pressable onPress={cancel} disabled={busy}
      style={{ backgroundColor: '#dc2626', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
      {busy ? <ActivityIndicator color="#fff" />
            : <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel ride</Text>}
    </Pressable>
  )
}
