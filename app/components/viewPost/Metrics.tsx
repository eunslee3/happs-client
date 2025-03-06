import { StyleSheet, View, Pressable, ScrollView, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Metrics({ selectedPost }: { selectedPost: any }) {

  return (
    <View style={styles.metricsContainer}>
    <Pressable style={styles.blurContainer}>
      <BlurView intensity={100} style={styles.metrics}>
        <AntDesign name="heart" size={17} color="white" />
        <Text style={styles.metricsText}>{selectedPost.likes}</Text>
      </BlurView>
    </Pressable>
    <Pressable style={styles.blurContainer}>
      <BlurView intensity={100} style={styles.metrics}>
        <MaterialCommunityIcons name="comment-processing" size={17} color="white" />
        <Text style={styles.metricsText}>
          {selectedPost.Comments?.length ? selectedPost.Comments.length : 0}
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
