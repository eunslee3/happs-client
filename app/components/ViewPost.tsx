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
import Metrics from './viewPost/Metrics';
import ViewImage from './viewPost/ViewImage';

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
            selectedPost={selectedPost}
            currentPage={currentPage}
            idx={idx}
          />
          <Metrics selectedPost={selectedPost}/>
          </>
        );
      } else if (media.type === 'image') {
        return (
          <>
          <ViewImage
            key={idx}
            idx={idx}
            imageUrl={media.url}
            selectedPost={selectedPost}
            currentPage={currentPage}
          />
          <Metrics selectedPost={selectedPost}/>
          </>
        );
      }
      return null;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});
