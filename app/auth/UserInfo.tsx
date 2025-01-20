import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateUserInfoApi } from '@/api/user/updateUserInfoApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    firstName: '',
    lastName: ''
  });
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const userInfoSchema = yup.object().shape({
    username: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required()
  })

  const handleTextChange = (e: any, type: 'username' | 'firstName' | 'lastName') => {
    setUserInfo((prevState) => (
      {
        ...prevState,
        [type]: e
      }
    ))
  }

  const showToast = (errName?: any, errMsg?: any) => {
    Toast.show({
      type: 'error',
      text1: errName
    });
  }

  const handleValidation = async () => {
    try {
      await userInfoSchema.validate(userInfo);
    } catch (err: any) {
      showToast('Fill Out Required Fields', err.errors);
      return;
    }
  }

  const handleSubmit = async () => {
    handleValidation();
    try {
      const response = await updateUserInfoApi({ id, ...userInfo });
      console.log(response.data);
      if (response.err) {
        return;
      } else {
        router.push({
          pathname: '/(tabs)',
        });
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.whiteSpace}>
        <View style={styles.topTextContainer}>
          <Text style={styles.header}>Personal Information</Text>
          <Text style={styles.subHeader}>
            One more thing. Please provide your information.
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Username"
            onChangeText={(e) => {handleTextChange(e, 'username')}}
          />
          <TextInput 
            style={styles.textInput} 
            placeholder="First Name"
            onChangeText={(e) => {handleTextChange(e, 'firstName')}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            onChangeText={(e) => {handleTextChange(e, 'lastName')}}
          />
        </View>
        <View>
          <Pressable style={styles.signUpButton} onPress={handleSubmit}>
            <Text style={styles.signUpButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
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
  whiteSpace: {
    marginTop: 50,
    flex: 1,
    width: "95%",
    paddingHorizontal: 10,
  },
  topTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 20
  },
  header: {
    fontFamily: "Poppins-Medium",
    fontSize: 32,
  },
  subHeader: {
    fontFamily: "Poppins-Regular",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  textInputContainer: {
    marginTop: 10,
  },
  textInput: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DEDEDE",
    paddingHorizontal: 30,
    marginTop: 10,
  },
  signUpButton: {
    backgroundColor: "#0ED8B8",
    height: 65,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginTop: 20
  },
  signUpButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    color: "white",
  }
});