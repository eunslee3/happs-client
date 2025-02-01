import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';

interface AlbumEntryProps {
  uri: any;  // Typing the album prop here
  callBack?: any;
  mediaType?: string;
  item?: any;
}

export default function GalleryItem (props: AlbumEntryProps) {
  const { uri, callBack, mediaType, item } = props;

  const formatFloatToMinutes = (floatValue: number) => {
    const minutes = (floatValue / 60).toFixed(2).toString().replace('.', ':');
    return `${minutes}`;
  }

  return (
    <>
    <Pressable style={styles.imageContainer} onPress={() => callBack(item)}>
      {mediaType === 'video' ?
          <Text style={styles.duration}>{formatFloatToMinutes(item.duration)}</Text>
          :
          null
        }
      <Image 
          source={uri}
          style={styles.image}
        />
    </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '25%',  // Ensure 4 images per row
    height: 100,
    borderWidth: 1,
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