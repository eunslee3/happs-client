import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, Animated  } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import GalleryItem from './GalleryItem';
import PreviewAsset from './PreviewAsset';
import assetsStore from '@/store/assetStore';
import { useLocalSearchParams } from 'expo-router';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function PhotoGallery() {
  const [assets, setAssets] = useState<any[]>([]);
  const [after, setAfter] = useState<string | null>(null); // Store after token
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const router = useRouter();
  const [scrollY] = useState(new Animated.Value(0));
  const previewContainerHeight = screenHeight * 0.5;
  const playerRef = useRef<any>(null); // To directly control the player
  const { setSelectedAsset, selectedAsset } = assetsStore();
  const { path } = useLocalSearchParams();

  const handleNavigate = () => {
    // Video continues to play after navigation. Have to manually pause it.
    const player = playerRef.current;
    if (player) {
      player.pause();
    }

    if (path === 'CreatePost') {
      router.push({
        pathname: '../(tabs)/CreatePost',
      })
    }
    if (path === 'Profile') {
      router.push({
        pathname: '../(tabs)/Profile',
      })
    }
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
    setShowPreview(false);
  }

  useEffect(() => {
    if (showPreview === false) {
      setShowPreview(true);
    }
  }, [showPreview])

  useEffect(() => {
    const getAssets = async () => {
      if (!permissionResponse || permissionResponse.status !== 'granted') {
        await requestPermission();
      }
      let fetchedAssets;
      if (path === 'Profile') {
        fetchedAssets = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo],
          first: 100,
        });
      } else {
        fetchedAssets = await MediaLibrary.getAssetsAsync({
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          first: 100,
        });
      }
      if (fetchedAssets) {
        setAfter(fetchedAssets.endCursor);
        setAssets(fetchedAssets.assets);
        setSelectedAsset(fetchedAssets.assets[0]);
      }
    };
    getAssets();
  }, [permissionResponse]);

  const handleNavigateBack = () => {
    setSelectedAsset([]);
    router.back();
  }

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View
        style={styles.previewContainer}>
        <View style={styles.previewHeaderContainer}>
          <Pressable style={styles.left} onPress={handleNavigateBack}>
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
          <Text style={[styles.center, { color: 'white', fontSize: 18 }]}>New Post</Text>
          <Pressable style={styles.right} onPress={handleNavigate}>
            <Text style={{ color: '#00DCB7', fontSize: 18, textAlign: 'right', paddingRight: 10 }}>Add</Text>
          </Pressable>
        </View>
        <View style={[styles.assetPreviewContainer, { height: previewContainerHeight }]}>
          {selectedAsset && showPreview ? 
            <PreviewAsset
              selectedAsset={selectedAsset}
              playerRef={playerRef}
            />
            : 
            null
          }
        </View>
      </View>
      {assets.length > 0 ? (
        <AnimatedFlatList
          data={assets}
          keyExtractor={(item: any) => item.id}
          numColumns={4}
          renderItem={({ item }: { item: any }) => (
            <GalleryItem uri={item.uri} mediaType={item.mediaType} item={item} callBack={handleItemPress}/>
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
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
