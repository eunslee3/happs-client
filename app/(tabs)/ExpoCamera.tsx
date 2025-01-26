import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

type CameraTypeInstance = CameraView;
export default function ExpoCamera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const router = useRouter();
  const cameraRef = useRef<CameraTypeInstance>(null);
  const [photo, setPhoto] = useState<any>(null);
  const [cameraMode, setCameraMode] = useState('picture');

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();  // Take a picture
      setPhoto(photoData?.uri);  // Set the photo URI to state
      console.log('Photo taken:', photoData);
    }
  };

  useEffect(() => {
    // Hide tab bar when this screen is active
    navigation.setOptions({
      tabBarStyle: { display: 'none' }, // Hide the tab bar
    });

    // Cleanup on unmount to show the tab bar again
    return () => {
      navigation.setOptions({
        tabBarStyle: { display: 'flex' }, // Show the tab bar again when leaving this screen
      });
    };
  }, [navigation]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.allowCameraContainer}>
        <View style={styles.messageContainer}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>Camera Permissions:</Text>
          <Text style={styles.message}>We need your permission to show the camera. Do us a favor and click "Allow"</Text>
          <View style={styles.permissionButtonContainer}>
            <Button title="Nah"/>
            <Button onPress={requestPermission} title="Allow" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView 
        style={styles.camera} 
        // facing={facing}
        // autofocus='on'
        ref={cameraRef}
      >
        <View style={styles.navigationContainer}>
          <Pressable onPress={() => {router.back()}}>
            <AntDesign name="left" size={24} color="white" />
          </Pressable>
        </View>
        <View style={styles.cameraButtonContainer}>
          <MaterialIcons name="insert-photo" size={48} color="white" />
          <Pressable onPress={handleTakePhoto}>
            <View style={{ width: 65, height: 65, borderRadius: '50%', backgroundColor: 'white', marginHorizontal: 40 }}/>
          </Pressable>
          <Pressable onPress={toggleCameraFacing}>
            <FontAwesome6 name="camera-rotate" size={44} color="white" />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  allowCameraContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'black'
  },
  messageContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    position: 'absolute',
    left: '50%',
    top: "50%",
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%'
  },
  permissionButtonContainer: {
    flexDirection: 'row',
    justifyContent:'space-around',
    paddingVertical: 10,
    width: '100%',
  },
  camera: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  navigationContainer: {
    paddingVertical: 70,
    paddingHorizontal: 20,
    width: '100%'
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 70,
    width: '100%'
  }
});
