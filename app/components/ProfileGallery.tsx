import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable, Animated  } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUserPosts } from '@/api/posts/getUserPosts';

export default function ProfileGallery({
  user
}:
{
  user: any
}) {

  const { data: postsData } = useQuery({
    queryKey: ['userPosts'],
    queryFn: async () => await getUserPosts(user.id),
    refetchOnWindowFocus: false
  })

  console.log('user: ', user)
  console.log('userPosts: ', postsData)

  return (
    <View style={styles.container}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
