import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function Splash({ navigation }: any) {
  return (
    <View style={s.c}>
      <View style={s.logo}><Text style={s.logoTxt}>OT</Text></View>
      <Text style={s.brand}>On Time Taxi</Text>
      <Text style={s.tag}>Everyone needs a ride.</Text>
      <View style={{width:'100%'}}>
        <TouchableOpacity style={s.btn} onPress={()=>navigation.replace('Home')}>
          <Text style={s.btnTxt}>📱  Continue with Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn,s.btnOut]}>
          <Text style={[s.btnTxt,{color:theme.black}]}>Continue as Driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:theme.yellow,alignItems:'center',justifyContent:'space-around',padding:32,paddingTop:80,paddingBottom:48},
  logo:{width:120,height:120,borderRadius:60,backgroundColor:theme.black,alignItems:'center',justifyContent:'center'},
  logoTxt:{color:theme.yellow,fontSize:48,fontWeight:'800'},
  brand:{fontSize:32,fontWeight:'800',color:theme.black},
  tag:{fontSize:16,color:theme.black,opacity:0.7,marginTop:6},
  btn:{backgroundColor:theme.black,padding:16,borderRadius:14,marginTop:10,alignItems:'center'},
  btnOut:{backgroundColor:'transparent',borderWidth:2,borderColor:theme.black},
  btnTxt:{color:theme.yellow,fontWeight:'600',fontSize:15},
});
