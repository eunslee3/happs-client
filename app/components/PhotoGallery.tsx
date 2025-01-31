import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, Animated  } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import GalleryItem from './GalleryItem';
import PreviewAsset from './PreviewAsset';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function PhotoGallery() {
  const [assets, setAssets] = useState<any[]>([]);
  const [after, setAfter] = useState<string | null>(null); // Store after token
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();
  const [scrollY] = useState(new Animated.Value(0));
  const [currentHeight, setCurrentHeight] = useState<number>(0)
  const heightBeforeScroll = screenHeight * 0.5;
  const heightAfterScroll = 0;
  const playerRef = useRef<any>(null); // To directly control the player

  const handleNavigate = () => {
    // Video continues to play after navigation. Have to manually pause it.
    const player = playerRef.current;
    if (player) {
      player.pause();
    }
    router.push({
      pathname: '../(tabs)/CreatePost',
      params: {
        selectedAsset: JSON.stringify(selectedAsset)
      }
    })
  }

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

  const handleItemPress = (item: any) => {
    setSelectedAsset(item);
    setCurrentHeight(0);
    setShowPreview(false);
  }

  useEffect(() => {
    setShowPreview(true);
  }, [showPreview])

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

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      // Track the animated value as a regular number
      setCurrentHeight(value);
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View
        style={styles.previewContainer}>
        <View style={styles.previewHeaderContainer}>
          <Pressable style={styles.left} onPress={() => router.back()}>
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
          <Text style={[styles.center, { color: 'white', fontSize: 18 }]}>New Post</Text>
          <Pressable style={styles.right} onPress={handleNavigate}>
            <Text style={{ color: '#00DCB7', fontSize: 18, textAlign: 'right', paddingRight: 10 }}>Add</Text>
          </Pressable>
        </View>
        <Animated.View 
          style={[styles.assetPreviewContainer, {
            height: (currentHeight < 1 ? heightBeforeScroll : heightAfterScroll), // Dynamically change the height as user scrolls
          }]}>
          {selectedAsset && showPreview && currentHeight < 1? 
            <PreviewAsset
              selectedAsset={selectedAsset}
              playerRef={playerRef}
            /> 
            : 
            null
          }
        </Animated.View>
      </View>
      {assets.length > 0 ? (
        <AnimatedFlatList
          data={assets}
          keyExtractor={(item: any) => item.id}
          numColumns={4} // 3 items per row
          renderItem={({ item }: { item: any }) => (
            <GalleryItem uri={item.uri} item={item} callBack={handleItemPress}/>
          )}
          onEndReached={fetchMoreAssets}  // Fetch more assets when reaching the end
          onEndReachedThreshold={0.1}  // Trigger fetch when user is near the bottom
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
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
  assetPreviewContainer: {
    // flex: 1,
    width: '100%',
  }
});
