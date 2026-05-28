import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHome from './src/screens/DriverHome';
import IncomingRide from './src/screens/IncomingRide';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="DriverHome" component={DriverHome}/>
        <Stack.Screen name="IncomingRide" component={IncomingRide}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
