import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from "@/hooks/useColorScheme";
import { NavigationContainer } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf')
  });
  const router = useRouter();

  // useEffect(() => {
  //   router.replace('/auth/Login')
  // }, [])

  useEffect(() => {
    if (loaded) {
      router.replace('/auth/Login')
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // const Stack = createStackNavigator();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName='auth/Login'>
          <Stack.Screen
            name="auth/Login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/Signup"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/ConfirmToken"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
        <Toast
          position='top'
          topOffset={70}
        />
    </ThemeProvider>
  );
}
