import { Image, StyleSheet, Platform, ScrollView, Text } from 'react-native';
import React, { useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SecureStore from 'expo-secure-store'
import { getAllPosts } from '@/api/posts/getAllPosts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const storedUser = AsyncStorage.getItem('user-storage')
  console.log('stored user: ', storedUser)
  const handleGetAllPosts = () => {
    const response = getAllPosts();
    console.log('wtf ru', response)
  }

  useEffect(() => {
    handleGetAllPosts()
  }, [])

  return (
    <ScrollView>
      <Text>The fuck is going on here</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
