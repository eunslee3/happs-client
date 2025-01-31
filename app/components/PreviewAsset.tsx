import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

interface PreviewAssetProps {
  selectedAsset: any;
  playerRef: any;
}

export default function PreviewAsset(props: PreviewAssetProps) {
  const { selectedAsset, playerRef } = props;
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [playerKey, setPlayerKey] = useState<number>(0); // Player key to force re-render


  // Function to copy the asset to a temporary file location
  const copyAssetToTempFile = async (uri: string) => {
    try {
      // Come back to this:
      // File URI does not change unless we hide then show the component again
      // Goal: Change the file URI without having to re-render this whole component
      const fileUri = FileSystem.documentDirectory + `temp_video.mp4`; // Path for temporary file
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (fileExists.exists) {
        // Delete the existing file
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }

      // Now copy the asset to the temp file
      await FileSystem.copyAsync({
        from: uri,
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
      player.play();
      playerRef.current = player; // Save the player instance in the ref
    }
  });

  return (
    <View style={styles.container}>
      {selectedAsset?.mediaType === 'photo' ? (
        <Image source={{ uri: selectedAsset.uri }} style={styles.image} />
      ) : (
        videoSource && (
          <VideoView
            key={playerKey} // Force re-render with the key
            style={styles.video} 
            player={player}
            contentFit="cover"
          />
        )
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
