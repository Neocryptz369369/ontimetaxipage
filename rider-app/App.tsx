import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/Splash';
import HomeScreen from './src/screens/Home';
import TierSelectScreen from './src/screens/TierSelect';
import EnRouteScreen from './src/screens/EnRoute';
import { theme } from './src/theme';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle:{backgroundColor:theme.yellow}, headerTintColor:theme.black }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:'On Time Taxi'}}/>
        <Stack.Screen name="TierSelect" component={TierSelectScreen} options={{title:'Choose your ride'}}/>
        <Stack.Screen name="EnRoute" component={EnRouteScreen} options={{title:'On the way'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
