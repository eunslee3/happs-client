import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';

interface AlbumEntryProps {
  album: any;  // Typing the album prop here
}

export default function AlbumEntry (props: AlbumEntryProps) {
  const { album } = props;  // Destructuring the album prop
  const [assets, setAssets] = useState<any>([]);

  useEffect(() => {
    async function getAlbumAssets() {
      // Get all assets (images and videos) from the media library
      const fetchedAssets = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video], // Fetch both photos and videos
        first: 100,  // You can adjust this value to get more or fewer assets
      });
      setAssets(fetchedAssets.assets);
      fetchedAssets.assets.forEach((asset) => {
        console.log(asset);  // Example of logging the URI of each asset in the console.

      })
    }
    getAlbumAssets();
  }, []);



  return (
    <View key={album.id} style={styles.albumContainer}>
      <View style={styles.albumAssetsContainer}>
        {assets && assets.map((asset: any) => {
          if (asset.mediaType === 'photo' || asset.mediaType === 'image') {
            return (
              <Image contentFit='cover' source={asset.uri} style={styles.image} />
            )
          }
        })}
      </View>
    </View>
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