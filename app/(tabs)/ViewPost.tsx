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
import { useRouter } from 'expo-router';

export default function ViewPost() {
  const { selectedPost, setPosts, posts } = postStore();
  const { user } = userStore();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = new QueryClient();
  const scrollViewRef = useRef<ScrollView>(null);
  const commentRef = useRef<View>(null);
  const tapCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const router = useRouter();

  const handleRouterBack = () => {
    setIsLiked(false);
    setLikes(0);
    router.back();
  }

  // Immediately update UI and fire mutation
  const handleLikePost = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    mutation.mutate();
    const { id: postId } = selectedPost;
    const likedPost = { 
      ...selectedPost, 
      like: [
        ...selectedPost.like,
        {
          postId,
          userId: user.id
        }
      ],
      likes: !isLiked ? selectedPost.likes + 1 : selectedPost.likes === 0 ? 0 : selectedPost.likes - 1
    }
    const filterPosts = posts.filter((post) => post.id !== postId)
    setPosts([...filterPosts, likedPost])
  }

  // Custom tap event handler - like/unlike a post
  const handleTap = () => {
    tapCount.current += 1;
    if (tapCount.current === 2) {
      handleLikePost();
      tapCount.current = 0; // Reset tap count
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      // Set tapCount back to 0 if user taps once and timeout is fulfilled
      timeoutRef.current = setTimeout(() => {
        tapCount.current = 0;
      }, 300);
    }
  };

  console.log(selectedPost)

  const mutation = useMutation({
    mutationFn: () => likePost(user.id, selectedPost.id),
    onError: (error) => {
      console.error('Failed to like post:', error);
    },
  });

  // On first render, determine if user has liked the post or not - update UI accordingly
  useEffect(() => {
    const didUserLike = selectedPost.like.some((el: any) => el.userId === user.id);
    setIsLiked(didUserLike);
    setLikes(selectedPost.likes)
  }, [selectedPost])

  const renderMedia = () => {
    return selectedPost.mediaUrls.map((media: any, idx: number) => {
      return (
        <View key={idx} style={styles.mediaContainer}>
          {media.type === 'video' ? (
            <ViewVideo 
              key={idx} 
              videoSource={media.url} 
              selectedPost={selectedPost} 
              currentPage={currentPage} 
              idx={idx}
              handleTap={handleTap}
              handleRouterBack={handleRouterBack}
            />
          ) : (
            <ViewImage 
              key={idx} 
              idx={idx} 
              imageUrl={media.url} 
              selectedPost={selectedPost} 
              currentPage={currentPage}
              handleTap={handleTap}
              handleRouterBack={handleRouterBack}
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
