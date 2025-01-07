import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from "@/hooks/useColorScheme";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Page Imports //
import Login from './auth/Login';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const Stack = createStackNavigator();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <NavigationContainer> */}
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="auth/login.tsx"
            component
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen name="+not-found" /> */}
        </Stack.Navigator>
        <StatusBar style="auto" />
      {/* </NavigationContainer> */}
    </ThemeProvider>
  );
}
