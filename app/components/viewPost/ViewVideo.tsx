import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function ViewVideo({ videoSource, idx }: { videoSource: any, idx: number }) {
  const player = useVideoPlayer(videoSource, (player) => {
    if (player) {
      player.loop = true;
    }
  });

  return (
    <View style={styles.videoContainer}>
      <VideoView
        key={idx}
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        allowsVideoFrameAnalysis={false}
        contentFit={'cover'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    height: '100%',
    width: '100%'
  },
  video: {
    height: '100%',
    width: '100%',
  }
});
