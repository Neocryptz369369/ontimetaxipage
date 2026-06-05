import React from 'react'
import { View, ActivityIndicator, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { supabase } from '../supabase'

type Props = {
  approveUrl: string
  orderId: string
  rideId: string
  onPaid: () => void
  onCancel: () => void
}

export default function PayPalWebView({ approveUrl, orderId, rideId, onPaid, onCancel }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: approveUrl }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={{ flex: 1 }} />}
        onNavigationStateChange={async (nav) => {
          // PayPal redirects to a return_url with ?token=...&PayerID=...
          if (nav.url.includes('PayerID=')) {
            const { data, error } = await supabase.functions.invoke('paypal-capture-order', {
              body: { order_id: orderId, ride_id: rideId },
            })
            if (error || !data?.ok) {
              Alert.alert('Capture failed', error?.message || data?.error || 'Unknown')
              onCancel(); return
            }
            onPaid()
          }
          if (nav.url.includes('cancel')) onCancel()
        }}
      />
    </View>
  )
}
