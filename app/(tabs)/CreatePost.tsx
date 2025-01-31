import { View, Image, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { getAllPosts } from '@/api/posts/getAllPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';

export default function HomeScreen() {
  const [assets, setAssets] = useState<any>([]);
  const router = useRouter();
  const { selectedAsset } = useLocalSearchParams<{ selectedAsset: any }>();

  useEffect(() => {
    if (selectedAsset?.id) {
      setAssets((prevState: any) => ([...prevState, selectedAsset]))
    }
  }, [selectedAsset])

  console.log(selectedAsset)


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backIcon} onPress={() => {router.back()}}>
          <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="black" />
        </Pressable>
        <Text style={styles.header}>Create Post</Text>
        <View style={styles.emptySpace} />
      </View>
      <ScrollView style={styles.assetsContainer} horizontal={true}>
        <Pressable style={styles.addAsset} onPress={() => router.push('../components/PhotoGallery')}>
          <Image source={require('../../assets/images/create-post-camera.png')} />
          <Text style={{ fontSize: 14, marginVertical: 5 }}>Add More</Text>
          <Text style={{ color: '#7E8184' }}>{`${assets.length}/10`}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  }, 
  headerContainer: {
    height: 'auto',
    width: '100%',
    flexDirection: "row",
    alignItems: 'center'
    // borderWidth: 1
  },
  backIcon: {
    flex: 1
  },
  header: {
    fontFamily: "Poppins-Medium",
    fontSize: 24,
    fontWeight: 'medium',
    padding: 10
  },
  emptySpace: {
    flex: 1
  },
  assetsContainer: {
    maxHeight: 200,
    width: '100%',
    marginTop: 10
  },
  addAsset: {
    height: 200,
    minWidth: 150,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderRadius: 25,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1796FF'
  }
});
