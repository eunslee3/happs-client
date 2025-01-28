import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import AlbumEntry from './AlbumEntry';
import { Image } from 'expo-image';

export default function PhotoGallery() {
  const [albums, setAlbums] = useState<any>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [assets, setAssets] = useState<any>([]);

  async function getAlbums() {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }
  
  useEffect(() => {
    getAlbums();
  }, [permissionResponse])

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
  


  if (!permissionResponse) {
    return (
      <View style={styles.container}>
        <Text>No permission to access media library.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.imageContainer}>
        {/* {albums && albums.map((album: any) => (<AlbumEntry key={album.id} album={album} />))} */}
{assets && assets.map((asset: any) => {
          if (asset.mediaType === 'photo' || asset.mediaType === 'image') {
            return (
              <Image contentFit='cover' source={asset.uri} style={styles.image} />
            )
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    margin: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '32%',
    height: 100,
  },
});
