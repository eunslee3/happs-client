import { StyleSheet, View, Pressable, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
export default function ViewImage(
  { imageUrl, idx, selectedPost, currentPage }: 
  { imageUrl: string, idx: number, selectedPost: any, currentPage: number }
) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.navContainer} onPress={() => router.back()}>
        <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="white" />
      </Pressable>
        <View style={styles.paginationContainer}>
          {selectedPost?.mediaUrls?.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <Image
          key={idx}
          source={{ uri: imageUrl }}
          style={styles.media}
          contentFit='cover'
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  media: {
    width: "100%",
    height: "100%",
  },
  navContainer: {
    position: 'absolute',
    width: "100%",
    height: 30,
    top: 50,
    zIndex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    top: 57,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
    height: 30
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
  },
  inactiveDot: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
});
