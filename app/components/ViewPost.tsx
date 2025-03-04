import { StyleSheet, View, SafeAreaView, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import postStore from '@/store/postStore';
import PagerView from 'react-native-pager-view';
import ViewVideo from './viewPost/ViewVideo';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ViewPost() {
  const { selectedPost } = postStore();

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
    // Option 1: Wrap with SafeAreaView if you need to respect safe areas
    // <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <View>
        <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="black" />
      </View>
      <PagerView style={styles.pagerContainer} initialPage={0}>
        {selectedPost ? renderMedia() : null}
      </PagerView>
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "white",
  },
  containerOfPager: {
    borderWidth: 10,
    borderColor: 'green',
    margin: 0,
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
});
