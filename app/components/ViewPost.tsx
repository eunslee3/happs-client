import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform, findNodeHandle } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from './viewPost/ViewVideo';
import PostDetail from './viewPost/PostDetails';
import Metrics from './viewPost/Metrics';
import ViewImage from './viewPost/ViewImage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ViewPost() {
  const { selectedPost } = postStore();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = new QueryClient();
  const scrollViewRef = useRef<ScrollView>(null);
  const commentRef = useRef<View>(null)

  const renderMedia = () => {
    const allMedia = selectedPost.mediaUrls;

    return allMedia.map((media: any, idx: number) => {
      if (media.type === 'video') {
        return (
          <View key={idx} style={styles.mediaContainer}>
            <ViewVideo
              videoSource={media.url}
              selectedPost={selectedPost}
              currentPage={currentPage}
              idx={idx}
            />
          </View>
        );
      } else if (media.type === 'image') {
        return (
          <View key={idx} style={styles.mediaContainer}>
            <ViewImage
              idx={idx}
              imageUrl={media.url}
              selectedPost={selectedPost}
              currentPage={currentPage}
            />
          </View>
        );
      }
      return null;
    });
  };

  const scrollToTarget = () => {
    commentRef.current?.measure((x, y, width, height, pageX, pageY) => {
      scrollViewRef.current?.scrollTo({ y: pageY, animated: true });
    });
  };
  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
      <GestureHandlerRootView style={styles.container}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
          <View style={styles.pagerWrapper}>
            <PagerView 
              style={styles.pagerContainer} 
              initialPage={0}
              onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
              {selectedPost ? renderMedia() : null}
            </PagerView>
            <Metrics selectedPost={selectedPost} likes={selectedPost?.likes} scrollToTarget={scrollToTarget} />
          </View>
          <PostDetail user={selectedPost.user} post={selectedPost} commentRef={commentRef} />
        </ScrollView>
      </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    flexDirection: 'column',
  },
  pagerWrapper: {
    height: 600,
    width: "100%",
  },
  pagerContainer: {
    flex: 1,
  },
  mediaContainer: {
    width: "100%",
    height: "100%",
  },
  bottomSheet: {
    flex: 1,
    zIndex: 10000,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  }
});
