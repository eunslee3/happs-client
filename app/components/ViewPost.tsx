import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';
import uploadStore from '@/store/uploadStore';

export default function ViewPost() {


  return (
    <SafeAreaView style={styles.container}>
      {/* <Image 
        // source={{ uri: post.mediaUrls[0].url, cache: "reload" }} 
      /> */}
      <Text>View Post Page</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
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
