import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

interface PreviewAssetProps {
  selectedAsset: any;
}

export default function PreviewAsset(props: PreviewAssetProps) {
  const { selectedAsset } = props;
  const [videoSource, setVideoSource] = useState<string | null>(null);

  // Function to copy the asset to a temporary file location
  const copyAssetToTempFile = async (uri: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'temp_video.mp4'; // Path for temporary file

      // Check if the file already exists
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (fileExists.exists) {
        // Delete the existing file
        await FileSystem.deleteAsync(fileUri);
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
          if (tempUri) {
            setVideoSource(tempUri); // Use the file URI
          }
        });
      } else {
        setVideoSource(selectedAsset.uri); // For photos, use the URI directly
      }
    }
  }, [selectedAsset]);

  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      {selectedAsset?.mediaType === 'photo' ? (
        <Image source={{ uri: selectedAsset.uri }} style={styles.image} />
      ) : (
        videoSource && (
          <VideoView style={styles.video} player={player} />
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
  },
  image: {
    width: 350,
    height: 275,
  },
  video: {
    width: 350,
    height: 275,
  },
});
