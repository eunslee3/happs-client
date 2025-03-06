import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
export default function ViewVideo(
  { videoSource, idx, selectedPost, currentPage }: 
  { videoSource: any, idx: number, selectedPost: any, currentPage: number }
) {
  const player = useVideoPlayer(videoSource, (player) => {
    if (player) {
      player.loop = true;
    }
  });
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.navContainer} onPress={() => router.back()}>
        <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="black" />
      </Pressable>
      <View style={styles.videoContainer}>
        <View style={styles.paginationContainer}>
          {selectedPost?.mediaUrls?.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  video: {
    height: '100%',
    width: '100%',
  },
  navContainer: {
    width: "100%",
    height: '15%',
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 30
  },
  paginationContainer: {
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
    height: 30
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
  },
  inactiveDot: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
  videoContainer: {
    height: '85%',
    width: '100%',
  }
});
