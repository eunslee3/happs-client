import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

import PreviewAsset from './PreviewAsset';

export default function PhotoGallery() {
  const [assets, setAssets] = useState<any[]>([]);
  const [after, setAfter] = useState<string | null>(null); // Store after token
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();

  const fetchMoreAssets = async () => {
    if (after) {
      const fetchedAssets = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        first: 100,  // Load the next 100 assets
        after: after, // Pass the after token to paginate
      });

      // Update the assets and set the new after token
      setAssets((prevAssets) => [...prevAssets, ...fetchedAssets.assets]);
      setAfter(fetchedAssets.endCursor); // Update after for further pagination
    }
  };

  useEffect(() => {
    async function getAssets() {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      // Get all assets (images and videos) from the media library
      const fetchedAssets = await MediaLibrary.getAssetsAsync({
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video], // Fetch both photos and videos
        first: 100  // You can adjust this value to get more or fewer assets
      });
      setAfter(fetchedAssets.endCursor);
      setAssets(fetchedAssets.assets);
      await setSelectedAsset(fetchedAssets.assets[0]);
    }
    
    getAssets();
  }, [permissionResponse]);

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={[{ height: screenHeight * .7 }, styles.previewContainer]}>
        <View style={styles.previewHeaderContainer}>
          <Pressable style={styles.left} onPress={() => router.back()}>
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
          <Text style={[styles.center, { color: 'white', fontSize: 18 }]}>New Post</Text>
          <Pressable style={styles.right}>
            <Text style={{ color: '#00DCB7', fontSize: 18, textAlign: 'right', paddingRight: 10 }}>Continue</Text>
          </Pressable>
        </View>
        {selectedAsset?.uri ? 
          <PreviewAsset selectedAsset={selectedAsset} />
          :
          null
        }

      </View>
      {assets.length > 0 ? (
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          numColumns={4} // 3 items per row
          renderItem={({ item }) => (
            <Image source={item.uri} style={styles.image} />
          )}
          onEndReached={fetchMoreAssets}  // Fetch more assets when reaching the end
          onEndReachedThreshold={0.1}  // Trigger fetch when user is near the bottom
        />
      ) : (
        <Text>No assets available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: '#1B1B1B'
  },
  center: {
    flex: 2, // Allow the center item to take up more space in the middle
    textAlign: 'center',
  },
  right: {
    flex: 1, // Make sure the right item takes available space
    textAlign: 'right',
  },
  left: {
    flex: 1, // Make sure the left item takes available space
    textAlign: 'left',
    paddingLeft: 10
  },
  previewHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 80
  },
  flatList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: '25%',  // Ensure 4 images per row
    height: 100,
    borderWidth: 1
  },
});
