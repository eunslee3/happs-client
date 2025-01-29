import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

interface AlbumEntryProps {
  uri: any;  // Typing the album prop here
  callBack: any;
  mediaType: string;
}

export default function GalleryItem (props: AlbumEntryProps) {
  const { uri, callBack, mediaType } = props;


  return (
    <>
      <Image 
      
      />
    </>
  );
}

const styles = StyleSheet.create({
  albumContainer: {
    height: 'auto',
    width: '100%'
  },
  albumAssetsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: '32%',
    height: 100,
  },
})