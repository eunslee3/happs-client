import { StyleSheet, Image, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';

import userStore from '@/store/userStore';

export default function Profile() {
  const { user } = userStore();
  console.log(user)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>happs</Text>
          <Image source={require('../../assets/images/gear.png')}/>            
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.pfpAndNameContainer}>
          {/* Add press event here to upload or edit a pfp */}
          <Pressable> 
            {user.profilePictureUrl ? 
              <Image source={user.profilePictureUrl} /> 
              : 
              <View style={styles.defaultProfilePicture}>
                <Image 
                  style={styles.defaultProfilePicture} 
                  source={require('../../assets/images/Default_pfp.jpg')} 
                />
                <AntDesign 
                  style={styles.addProfilePictureButton} 
                  name="pluscircle" 
                  size={24} 
                  color="black" 
                />
              </View>
            }
          </Pressable>
          <View style={styles.nameContainer}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user.firstName + ' ' + user.lastName}</Text>
            <Text style={{ fontSize: 14, color: '#9A9EA2'}}>{'@' + user.username}</Text>
          </View>
        </View>
      </View>
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
  userInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    borderWidth: 1,
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
  }
});
