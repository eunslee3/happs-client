import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface PreviewAssetProps {
  selectedAsset: any;
  playerRef: any;
}

export default function PreviewAsset(props: PreviewAssetProps) {
  const { selectedAsset, playerRef } = props;
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [playerKey, setPlayerKey] = useState<number>(0); // Player key to force re-render


  const copyAssetToTempFile = async (uri: string) => {
    try {
      let fromUri = uri;
      // If the URI is a photo library asset (ph://...), extract its ID and get a local URI
      if (uri.startsWith('ph://')) {
        // Extract asset id from URI; e.g., "ph://812A4B3A-089D-49FD-9331-37E590304413/L0/001" becomes "812A4B3A-089D-49FD-9331-37E590304413"
        const assetId = uri.split('ph://')[1].split('/')[0];
        const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);
        if (assetInfo && assetInfo.localUri) {
          fromUri = assetInfo.localUri;
        }
      }
      
      // Generate a unique temp file name using a timestamp
      const fileUri = FileSystem.documentDirectory + `temp_video_${Date.now()}.mp4`;
  
      // Now copy the asset to the temp file
      await FileSystem.copyAsync({
        from: fromUri,
        to: fileUri,
      });
  
      return fileUri;
    } catch (error) {
      console.error('Error copying asset to temp file:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedAsset?.uri) {
      if (selectedAsset?.mediaType === 'video') {
        // For videos, copy the asset to a temp location
        copyAssetToTempFile(selectedAsset.uri).then((tempUri) => {
          // NOTE:
          // Temp URI does not change dynamically. Need to look into this
          if (tempUri) {
            setVideoSource(tempUri); // Use the file URI
            setPlayerKey((prevKey) => prevKey + 1); // Force player re-render
          }
        });
      } else {
        setVideoSource(selectedAsset.uri); // For photos, use the URI directly
      }
    }
  }, [selectedAsset]); // Re-run effect when selectedAsset changes

  const player = useVideoPlayer(videoSource, (player) => {
    if (player) {
      player.loop = true;
      player.pause();
      playerRef.current = player; // Save the player instance in the ref
    }
  });

  return (
    <View style={styles.container}>
      {selectedAsset?.mediaType === 'photo' ? (
        selectedAsset.uri ? <Image source={{ uri: selectedAsset.uri }} style={styles.image} /> : <Text style={{ color: 'white', fontSize: 16 }}>Loading...</Text>
      ) : (
        videoSource ? (
          <VideoView
            key={playerKey} // Force re-render with the key
            style={styles.video} 
            player={player}
            contentFit="cover"
          />
        )
        :
        <Text style={{ color: 'white', fontSize: 16 }}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    width: 350,
    height: '100%',
  },
  video: {
    width: 350,
    height: '100%',
  }
});
