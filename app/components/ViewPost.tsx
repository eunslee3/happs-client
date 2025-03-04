import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from './viewPost/ViewVideo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

export default function ViewPost() {
  const { selectedPost } = postStore();
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const renderMedia = () => {
    const allMedia = selectedPost.mediaUrls;

    return allMedia.map((media: any, idx: number) => {
      if (media.type === 'video') {
        return (
          <ViewVideo
            key={idx} 
            videoSource={media.url}
            idx={idx}
          />
        );
      } else if (media.type === 'image') {
        return (
          <Image
            key={idx}
            source={{ uri: media.url }}
            style={styles.media}
            contentFit='cover'
          />
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.navContainer} onPress={() => router.back()}>
        <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="white" />
      </Pressable>
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
      <PagerView 
        style={styles.pagerContainer} 
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {selectedPost ? renderMedia() : null}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
  },
  navContainer: {
    position: 'absolute',
    width: "100%",
    height: 30,
    top: 50,
    zIndex: 1,
  },
  pagerContainer: {
    width: "100%",
    height: 600,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 0
  },
  media: {
    width: "100%",
    height: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
  },
  inactiveDot: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
  paginationContainer: {
    position: 'absolute',
    top: 50, // Adjust position above bottom edge
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 1,
    height: 30
  },
});
