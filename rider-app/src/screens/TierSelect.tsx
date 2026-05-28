import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

const TIERS = [
  { id:'standard', icon:'🚗', name:'Standard', meta:'4 seats · 6 min', price:18.50 },
  { id:'xl', icon:'🚙', name:'XL', meta:'7 seats · 8 min', price:26.00 },
  { id:'country', icon:'🌾', name:'Country Run', meta:'Rural flat-rate', price:24.00 },
  { id:'pet', icon:'🐾', name:'Pet-Friendly', meta:'+$5', price:23.50 },
  { id:'wav', icon:'♿', name:'Wheelchair', meta:'WAV', price:18.50 },
  { id:'senior', icon:'👴', name:'Senior Assist', meta:'+$3 service', price:21.50 },
  { id:'long_haul', icon:'🛣️', name:'Long Haul', meta:'Out-of-state', price:null },
];

export default function TierSelect({ navigation }: any) {
  const [sel, setSel] = useState('standard');
  const selected = TIERS.find(t=>t.id===sel)!;
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <FlatList data={TIERS} keyExtractor={t=>t.id}
        renderItem={({item})=>(
          <TouchableOpacity onPress={()=>setSel(item.id)}
            style={[s.row, sel===item.id && s.sel]}>
            <Text style={{fontSize:28}}>{item.icon}</Text>
            <View style={{flex:1,marginLeft:12}}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.meta}>{item.meta}</Text>
            </View>
            <Text style={s.price}>{item.price ? `$${item.price.toFixed(2)}` : 'Quote'}</Text>
          </TouchableOpacity>
        )}/>
      <TouchableOpacity style={s.cta} onPress={()=>navigation.navigate('EnRoute')}>
        <Text style={s.ctaTxt}>Confirm {selected.price ? `$${selected.price.toFixed(2)}` : 'Quote'}  →</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',padding:14,margin:8,borderRadius:12},
  sel:{backgroundColor:'#FFF7DC',borderWidth:2,borderColor:theme.yellow},
  name:{fontWeight:'700',fontSize:15},
  meta:{color:'#888',fontSize:12,marginTop:2},
  price:{fontWeight:'700',fontSize:16},
  cta:{backgroundColor:theme.yellow,margin:14,padding:18,borderRadius:14,alignItems:'center'},
  ctaTxt:{fontWeight:'800',fontSize:16,color:theme.black},
});
