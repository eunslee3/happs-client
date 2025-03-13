import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const itemHeight = (windowWidth * 0.33) * 1.5

export default function ProfileGalleryItem ({ item }: { item: any}) {
  const thumbnail = item?.mediaUrls?.[0].thumbnailUrl ? item?.mediaUrls?.[0].thumbnailUrl : item?.mediaUrls?.[0].url;
  const { setSelectedPost } = postStore();
  const router = useRouter();

  const handlePress = () => {
    setSelectedPost(item);
    router.push('../../(tabs)/ViewPost')
  }

  return (
    <>
    <Pressable onPress={handlePress} style={styles.imageContainer}>
      <Image 
          source={{ uri: thumbnail }}
          style={styles.image}
        />
    </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '33%',
    height: itemHeight,
    borderWidth: 1,
    borderColor: 'white'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  duration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    color: 'white',
    zIndex: 9999,
    fontSize: 12,
    fontWeight: 'bold',
  }
})