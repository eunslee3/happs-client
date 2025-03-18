import { StyleSheet, View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState, useEffect } from 'react';
import userStore from '@/store/userStore';
import ProfileGallery from '../components/ProfileGallery';
import { useRouter, usePathname  } from 'expo-router';
import assetsStore from '@/store/assetStore';
import UploadModal from '../components/profile/UploadModal';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('All');
  const [show, setShow] = useState(false);
  const { user } = userStore();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedAsset, clearSelectedAsset } = assetsStore();
  console.log('user', user)

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

  const handleNavigate = () => {
    router.push({ pathname: '../components/PhotoGallery', params: {
      path: 'Profile'
    }})
  }

  useEffect(() => {
    if (selectedAsset?.id && pathname === '/Profile') {
      setShow(true);
    }
  }, [selectedAsset, pathname])

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        transparent={true}
        visible={show}
      >
        <UploadModal selectedAsset={selectedAsset} clearSelectedAsset={clearSelectedAsset} setShow={setShow}/>
      </Modal>
      <ScrollView>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Image style={{ objectFit: 'contain', width: 100, height: 50 }} source={require('../../assets/images/happs-cropped.png')} />
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.pfpAndNameContainer}>
          {/* Add press event here to upload or edit a pfp */}
          <Pressable onPress={handleNavigate}> 
              <View style={styles.defaultProfilePicture}>
                {user.profilePictureUrl ? 
                  <Image
                    style={styles.defaultProfilePicture} 
                    source={{ uri: user.profilePictureUrl }} 
                  /> 
                  :
                  <Image 
                    style={styles.defaultProfilePicture} 
                    source={require('../../assets/images/Default_pfp.jpg')} 
                  />
                }
                <AntDesign 
                  style={styles.addProfilePictureButton} 
                  name="pluscircle" 
                  size={24} 
                  color="black" 
                />
              </View>
          </Pressable>
          <View style={styles.nameContainer}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user.firstName + ' ' + user.lastName}</Text>
            <Text style={{ fontSize: 14, color: '#9A9EA2'}}>{'@' + user.username}</Text>
          </View>
        </View>
        <View style={styles.followingContainer}>
          <View style={styles.followingBlock}>
            <Text style={{ fontSize: 14, color: '#9A9EA2' }}>Followers</Text>
            <Text style={{ fontSize: 24 }}>{user.followers}</Text>
          </View>
          <View style={styles.followingBlock}>
            <Text style={{ fontSize: 14, color: '#9A9EA2' }}>Following</Text>
            <Text style={{ fontSize: 24 }}>{user.following}</Text>
          </View>
        </View>
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <Pressable 
              style={styles.tab}
              onPress={() => handleToggleActiveTab('All')}
            >
              <Text style={activeTab === 'All' ? styles.activeTab : styles.inactiveTab}>All</Text>
            </Pressable>
            <Pressable 
              style={styles.tab}
              onPress={() => handleToggleActiveTab('Clips')}
            >
              <Text style={activeTab === 'Clips' ? styles.activeTab : styles.inactiveTab}>Clips</Text>
            </Pressable>
            <Pressable 
              style={styles.tab}
              onPress={() => handleToggleActiveTab('Posts')}
            >
              <Text style={activeTab === 'Posts' ? styles.activeTab : styles.inactiveTab}>Posts</Text>
            </Pressable>
            {/* Add press event to change the bottom half of profile to show all posts, clips, etc */}
            <Pressable style={{ position: 'absolute', right: 10}}>
              <AntDesign name="right" size={18} color="black" />
            </Pressable>
          </View>
        </View>
        <View style={styles.contentPreviewContainer}>
          <ProfileGallery user={user}/>
        </View>
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
  headerContainer: {
    height: 70,
    width: '100%',
    flexDirection: "column"
  },
  headerRow: {
    height: '100%',
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
  userInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    padding: 10
  },
  pfpAndNameContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
  },
  defaultProfilePicture: {
    borderRadius: 50,
    width: 70,
    height: 70,
    backgroundColor: '#c8d2d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProfilePictureButton: {
    position: 'absolute', 
    bottom: -2,
    right: 0,
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  followingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'space-evenly'
  },
  followingBlock: {
    width: 169,
    height: 83,
    backgroundColor: '#F4F6F7',
    flexDirection: 'column',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingLeft: 10
  },
  tabBar: {
    height: '100%',
    width: '100%',
    flexDirection: "row",
    alignItems: "flex-end",
  },
  tab: {
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
  contentPreviewContainer: {
    width: '100%',
    // borderWidth: 1,
    // marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
