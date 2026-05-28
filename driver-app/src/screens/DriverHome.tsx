import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { theme } from '../theme';

export default function DriverHome({ navigation }: any) {
  const [online, setOnline] = useState(false);
  return (
    <View style={s.c}>
      <Text style={s.hello}>Hey Mike 👋</Text>
      <Text style={s.earn}>$142.50</Text>
      <Text style={s.earnSub}>today</Text>
      <TouchableOpacity style={[s.toggle, online && s.toggleOff]} onPress={()=>setOnline(!online)}>
        <Text style={s.toggleTxt}>{online ? '⏸  GO OFFLINE' : '⚡ GO ONLINE'}</Text>
      </TouchableOpacity>
      <MapView style={s.map}
        initialRegion={{latitude:38.2776,longitude:-85.7372,latitudeDelta:0.05,longitudeDelta:0.05}}/>
      <View style={s.stats}>
        <View style={s.stat}><Text style={s.statV}>8</Text><Text style={s.statL}>Rides today</Text></View>
        <View style={s.stat}><Text style={s.statV}>⭐ 4.9</Text><Text style={s.statL}>Rating</Text></View>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('IncomingRide')} style={{padding:10}}>
        <Text style={{color:theme.yellow,textAlign:'center'}}>[demo] simulate incoming ride →</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:theme.black,padding:16,paddingTop:60},
  hello:{color:'#bbb',fontSize:14},
  earn:{color:theme.yellow,fontSize:38,fontWeight:'800'},
  earnSub:{color:'#888',marginBottom:14},
  toggle:{backgroundColor:theme.yellow,padding:20,borderRadius:18,alignItems:'center'},
  toggleOff:{backgroundColor:'#3a3f4d'},
  toggleTxt:{color:theme.black,fontWeight:'800',fontSize:17},
  map:{flex:1,borderRadius:16,marginVertical:14},
  stats:{flexDirection:'row',gap:10},
  stat:{flex:1,backgroundColor:theme.slate,padding:14,borderRadius:12},
  statV:{color:theme.yellow,fontSize:22,fontWeight:'800'},
  statL:{color:'#999',fontSize:11,marginTop:2},
});
