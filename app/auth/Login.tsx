import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticateApi } from '@/api/auth/authenticateApi';
import { googleAuthApi } from '@/api/auth/googleAuthApi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleTextChange = (e: any, type: 'username' | 'password') => {
    const setters: Record<typeof type, React.Dispatch<React.SetStateAction<string>>> = {
      username: setUsername,
      password: setPassword,
    }
    setters[type](e)
  }

  console.log({ username, password })

  const handleSubmit = async () => {
    const response = await authenticateApi(username, password);
    console.log(response);
  }

  const handleGoogleAuth = async () => {
    const response = await googleAuthApi();
    console.log(response)
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.whiteSpace}>
        <View style={styles.topTextContainer}>
          <Text style={styles.header}>Sign in</Text>
          <Text style={styles.subHeader}>
            Welcome back to happs! Please enter the details to continue
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Username/Email"
            onChangeText={(e) => {handleTextChange(e, 'username')}}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(e) => {handleTextChange(e, 'password')}}
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </View>
        <View>
          <Pressable style={styles.signInButton} onPress={handleSubmit}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLines} />
            <View>
              <Text style={styles.dividerText}>OR</Text>
            </View>
            <View style={styles.dividerLines} />
          </View>
        </View>
        <View style={styles.thirdPartyLoginsContainer}>
          <Pressable style={styles.thirdPartyButton} onPress={handleGoogleAuth}>
            <Image source={require('../../assets/images/Google.png')}/>
            <Text style={styles.buttonText}>Google</Text>
          </Pressable>
          <Pressable style={styles.thirdPartyButton}>
            <Image source={require('../../assets/images/Apple.png')}/>
            <Text style={styles.buttonText}>Apple</Text>
          </Pressable>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.signupTextContainer}>
            <Text style={styles.signupTextLightWeight}>Don't have an account?</Text>
            <Text style={styles.signupText}>Sign up</Text>
          </View>
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 20,
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 18,
  },
  signInButton: {
    backgroundColor: "#0ED8B8",
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  signInButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    color: "white",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  dividerLines: {
    flex: 1,
    height: 1,
    backgroundColor: "#DEDEDE",
  },
  dividerText: {
    color: 'grey',
    width: 50,
    textAlign: "center",
  },
  thirdPartyLoginsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  thirdPartyButton: {
    flexDirection: "row",
    width: 150,
    height: 60,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    marginLeft: 5
  },
  bottomContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  signupTextContainer: {
    flexDirection: 'row'
  },
  signupTextLightWeight: {
    color: '#9DA1A5',
    marginRight: 2,
    fontSize: 15,
  },
  signupText: {
    fontSize: 15,
  }
});