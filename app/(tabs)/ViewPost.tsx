import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from '../components/viewPost/ViewVideo';
import PostDetail from '../components/viewPost/PostDetails';
import Metrics from '../components/viewPost/Metrics';
import ViewImage from '../components/viewPost/ViewImage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { likePost } from '@/api/posts/likePost';
import userStore from '@/store/userStore';

export default function ViewPost() {
  const { selectedPost } = postStore();
  const { user } = userStore();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = new QueryClient();
  const scrollViewRef = useRef<ScrollView>(null);
  const commentRef = useRef<View>(null);
  const tapCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<number>(selectedPost.likes || 0);

  const handleLikePost = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    mutation.mutate();
  }

  const handleTap = () => {
    tapCount.current += 1;

    if (tapCount.current === 2) {
      handleLikePost();
      tapCount.current = 0; // Reset tap count
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      timeoutRef.current = setTimeout(() => {
        console.log('Single tap')
        tapCount.current = 0;
      }, 300);
    }
  };

  const mutation = useMutation({
    mutationFn: () => likePost(user.id, selectedPost.id),
    onSuccess: () => {
      console.log('like api called successfully');
    },
    onError: (error) => {
      console.error('Failed to like post:', error);
    },
  });

  useEffect(() => {
    const didUserLike = selectedPost.like.some((el: any) => el.userId === user.id);
    setIsLiked(didUserLike);
  }, [])

  console.log(tapCount)

  const renderMedia = () => {
    return selectedPost.mediaUrls.map((media: any, idx: number) => {
      return (
        <View style={styles.mediaContainer}>
          {media.type === 'video' ? (
            <ViewVideo 
              key={idx} 
              videoSource={media.url} 
              selectedPost={selectedPost} 
              currentPage={currentPage} 
              idx={idx}
              handleTap={handleTap}
            />
          ) : (
            <ViewImage 
              key={idx} 
              idx={idx} 
              imageUrl={media.url} 
              selectedPost={selectedPost} 
              currentPage={currentPage}
              handleTap={handleTap}
            />
          )}
        </View>
      );
    });
  };

  const scrollToTarget = () => {
    commentRef.current?.measure((x, y, width, height, pageX, pageY) => {
      scrollViewRef.current?.scrollTo({ y: pageY, animated: true });
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
          <View style={styles.pagerWrapper}>
            <PagerView style={styles.pagerContainer} initialPage={0} onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
              {selectedPost ? renderMedia() : null}
            </PagerView>
            <Metrics 
              selectedPost={selectedPost} 
              likes={likes} 
              handleLikePost={handleLikePost} 
              scrollToTarget={scrollToTarget}
              isLiked={isLiked}
            />
          </View>
          <PostDetail user={selectedPost.user} post={selectedPost} commentRef={commentRef} />
        </ScrollView>
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
  }
});
