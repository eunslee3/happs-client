import { StyleSheet, Text, View, Button, Pressable, Image, NativeModules } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { createThumbnail } from "react-native-create-thumbnail";

export default function PostCard(
  post: any
) {
  const postData = post.post;
  const isImg = postData.mediaUrls[0].includes('JPG');

  if (isImg) {
    return (
      <View style={styles.postContainer}>
        <Image source={{ uri: postData.mediaUrls[0] }} style={{ width: '100%', height: '100%' }} />
      </View>
    )
  }

  if (postData.mediaUrls[0].includes('MOV')) {
    return (
      <View style={styles.postContainer}>
        {/* <Image source={{ uri : image }} style={{ width: '100%', height: '100%' }} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '45%',
    maxWidth: '45%',
    height: 200,
    borderWidth: 1,
    margin: 3,
    borderRadius: 20
  }
});
