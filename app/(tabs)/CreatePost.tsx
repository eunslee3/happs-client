import { Switch, View, StyleSheet, ScrollView, Image as RNImage, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Image as ExpoImage } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';
import assetsStore from '@/store/assetStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';
import uploadStore from '@/store/uploadStore';
import userStore from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import { getPresignedUrlApi } from '@/api/posts/getPresignedUrlApi';
import * as FileSystem from 'expo-file-system';
import { createPost } from '@/api/posts/createPost';
import { getThumbnails } from '@/api/posts/getThumbnails';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query'
export default function CreatePost() {
  const router = useRouter();
  // const assets = assetsStore((state: any) => state.assets);
  const { assets, selectedAsset } = assetsStore();
  const { clearAssets, clearSelectedAsset } = assetsStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    allowComments: true,
    participateInLeaderboard: true
  });
  const { setIsUploading } = uploadStore();
  const { user } = userStore();
  const queryClient = useQueryClient();

  const getPresignedUrl = async (fileName: string, fileType: string) => {
    const response = await getPresignedUrlApi(fileName, fileType);
    return response
  }

  // Uploads file to S3 bucket - if successful, return the presignedURL for cleanup
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

  const uploadFilesMutation = useMutation({
    mutationFn: async ( fileObjs: any ) => {
      setIsUploading(true);
      const presignedObjs = await Promise.all(
        fileObjs.map((file: any) => getPresignedUrl(file.fileName, file.fileType))
      );
  
      const cleanUrls = await Promise.allSettled(
        presignedObjs.map((presignedObj, idx) =>
          uploadToS3(fileObjs[idx], presignedObj.presignedUrl)
        )
      );
  
      const successfulUrls = cleanUrls
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      const formattedUrls = successfulUrls.map((url, idx) => {
        if (url.includes('.MP4') || url.includes('.MOV')) {
          return {
            id: idx,
            type: 'video',
            url: url,
            thumbnailUrl: ''
          }
        } else {
          return {
            id: idx,
            type: 'image',
            url: url
          }
        }
      })
  
      const fileKeys = presignedObjs.map((presignedObj) => presignedObj.fileKey);
  
      return { formattedUrls, fileKeys };
    },
    onSuccess: async ({ formattedUrls, fileKeys }) => {
      // Pass in video file keys to s3 to fetch video thumbnails - used for Home.tsx's feed
      await Promise.all(
        fileKeys.map(async (fileKey, idx) => {
          if (fileKey.includes(".MP4") || fileKey.includes(".MOV")) {
            const response = await getThumbnails(fileKey);
            const cleanThumbnailUrl = response.data.thumbnailUrl.split("?")[0];
            formattedUrls[idx].thumbnailUrl = cleanThumbnailUrl;
          }
        })
      );

      await createPost(user.id, form, formattedUrls, fileKeys);
      setForm({
        title: '',
        description: '',
        location: '',
        allowComments: true,
        participateInLeaderboard: true
      })
      setIsUploading(false);
      clearAssets();
      clearSelectedAsset();
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      Toast.show({
        text1: 'Post created successfully!',
        type: 'success',
      });
    },
    onError: (err) => {
      setIsUploading(false);
      Toast.show({
        text1: 'Unable to upload post',
        type: 'error',
      });
      console.error('Upload Error:', err);
    },
  });

  // IOS - The file name for their assets starts with ph://. This causes issues when trying to
  // upload or use the assets
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
  }

  // Prevents the user from uploading more than 10 assets at one time
  useEffect(() => {
    if (selectedAsset && assets.length < 10) {
      console.log('selectedAsset: ', selectedAsset)
      assetsStore.getState().setAssets([...assetsStore.getState().assets, selectedAsset]);
    }
  }, [])

  const handleBackButton = () => {
    router.back();
    assetsStore.getState().clearAssets()
  }

  // Handles the delete functionality of an asset
  const handleRemoveSelectedAsset = (selectedAsset: any) => {
    assetsStore.getState().setAssets(assets.filter((asset: any) => asset.id!== selectedAsset.id));
  };

  // Shows the duration of a video asset
  const formatFloatToMinutes = (floatValue: number) => {
    const minutes = (floatValue / 60).toFixed(2).toString().replace('.', ':');
    return `${minutes}`;
  };

  const handleRenderAssets = () => {
    return assets.map((asset: any, idx: number) => {
      return (
        <View key={idx} style={styles.assetContainer}>
          <Pressable style={styles.assetDetail} onPress={() => handleRemoveSelectedAsset(asset)}>
            <FontAwesome name="trash" size={24} color="red" />
          </Pressable>
          {asset.mediaType === 'video' ?
            <Text style={styles.duration}>{formatFloatToMinutes(asset.duration)}</Text>
            :
            null
          }
          <ExpoImage source={asset.uri} style={styles.asset} />
        </View>
      )
    });
  };

  const handleTitleInputChange = (text: string) => {
    setForm((prevState) => ({
      ...prevState,
      title: text
    }));
  };

  const handleDescriptionInputChange = (text: string) => {
    setForm((prevState) => ({
      ...prevState,
      description: text
    }))
  };

  const handleSwitchChange = (value: boolean, type: string) => {
    switch (type) {
      case 'allowComments':
        setForm((prevState) => ({
          ...prevState,
          allowComments: value
        }));
        break
      case 'participateInLeaderboard':
        setForm((prevState) => ({
          ...prevState,
          participateInLeaderboard: value
        }));
        break
      default: break
    }
  };

  const handleSubmit = async () => {
    try {
      const fileObjs = await Promise.all(assets.map((asset: any) => convertPhUriToFile(asset.uri, asset.id)));
      uploadFilesMutation.mutate(fileObjs);
      router.navigate('/Home');
    } catch (err) {
      console.error('Error submitting post', err);
    }
  }


  return (
  <SafeAreaView style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.headerContainer}>
          <Pressable style={styles.backIcon} onPress={() => {handleBackButton()}}>
            <AntDesign style={{ marginLeft: 10 }} name="left" size={24} color="black" />
          </Pressable>
          <Text style={styles.header}>Create Post</Text>
          <View style={styles.emptySpace} />
        </View>

        {assets.length < 1 ? 
          <View style={styles.defaultAddAssetContainer}>
            <Pressable style={styles.defaultAddAsset} onPress={() => router.push({ pathname: '../components/PhotoGallery', params: { path: 'CreatePost' }})}>
              <RNImage source={require('../../assets/images/create-post-camera.png')} />
              <Text style={{ fontSize: 14, marginVertical: 5 }}>Add More</Text>
              <Text style={{ color: '#7E8184' }}>{`0/10`}</Text>
            </Pressable> 
          </View>
          : 
          <ScrollView style={styles.listOfAssetsContainer} horizontal={true}>
            <Pressable style={styles.addAsset} onPress={() => router.push('../components/PhotoGallery')} disabled={assets.length > 9}>
              <RNImage source={require('../../assets/images/create-post-camera.png')} />
              <Text style={{ fontSize: 14, marginVertical: 5 }}>Add More</Text>
              <Text style={{ color: '#7E8184' }}>{`${assets.length}/10`}</Text>
            </Pressable>
            {handleRenderAssets()}
          </ScrollView>
        }

        {/* Everything here is inside ScrollView, no fixed heights */}
        <View style={styles.titleInputContainer}>
          <TextInput 
            style={styles.titleInput} 
            placeholder="Title goes here..."
            onChangeText={handleTitleInputChange}
            value={form.title}
          />
          <Text style={form.title.length > 50 ? { color: 'red' } : { color: 'black' }}>{form.title.length}/50</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <TextInput 
            placeholder="Add a description"
            style={styles.descriptionInput}
            multiline
            onChangeText={handleDescriptionInputChange}
          />
          <Text style={[form.description.length > 1000 ? { color: 'red' } : { color: 'black' }, { alignSelf: 'flex-end' }]}>{form.description.length}/1000</Text>
        </View>

        {/* Privacy Section with Flex Layout */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyHeader}>Privacy</Text>
          <View style={styles.switchContainer}>
            <Text style={{ fontSize: 14 }}>Allow Comments</Text>
            <Switch 
              onValueChange={(value) => handleSwitchChange(value, 'allowComments')}
              trackColor={{false: '#767577', true: '#9155FF'}}
              thumbColor={form.allowComments ? 'white' : '#f4f3f4'}
              value={form.allowComments}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={{ fontSize: 14 }}>Participation in leaderboard</Text>
            <Switch 
              onValueChange={(value) => handleSwitchChange(value, 'participateInLeaderboard')}
              trackColor={{false: '#767577', true: '#9155FF'}}
              thumbColor={form.participateInLeaderboard ? 'white' : '#f4f3f4'}
              value={form.participateInLeaderboard}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={() => handleBackButton()} style={[styles.button, { backgroundColor: '#F6F7F7' }]}>
            <Text style={{ fontSize: 16, color: 'red' }}>Cancel</Text>
          </Pressable>
          <Pressable onPress={() => handleSubmit()} style={[styles.button, { backgroundColor: '#00DCB7' }]}>
            <Text style={{ fontSize: 16, color: 'white' }}>Post</Text>
          </Pressable>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
    flex: 1,  // Ensure ScrollView takes up all available space
    width: '100%',  // Ensure full-width scrolling
  },
  scrollContentContainer: {
    paddingBottom: 20,  // Ensure there's enough space at the bottom for buttons
    paddingTop: 10,  // Optional: Add padding at the top
  },
  headerContainer: {
    height: 'auto',
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 24
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
  defaultAddAssetContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    flex: 1
  },
  assetsContainer: {
    height: 200,
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
  },
  defaultAddAsset: {
    height: 200,
    minWidth: 150,
    width: '95%',
    borderWidth: 2,
    borderStyle: 'dotted',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1796FF'
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
  },
  listOfAssetsContainer: {
    height: 'auto',
    width: '100%',
    flexDirection: "row",
  },
  asset: {
    height: 200,
    width: 150,
    borderRadius: 25,
  },
  assetContainer: {
    height: 200,
    width: 150,
    flexDirection: 'column',
    marginLeft: 5,
  },
  assetDetail: {
    position: 'absolute',
    zIndex: 9999,
    right: 0,
    padding: 10
  },
  duration: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    color: 'white',
    zIndex: 9999,
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    width: '100%',
    height: 'auto',
    flexDirection: 'column'
  },
  titleInput: {
    height: 30,
    width: '80%',
    fontSize: 24
  },
  titleInputContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 24,
    marginTop: 24,
    alignItems: 'center'
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 24
  },
  descriptionInput: {
    width: '100%',
    height: 100,
    fontSize: 16,
    backgroundColor: '#F6F7F7',
    borderRadius: 15,
    textAlignVertical: 'top',
    padding: 10,
    flexDirection: 'column',
  },
  privacyContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 15
  },
  privacyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 16,
    alignItems: 'center'
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 30
  },
  button: {
    width: '50%',
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2
  }
});
