import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00DCB7',
        tabBarInactiveTintColor: '#C9CBCE',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          alignItems: 'center',
          borderWidth: 1
        },
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/home.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="ExpoCamera"
        options={{
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Camera.png')}
              style={{ width: 52, height: 40 }}
            />
          ),
          tabBarLabel: () => null,
          tabBarIconStyle: styles.iconContainer
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/profile.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),        
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    height: '100%'
  }
});