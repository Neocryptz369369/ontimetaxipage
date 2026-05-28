import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import Splash from "./src/screens/Splash";
import Login from "./src/screens/Login";
import DriverHome from "./src/screens/DriverHome";
import IncomingRide from "./src/screens/IncomingRide";
import ActiveRide from "./src/screens/ActiveRide";
import Earnings from "./src/screens/Earnings";
import { theme } from "./src/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        headerTitleStyle: { color: theme.colors.text, fontWeight: "700" },
        headerTintColor: theme.colors.primary,
      }}>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: "Driver sign in" }} />
        <Stack.Screen name="DriverHome" component={DriverHome} options={{ title: "On-Time Driver" }} />
        <Stack.Screen name="IncomingRide" component={IncomingRide} options={{ presentation: "modal", title: "New ride offer" }} />
        <Stack.Screen name="ActiveRide" component={ActiveRide} options={{ title: "Active ride" }} />
        <Stack.Screen name="Earnings" component={Earnings} options={{ title: "Earnings" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
