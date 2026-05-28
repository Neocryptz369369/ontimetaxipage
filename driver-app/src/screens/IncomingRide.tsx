import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function IncomingRide({ navigation }: any) {
  const [s_, setS] = useState(15);
  useEffect(()=>{ const i = setInterval(()=>setS(x=>x>0?x-1:0),1000); return ()=>clearInterval(i); },[]);
  useEffect(()=>{ if(s_===0) navigation.goBack(); },[s_]);
  return (
    <View style={s.c}>
      <View style={s.cd}><Text style={s.cdT}>{s_}s</Text></View>
      <Text style={s.ttl}>New ride · <Text style={{color:theme.yellow}}>Standard</Text></Text>
      <View style={s.box}>
        <Row k="Pickup" v="4 min away"/>
        <Row k="Drop-off" v="12.4 mi · 22 min"/>
        <Row k="Route" v="Jeffersonville → Louisville"/>
        <Row k="Estimated payout" v="$14.80" highlight/>
      </View>
      <View style={{flexDirection:'row',gap:10}}>
        <TouchableOpacity style={[s.btn,{backgroundColor:'#3a3f4d'}]} onPress={()=>navigation.goBack()}>
          <Text style={s.btnTxt}>DECLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn,{backgroundColor:theme.green}]} onPress={()=>navigation.goBack()}>
          <Text style={s.btnTxt}>ACCEPT ✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function Row({k,v,highlight}:any){
  return <View style={s.r}><Text style={{color:'#aaa',fontSize:13}}>{k}</Text>
    <Text style={{color: highlight?theme.yellow:'#fff', fontWeight:highlight?'800':'600',fontSize: highlight?15:13}}>{v}</Text></View>;
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:theme.black,padding:20,paddingTop:60,justifyContent:'space-between'},
  cd:{width:64,height:64,borderRadius:32,backgroundColor:theme.yellow,alignSelf:'center',alignItems:'center',justifyContent:'center'},
  cdT:{color:theme.black,fontWeight:'800',fontSize:22},
  ttl:{textAlign:'center',color:'#fff',fontSize:22,fontWeight:'800',marginTop:14},
  box:{backgroundColor:theme.slate,borderRadius:16,padding:18,marginVertical:14},
  r:{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderColor:'#2a2f3d'},
  btn:{flex:1,padding:18,borderRadius:14,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'800',fontSize:15},
});
