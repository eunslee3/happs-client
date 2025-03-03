import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { WebView } from "react-native-webview";
import { Image } from 'expo-image';

export default function PostCard({
  post
}: { post: any }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShouldRender(true), 1000); // 1-second delay
    return () => clearTimeout(timeout);
  }, [post]);

  console.log('postCard: ', post.mediaUrls[0].thumbnailUrl);
  
  if (post.mediaUrls[0].type === 'video' && shouldRender) {
    return (
      <View style={styles.postContainer}>
        <Octicons
          name="video"
          color='white'
          size={20} 
          source={require('../../../assets/images/video_icon.png')} 
          style={styles.videoIcon}
        />
        <Image 
          source={{ uri : post.mediaUrls[0].thumbnailUrl }} 
          style={styles.thumbnail}
          key={post.mediaUrls[0].thumbnailUrl} 
        />
      </View>
    );
  }

  return (
    <View style={styles.postContainer}>
      <Image source={{ uri : post.mediaUrls[0].url }} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
    maxWidth: '45%',
    height: 200,
    margin: 3
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 20
  },
  videoIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10, 
  }
});
