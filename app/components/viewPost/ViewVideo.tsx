import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function ViewVideo({ videoSource, idx }: { videoSource: any, idx: number }) {
  const player = useVideoPlayer(videoSource, (player) => {
    if (player) {
      player.loop = true;
    }
  });

  return (
    <>
      <VideoView
        key={idx}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </>
  );
}

const styles = StyleSheet.create({
  video: {
    height: '100%',
    width: '100%',
    borderWidth: 3,
    borderColor: 'green'
  }
});
