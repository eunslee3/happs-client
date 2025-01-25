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
import userStore from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf')
  });
  const router = useRouter();
  const { user } = userStore();

  console.log('this is user: ', user)

  useEffect(() => {
    if (loaded && !(user?.id)) {
      router.navigate('/auth/Login')
      SplashScreen.hideAsync();
    } else if (loaded && user.id) {
      console.log('hit here')
      SplashScreen.hideAsync();
      router.navigate('/(tabs)/home')
    }
  }, [loaded]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
          headerShown: false
        }}>
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
