import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { theme } from '../theme';

export default function EnRoute() {
  return (
    <View style={{flex:1}}>
      <MapView style={{flex:1}} initialRegion={{latitude:38.2776,longitude:-85.7372,latitudeDelta:0.05,longitudeDelta:0.05}}/>
      <View style={s.card}>
        <Text style={s.eta}>🚕 Arriving in 6 min</Text>
        <View style={s.row}>
          <View style={s.pic}><Text style={{fontWeight:'700'}}>MR</Text></View>
          <View style={{flex:1,marginLeft:12}}>
            <Text style={{fontWeight:'700',fontSize:15}}>Mike R.  ⭐ 4.9</Text>
            <Text style={{color:'#666',fontSize:12}}>Black Camry · ABC 123</Text>
          </View>
        </View>
        <View style={s.acts}>
          <TouchableOpacity style={s.act}><Text>💬</Text><Text style={s.actL}>Message</Text></TouchableOpacity>
          <TouchableOpacity style={s.act}><Text>📞</Text><Text style={s.actL}>Call</Text></TouchableOpacity>
          <TouchableOpacity style={s.act}><Text>🛡️</Text><Text style={s.actL}>Share</Text></TouchableOpacity>
          <TouchableOpacity style={[s.act,{backgroundColor:'#FEE'}]}><Text>🆘</Text><Text style={[s.actL,{color:theme.red}]}>SOS</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  card:{backgroundColor:'#fff',padding:18,borderTopLeftRadius:24,borderTopRightRadius:24,marginTop:-20},
  eta:{textAlign:'center',backgroundColor:theme.black,color:theme.yellow,padding:8,borderRadius:24,fontWeight:'700',alignSelf:'center',paddingHorizontal:18,marginBottom:14},
  row:{flexDirection:'row',alignItems:'center',marginBottom:14},
  pic:{width:48,height:48,borderRadius:24,backgroundColor:theme.yellow,alignItems:'center',justifyContent:'center'},
  acts:{flexDirection:'row',gap:8},
  act:{flex:1,backgroundColor:'#F4F5F7',padding:10,borderRadius:10,alignItems:'center'},
  actL:{fontSize:11,fontWeight:'600',marginTop:2},
});
