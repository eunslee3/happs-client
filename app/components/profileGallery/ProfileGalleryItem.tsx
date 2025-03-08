import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';

interface AlbumEntryProps {
  uri: any;  // Typing the album prop here
  callBack?: any;
  mediaType?: string;
  item?: any;
}

export default function ProfileGalleryItem ({ item }: { item: any}) {
  const thumbnail = item?.mediaUrls?.[0].thumbnailUrl ? item?.mediaUrls?.[0].thumbnailUrl : item?.mediaUrls?.[0].url;
  const { setSelectedPost } = postStore();
  return (
    <>
    <Pressable style={styles.imageContainer}>
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
    height: 200,
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