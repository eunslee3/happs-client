import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { updateUserInfoApi } from '@/api/user/updateUserInfoApi';
import { useMutation } from '@tanstack/react-query';
import { getPresignedUrlApi } from '@/api/posts/getPresignedUrlApi';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import userStore from '@/store/userStore';

const windowWidth = Dimensions.get('window').width;
const itemHeight = (windowWidth * 0.50) * 1.5

export default function UploadModal (
  { 
    selectedAsset, 
    clearSelectedAsset,
    setShow
  }: 
  { 
    selectedAsset: any, 
    clearSelectedAsset: () => void,
    setShow: (show: boolean) => void
  }
) {
  const { user, setUser } = userStore();

  async function convertPhUriToFile(uri: string, assetId?: string) {
    try {
      let fileObj: any = {};
      
      // If the URI starts with 'ph://', try to resolve it
      if (uri.startsWith('ph://')) {
        // Request media library permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Media library permissions not granted');
        }
        
        // Use assetId if available; otherwise, use the URI directly.
        const identifier = assetId || uri;
        const assetInfo = await MediaLibrary.getAssetInfoAsync(identifier);
        
        if (!assetInfo || !assetInfo.localUri) {
          throw new Error('Could not get localUri from asset info');
        }
        fileObj = {
          localUri: assetInfo.localUri,
          fileName: assetInfo.filename,
          fileType: assetInfo.mediaType
        }
      }

      return fileObj;
    } catch (error) {
      console.error('Error in convertPhUriToFile:', error);
      throw error;
    }
  };

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const response = await getPresignedUrlApi(fileName, fileType);
    return response
  };

  // Uploads file to S3 bucket - if successful, return the presignedURL for cleanup
  const uploadToS3 = async (asset: any, presignedUrl: any) => {
    try {
      const fileObj = await convertPhUriToFile(asset.uri, asset.id);
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
  };

    const uploadFilesMutation = useMutation({
      mutationFn: async ( file: any ) => {
        const presignedObj = await getPresignedUrl(file.filename, file.mediaType);
        const formattedUrl = await uploadToS3(file, presignedObj.presignedUrl);
    
        return { formattedUrl };
      },
      onSuccess: async ({ formattedUrl }) => {

        await updateUserInfoApi({ id: user.id, profilePictureUrl: formattedUrl });
        setUser({
          ...user,
          profilePictureUrl: formattedUrl
        })
        clearSelectedAsset();
        setShow(false);
      },
      onError: (err) => {
        console.error('Upload Error:', err);
      },
    });
  

  const handlePress = () => {
    uploadFilesMutation.mutate(selectedAsset);
  }

  const handleCancel = () => {
    clearSelectedAsset();
    setShow(false);
  }

  return (
    <View style={[styles.container, styles.shadowContainer]}>
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Upload Photo?</Text>
        <Image source={{ uri: selectedAsset?.uri }} style={{ width: 75, height: 75, margin: 10 }}/>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.uploadButton} onPress={handlePress}>
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '75%',
    height: itemHeight,
    left: '50%',
    top: '50%',
    borderRadius: 10,
    backgroundColor: 'white',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    padding: 20,
  },
  shadowContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android Shadow
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  uploadButton: {
    backgroundColor: "#0ED8B8",
    height: 45,
    width: '45%',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 20
  },
  uploadText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "white",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    marginTop: 20,
    width: '100%'
  },
  cancelButton: {
    backgroundColor: "#DEDEDE",
    height: 45,
    width: '45%',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 20
  },
  cancelText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "black",
  },
})