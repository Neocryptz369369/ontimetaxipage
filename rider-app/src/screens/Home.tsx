import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../theme';

export default function Home({ navigation }: any) {
  const [where, setWhere] = useState('');
  return (
    <View style={{flex:1,backgroundColor:'#F4F5F7'}}>
      <View style={s.searchBox}>
        <View style={s.dot}/>
        <TextInput placeholder="Where to?" value={where} onChangeText={setWhere}
          onSubmitEditing={()=>navigation.navigate('TierSelect',{ destination: where })}
          style={s.input}/>
      </View>
      <MapView style={{flex:1,margin:12,borderRadius:14}}
        initialRegion={{latitude:38.2776, longitude:-85.7372, latitudeDelta:0.1, longitudeDelta:0.1}}>
        <Marker coordinate={{latitude:38.2776, longitude:-85.7372}} title="You"/>
      </MapView>
      <TouchableOpacity style={s.sched}><Text>⏰ Schedule for later</Text></TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  searchBox:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',margin:14,padding:14,borderRadius:14,gap:10},
  dot:{width:10,height:10,borderRadius:5,backgroundColor:theme.green},
  input:{flex:1,fontSize:15,fontWeight:'600'},
  sched:{backgroundColor:'#fff',margin:14,padding:14,borderRadius:12,borderWidth:1,borderColor:theme.line},
});
