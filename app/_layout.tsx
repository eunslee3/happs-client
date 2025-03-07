import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import Toast from 'react-native-toast-message';
import userStore from '@/store/userStore';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user } = userStore();

  useEffect(() => {
    if (!(user?.id)) {
      router.navigate('/auth/Login');
      SplashScreen.hideAsync();
    } else if (user.id) {
      router.navigate('/(tabs)/Home');
      SplashScreen.hideAsync();
    }
  }, [user]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme} >
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
