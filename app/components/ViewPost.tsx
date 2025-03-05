import { StyleSheet, View, Pressable, ScrollView, Text } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from './viewPost/ViewVideo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import PostDetail from './viewPost/PostDetails';
import { BlurView } from 'expo-blur';

export default function ViewPost() {
  const { selectedPost } = postStore();
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  console.log('selected post', selectedPost)

  const renderMedia = () => {
    const allMedia = selectedPost.mediaUrls;

    return allMedia.map((media: any, idx: number) => {
      if (media.type === 'video') {
        return (
          <>
          <ViewVideo
            key={idx} 
            videoSource={media.url}
            idx={idx}
          />
          <View style={styles.metricsContainer}>
            <View style={styles.blurContainer}>
              <BlurView intensity={100} style={styles.metrics}>
                <AntDesign name="heart" size={17} color="white" />
                <Text style={styles.metricsText}>{selectedPost.likes}</Text>
              </BlurView>
            </View>
            <View style={styles.blurContainer}>
              <BlurView intensity={100} style={styles.metrics}>
                <MaterialCommunityIcons name="comment-processing" size={17} color="white" />
                <Text style={styles.metricsText}>
                  {selectedPost.Comments?.length ? selectedPost.Comments.length : 0}
                </Text>
              </BlurView>
            </View>
          </View>
          </>
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
    <ScrollView contentContainerStyle={styles.container}>
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
      <PostDetail user={selectedPost.user} post={selectedPost} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
    flexDirection: 'column',
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
    height: '70%',
    padding: 0,
    margin: 0
  },
  media: {
    width: "100%",
    height: "100%",
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
  paginationContainer: {
    position: 'absolute',
    top: 57,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
    height: 30
  },
  metricsContainer: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  blurContainer: {
    height: 40,
    width: 73,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden'
  },
  metrics: {
    width: 73,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  metricsText: {
    marginLeft: 5,
    color: 'white'
  }
});
