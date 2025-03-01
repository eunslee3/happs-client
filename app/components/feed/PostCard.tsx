import { StyleSheet, Text, View, Button, Pressable, Image, NativeModules } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Octicons from '@expo/vector-icons/Octicons';

export default function PostCard({
  post
}: { post: any }) {
  
  if (post.mediaUrls[0].type === 'video') {
    return (
      <View style={styles.postContainer}>
        <Octicons
          name="video"
          color='white'
          size={20} 
          source={require('../../../assets/images/video_icon.png')} 
          style={styles.videoIcon}
        />
        <Image source={{ uri : post.mediaUrls[0].thumbnailUrl }} style={styles.thumbnail} />
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
