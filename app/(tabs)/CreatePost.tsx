import { Switch, View, StyleSheet, ScrollView, Image as RNImage, Text, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Image as ExpoImage } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';
import assetsStore from '@/store/assetStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export default function CreatePost() {
  const router = useRouter();
  const assets = assetsStore((state: any) => state.assets);
  const { selectedAsset } = useLocalSearchParams<{ selectedAsset: any }>();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    allowComments: true,
    participateInLeaderboard: true
  });

  const getFileBuffer = async (uri: string) => {
    try {
      // Step 1: Read the file as a base64 string
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Step 2: Convert the base64 string to a Buffer
      const buffer = Buffer.from(fileContent, 'base64');
  
      return buffer;
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Failed to convert file to buffer');
    }
  }

  useEffect(() => {
    if (selectedAsset && assets.length < 10) {
      const parsedAssets = JSON.parse(selectedAsset);
      assetsStore.getState().setAssets([...assetsStore.getState().assets, parsedAssets]);
    }
  }, [selectedAsset])

  const handleBackButton = () => {
    router.back();
    assetsStore.getState().clearAssets()
  }

  const handleRemoveSelectedAsset = (selectedAsset: any) => {
    assetsStore.getState().setAssets(assets.filter((asset: any) => asset.id!== selectedAsset.id));
  };

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
    
  }

  console.log('this is assets: ', assets)


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
            <Pressable style={styles.defaultAddAsset} onPress={() => router.push('../components/PhotoGallery')}>
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
