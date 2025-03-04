import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import postStore from '@/store/postStore';

export default function PostDetail({ user, post }: { user: any, post: any }) {
  console.log({
    post,
    user
  })
  return (
    <View style={styles.detailsContainer}>

    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    width: '100%',
  }
});
