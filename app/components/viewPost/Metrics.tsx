import { StyleSheet, View, Pressable, ScrollView, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation } from '@tanstack/react-query';
import { likePost } from '@/api/posts/likePost';
import userStore from '@/store/userStore';

export default function Metrics({ selectedPost, likes }: { selectedPost: any, likes: number }) {
  const { user } = userStore();
  const [isLiked, setIsLiked] = useState(false);
  const [amtOfLikes, setAmtOfLikes] = useState(likes);
  const numberOfInteractions = (number: number) => {
    if (number > 1000 && number < 100000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    if (number > 100000 && number < 1000000) {
      return `${Math.trunc(number / 1000)}k`
    }
    if (number > 1000000) {
      return `${Math.trunc(number / 1000000)}m`
    }

    return number;
  }

  const mutation = useMutation({
    mutationFn: () => likePost(user.id, selectedPost.id),
    onSuccess: () => {
      console.log('Post liked successfully');
    },
    onError: (error) => {
      console.error('Failed to like post:', error);
    },
  });

  const handleLikePost = () => {
    setIsLiked(!isLiked);
    setAmtOfLikes(isLiked ? amtOfLikes - 1 : amtOfLikes + 1);
    mutation.mutate();
  }

  useEffect(() => {
    const didUserLike = selectedPost.like.some((el: any) => el.userId === user.id);
    setIsLiked(didUserLike);
  }, [])

  console.log('isLiked: ', isLiked)

  return (
    <View style={styles.metricsContainer}>
    <Pressable onPress={() => handleLikePost()} style={styles.blurContainer}>
      <BlurView intensity={100} style={styles.metrics}>
        <AntDesign name="heart" size={17} color={isLiked ? "red" : "white"} />
        <Text style={styles.metricsText}>
          {numberOfInteractions(amtOfLikes)}
          </Text>
      </BlurView>
    </Pressable>
    <Pressable style={styles.blurContainer}>
      <BlurView intensity={100} style={styles.metrics}>
        <MaterialCommunityIcons name="comment-processing" size={17} color="white" />
        <Text style={styles.metricsText}>
          {numberOfInteractions(amtOfLikes)}
        </Text>
      </BlurView>
    </Pressable>
  </View>
  );
}

const styles = StyleSheet.create({
  metricsContainer: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  blurContainer: {
    height: 40,
    width: 73,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden'
  },
  metrics: {
    width: 73,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  metricsText: {
    marginLeft: 5,
    color: 'white'
  }
});
