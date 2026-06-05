import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Splash from "./src/screens/Splash";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import TierSelect from "./src/screens/TierSelect";
import Confirm from "./src/screens/Confirm";
import EnRoute from "./src/screens/EnRoute";
import Rate from "./src/screens/Rate";
import { theme } from "./src/theme";

export type RootStack = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  TierSelect: { pickup: any; dropoff: any };
  Confirm: { quote: any; pickup: any; dropoff: any; tier: string };
  EnRoute: { ride_id: string };
  Rate: { ride_id: string };
};

const Stack = createNativeStackNavigator<RootStack>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerTitleStyle: { color: theme.colors.text, fontWeight: "700" },
          headerTintColor: theme.colors.primary,
        }}
      >
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: "Sign in" }} />
        <Stack.Screen name="Home" component={Home} options={{ title: "On-Time Taxi" }} />
        <Stack.Screen name="TierSelect" component={TierSelect} options={{ title: "Choose your ride" }} />
        <Stack.Screen name="Confirm" component={Confirm} options={{ title: "Confirm ride" }} />
        <Stack.Screen name="EnRoute" component={EnRoute} options={{ title: "Driver on the way" }} />
        <Stack.Screen name="Rate" component={Rate} options={{ title: "Rate your ride" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
