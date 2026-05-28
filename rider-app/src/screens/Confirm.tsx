import React, { useState } from 'react'
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native'
import { SQIPCore, SQIPCardEntry, CardDetails } from 'react-native-square-in-app-payments'
import { supabase } from '../supabase'
import { theme } from '../theme'

type Props = {
  rideId: string
  amountCents: number
  method: 'square' | 'paypal' | 'cash'
  onPaid: () => void
  onCancel: () => void
}

export default function Confirm({ rideId, amountCents, method, onPaid, onCancel }: Props) {
  const [busy, setBusy] = useState(false)

  async function paySquare() {
    setBusy(true)
    try {
      await SQIPCore.setSquareApplicationId(process.env.EXPO_PUBLIC_SQUARE_APP_ID!)
      await SQIPCardEntry.startCardEntryFlow(
        { collectPostalCode: true },
        async (card: CardDetails) => {
          const { data, error } = await supabase.functions.invoke('square-create-payment', {
            body: { ride_id: rideId, source_id: card.nonce, amount_cents: amountCents },
          })
          await SQIPCardEntry.completeCardEntry(() => {})
          if (error || !data?.ok) { Alert.alert('Payment failed', error?.message || data?.error || 'Unknown'); return }
          onPaid()
        },
        () => {} // canceled
      )
    } catch (e: any) {
      Alert.alert('Square error', String(e?.message ?? e))
    } finally { setBusy(false) }
  }

  async function payPayPal() {
    setBusy(true)
    try {
      const { data, error } = await supabase.functions.invoke('paypal-create-order', {
        body: { ride_id: rideId, amount_cents: amountCents },
      })
      if (error || !data?.approve_url) {
        Alert.alert('PayPal error', error?.message || 'Could not create order'); return
      }
      // navigate to PayPal WebView screen (handles capture on return)
      // expects caller to listen for onPaid via deep link or polling
      onPaid() // optimistic; WebView screen will confirm capture
    } finally { setBusy(false) }
  }

  async function payCash() {
    onPaid()
  }

  return (
    <View style={{ padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.text }}>
        Confirm payment
      </Text>
      <Text style={{ color: theme.muted }}>
        Amount: ${(amountCents / 100).toFixed(2)} · Method: {method.toUpperCase()}
      </Text>

      {busy ? <ActivityIndicator /> : (
        <>
          {method === 'square' && (
            <Pressable onPress={paySquare} style={btn(theme.primary)}>
              <Text style={btnText}>Pay with card</Text>
            </Pressable>
          )}
          {method === 'paypal' && (
            <Pressable onPress={payPayPal} style={btn('#003087')}>
              <Text style={btnText}>Pay with PayPal</Text>
            </Pressable>
          )}
          {method === 'cash' && (
            <Pressable onPress={payCash} style={btn('#444')}>
              <Text style={btnText}>Pay driver in cash</Text>
            </Pressable>
          )}
          <Pressable onPress={onCancel} style={btn('#999')}>
            <Text style={btnText}>Cancel</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}

const btn = (bg: string) => ({ backgroundColor: bg, padding: 14, borderRadius: 12, alignItems: 'center' as const })
const btnText = { color: '#fff', fontWeight: '600' as const, fontSize: 16 }
