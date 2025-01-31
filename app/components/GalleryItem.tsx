import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

interface AlbumEntryProps {
  uri: any;  // Typing the album prop here
  callBack?: any;
  mediaType?: string;
  item?: any;
}

export default function GalleryItem (props: AlbumEntryProps) {
  const { uri, callBack, mediaType, item } = props;

  // console.log(item)

  return (
    <>
    <Pressable style={styles.imageContainer} onPress={() => callBack(item)}>
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
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%',
  }
})