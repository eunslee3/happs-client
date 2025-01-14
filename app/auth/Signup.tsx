import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerApi } from '@/api/auth/registerApi';
import { Link, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

export default function Signup() {
  const [registerObj, setRegisterObj] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();
  const registerSchema = yup.object().shape({
    email: yup.string().email(),
    password: yup.string().required(),
    confirmPassword: yup.string().required()
  })

  const handleTextChange = (e: any, type: 'email' | 'password' | 'confirmPassword') => {
    setRegisterObj((prevState) => (
      {
        ...prevState,
        [type]: e
      }
    ))
  }

  console.log(registerObj)

  const showToast = (toastType: string, errName?: any, errMsg?: any) => {
    if (toastType === 'passwordErr') {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match!'
      });
    } else if (toastType === 'validationErr') {
      Toast.show({
        type: 'error',
        text1: errName,
        text2: errMsg[0]
      });
    }
  }

  const handleSubmit = async () => {
    registerSchema.validate(registerObj).catch((err) => {
      showToast('validationErr', 'Registration Error', err.errors)
    })

    if (registerObj.password !== registerObj.confirmPassword) {
      console.log('hit')
      showToast('passwordErr');
      return;
    }
    router.push('/auth/ConfirmToken')
    // const response = await registerApi({email, password});
    // console.log(response);
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.whiteSpace}>
        <Pressable onPress={() => {router.back()}}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <View style={styles.topTextContainer}>
          <Text style={styles.header}>Create an account</Text>
          <Text style={styles.subHeader}>
            Lets get started! Enter your details to create an account.
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Email"
            onChangeText={(e) => {handleTextChange(e, 'email')}}
          />
          <TextInput 
            style={styles.textInput} 
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(e) => {handleTextChange(e, 'password')}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(e) => {handleTextChange(e, 'confirmPassword')}}
          />
        </View>
        <View>
          <Pressable style={styles.signUpButton} onPress={handleSubmit}>
            <Text style={styles.signUpButtonText}>Sign Up </Text>
          </Pressable>
        </View>
      </View>
      </TouchableWithoutFeedback>
      {/* <Toast
        position='top'
        topOffset={70}
      /> */}
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