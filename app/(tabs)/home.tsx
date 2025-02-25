import { ActivityIndicator, View, Image, StyleSheet, Platform, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { getAllPosts } from '@/api/posts/getAllPosts';
import Ionicons from '@expo/vector-icons/Ionicons';
import uploadStore from '@/store/uploadStore';
import * as FileSystem from 'expo-file-system';
import { getPresignedUrlApi } from '@/api/posts/getPresignedUrlApi';
import { createPost } from '@/api/posts/createPost';
import userStore from '@/store/userStore';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const { 
    submittedForm, 
    fileObjs, 
    clearFileObjs, 
    clearSubmittedForm, 
    // isUploading, 
    // setIsUploading 
  } = uploadStore();
  const { user } = userStore();
  const isUploading = useRef(false);

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const response = await getPresignedUrlApi(fileName, fileType);
    return response
  }

  const uploadToS3 = async (fileObj: any, presignedUrl: any) => {
    try {
      const response = await FileSystem.uploadAsync(presignedUrl, fileObj.localUri, {
        httpMethod: 'PUT',
        headers: { 'Content-Type': fileObj.fileType },
        sessionType: FileSystem.FileSystemSessionType.FOREGROUND
      });
      if (response.status !== 200) throw new Error('Upload failed');
      return presignedUrl.split('?')[0];
    } catch (err) {
      console.error('Upload Error:', err);
      throw err;
    }
  }

  const handleGetAllPosts = () => {
    const response = getAllPosts();
    // console.log('wtf ru', response)
  }

  const handleUploadFiles = async () => {
    if (isUploading.current) return; // Prevent duplicate uploads
    isUploading.current = true;
    try {
      // setIsUploading(true);

      // This contains the presigned urls and also the file keys that are linked to that url
      const presignedObjs = await Promise.all(fileObjs.map((file: any) => getPresignedUrl(file.fileName, file.fileType)))

      // Upload assets using the presignedUrl - then clean the urls to always have access to that asset
      const cleanUrls = await Promise.allSettled(
        presignedObjs.map((presignedObj: any, idx: number) => 
          uploadToS3(fileObjs[idx], presignedObj.presignedUrl)
        )
      );
      const successfulUrls = cleanUrls
        .filter((result) => result.status === 'fulfilled') // Keep only successful uploads
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      // Identifiers for the uploaded files - need to keep track of file keys in order to delete files  
      const fileKeys = presignedObjs.map((presignedObj: any) => presignedObj.fileKey);
      await createPost(user.id, submittedForm, successfulUrls, fileKeys);
      clearFileObjs();
      clearSubmittedForm();
    } catch (err) {
      console.error('Upload Error:', err);
      throw err;
    } finally {
      // setIsUploading(false);
      isUploading.current = false; // Reset after completion
    }
  }

  useEffect(() => {
    if (fileObjs.length > 0 && !isUploading.current) {
      handleUploadFiles(); // This is saving the content twice.
    }
  }, [fileObjs, isUploading]);

  console.log('is uploading? ', fileObjs)

  useEffect(() => {
    handleGetAllPosts()
  }, [])

  const handleToggleActiveTab = (tab: 'All' | 'Clips' | 'Posts') => {
    switch (tab){
      case 'All':
        setActiveTab('All');
        break;
      case 'Clips':
        setActiveTab('Clips');
        break;
      case 'Posts':
        setActiveTab('Posts');
        break;
      default:
        setActiveTab('All');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>happs</Text>
              <Ionicons name="notifications-outline" size={24} color="black" />            
            </View>
            <View style={styles.headerRow}>
              <View style={styles.topTabBar}>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('All')}
                >
                  <Text style={activeTab === 'All' ? styles.activeTab : styles.inactiveTab}>All</Text>
                </Pressable>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('Clips')}
                >
                  <Text style={activeTab === 'Clips' ? styles.activeTab : styles.inactiveTab}>Clips</Text>
                </Pressable>
                <Pressable 
                  style={styles.topTab}
                  onPress={() => handleToggleActiveTab('Posts')}
                >
                  <Text style={activeTab === 'Posts' ? styles.activeTab : styles.inactiveTab}>Posts</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View>
            {/* Progress bar */}
            { fileObjs.length > 0 && (
            <View style={styles.uploadProgressContainer}>
              <View style={styles.uploadProgressItem}>
                <View style={styles.progressComponentContainer}>
                  <ActivityIndicator size='large' />
                </View>
                <View style={styles.progressComponentContainer}>
                  <Image style={styles.uploadProgressImage} source={{ uri: fileObjs[0]?.localUri}} />
                </View>
              </View>
            </View>
            )}
            {/* <Image source={{ uri: '../../assets/images/Apple.png'}} /> */}
            {/* Content here: */}
          </View>
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
  scrollView: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    height: 100,
    width: '100%',
    flexDirection: "column"
  },
  headerRow: {
    height: '50%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  headerText: {
    fontSize: 24,
    color: "black",
    fontWeight: 700,
    fontFamily: "Poppins-Bold",
  },
  topTabBar: {
    height: '100%',
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-end",
  },
  topTab: {
    paddingLeft: 10,
    marginRight: 20,
  },
  activeTab: {
    fontWeight: 'bold',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  inactiveTab: {
    fontWeight: 'light',
    fontSize: 16,
  },
  uploadProgressContainer: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  uploadProgressItem: {
    display: 'flex',
    flexDirection: 'row',
    // height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150,
    height: 75,
    borderWidth: 1,
    borderRadius: 10
  },
  uploadProgressImage: {
    width: 75,
    height: 73,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 0
  },
  progressComponentContainer: {
    height: 75,
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
