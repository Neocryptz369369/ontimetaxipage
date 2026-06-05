import React, { useState } from 'react'
import { View, Text, Pressable, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { supabase } from '../supabase'
import { theme } from '../theme'

type Props = {
  pickup: { lat: number; lng: number; address: string }
  dropoff: { lat: number; lng: number; address: string }
  tier: string
  onScheduled: (rideId: string) => void
}

export default function Schedule({ pickup, dropoff, tier, onScheduled }: Props) {
  const [when, setWhen] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000))
  const [show, setShow] = useState(Platform.OS === 'ios')

  async function book() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('rides').insert({
      rider_id: user.id,
      tier,
      pickup_lat: pickup.lat, pickup_lng: pickup.lng, pickup_address: pickup.address,
      dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng, dropoff_address: dropoff.address,
      status: 'scheduled',
      scheduled_for: when.toISOString(),
      is_scheduled: true,
    }).select('id').single()
    if (error) return alert(error.message)
    onScheduled(data!.id)
  }

  return (
    <View style={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>Schedule a ride</Text>
      <Text style={{ color: theme.muted }}>Pick a date & time. We'll dispatch a driver 15 minutes before.</Text>

      {Platform.OS === 'android' && !show && (
        <Pressable onPress={() => setShow(true)} style={btn(theme.primary)}>
          <Text style={btnText}>Pick time</Text>
        </Pressable>
      )}

      {show && (
        <DateTimePicker
          mode="datetime"
          value={when}
          minimumDate={new Date(Date.now() + 30 * 60 * 1000)}
          onChange={(_, d) => { if (d) setWhen(d); if (Platform.OS === 'android') setShow(false) }}
        />
      )}

      <Text style={{ color: theme.text, fontSize: 16 }}>
        Selected: {when.toLocaleString()}
      </Text>

      <Pressable onPress={book} style={btn(theme.primary)}>
        <Text style={btnText}>Confirm booking</Text>
      </Pressable>
    </View>
  )
}

const btn = (bg: string) => ({ backgroundColor: bg, padding: 14, borderRadius: 12, alignItems: 'center' as const })
const btnText = { color: '#fff', fontWeight: '600' as const, fontSize: 16 }
