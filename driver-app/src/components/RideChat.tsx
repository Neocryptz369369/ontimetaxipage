import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { supabase } from '../supabase'
import { theme } from '../theme'

type Msg = { id: string; sender_id: string; body: string; created_at: string }

export default function RideChat({ rideId, currentUserId }: { rideId: string; currentUserId: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const listRef = useRef<FlatList<Msg>>(null)

  useEffect(() => {
    let alive = true
    supabase.from('ride_messages').select('*').eq('ride_id', rideId)
      .order('created_at').then(({ data }) => { if (alive && data) setMsgs(data) })
    const ch = supabase.channel(`ride:${rideId}`)
      .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'ride_messages', filter: `ride_id=eq.${rideId}` },
          (p) => setMsgs(m => [...m, p.new as Msg]))
      .subscribe()
    return () => { alive = false; supabase.removeChannel(ch) }
  }, [rideId])

  async function send() {
    if (!text.trim()) return
    const body = text.trim(); setText('')
    await supabase.from('ride_messages').insert({ ride_id: rideId, sender_id: currentUserId, body })
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 12, gap: 6 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.sender_id === currentUserId
          return (
            <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%',
                           backgroundColor: mine ? theme.primary : '#eee',
                           padding: 10, borderRadius: 14 }}>
              <Text style={{ color: mine ? '#fff' : theme.text }}>{item.body}</Text>
            </View>
          )
        }}
      />
      <View style={{ flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee' }}>
        <TextInput value={text} onChangeText={setText} placeholder="Message…"
          style={{ flex: 1, borderRadius: 20, backgroundColor: '#f4f4f5', paddingHorizontal: 14 }} />
        <Pressable onPress={send} style={{ marginLeft: 8, backgroundColor: theme.primary,
                                            paddingHorizontal: 16, justifyContent: 'center', borderRadius: 20 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}
