import { StyleSheet, ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from './viewPost/ViewVideo';
import PostDetail from './viewPost/PostDetails';
import Metrics from './viewPost/Metrics';
import ViewImage from './viewPost/ViewImage';

export default function ViewPost() {
  const { selectedPost } = postStore();
  const [currentPage, setCurrentPage] = useState(0);

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
            <Metrics selectedPost={selectedPost} />
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
            <Metrics selectedPost={selectedPost} />
          </View>
        );
      }
      return null;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pagerWrapper}>
        <PagerView 
          style={styles.pagerContainer} 
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {selectedPost ? renderMedia() : null}
        </PagerView>
      </View>
      <PostDetail user={selectedPost.user} post={selectedPost} />
    </ScrollView>
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
