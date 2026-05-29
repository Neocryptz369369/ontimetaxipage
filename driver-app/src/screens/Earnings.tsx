import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { supabase } from '../supabase'
import { theme } from '../theme'

type Payout = {
  id: string; period_id: string; gross_cents: number; tips_cents: number;
  fees_cents: number; net_cents: number; ride_count: number; status: string;
  period: { starts_on: string; ends_on: string }
}

export default function Earnings() {
  const [rows, setRows] = useState<Payout[] | null>(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('driver_payouts')
        .select('*, period:payout_periods(starts_on,ends_on)')
        .eq('driver_id', user.id).order('created_at', { ascending: false })
      setRows((data as any) ?? [])
    })()
  }, [])

  if (!rows) return <ActivityIndicator style={{ flex: 1 }} />

  const lifetime = rows.reduce((s, r) => s + r.net_cents, 0)

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 14, color: theme.muted }}>Lifetime earnings</Text>
      <Text style={{ fontSize: 36, fontWeight: '700', color: theme.text }}>
        ${(lifetime / 100).toFixed(2)}
      </Text>
      <FlatList
        data={rows}
        keyExtractor={r => r.id}
        contentContainerStyle={{ gap: 10, paddingTop: 16 }}
        renderItem={({ item }) => (
          <View style={{ padding: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600', color: theme.text }}>
              {item.period.starts_on} → {item.period.ends_on}
            </Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>
              {item.ride_count} rides · status: {item.status}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text>Gross ${(item.gross_cents/100).toFixed(2)}</Text>
              <Text>Tips ${(item.tips_cents/100).toFixed(2)}</Text>
              <Text>Fee -${(item.fees_cents/100).toFixed(2)}</Text>
              <Text style={{ fontWeight: '700' }}>Net ${(item.net_cents/100).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}
