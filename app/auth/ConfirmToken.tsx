import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AntDesign from '@expo/vector-icons/AntDesign';
import { sendOtpApi } from '@/api/auth/sendOtpApi';
import { verifyOtpApi } from '@/api/auth/verifyOtpApi';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function ConfirmToken() {
  const [value, setValue] = useState('');
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const router = useRouter();
  const { id, email } = useLocalSearchParams();

  const sendOtp = async () => {
    try {
      const response = await sendOtpApi(id, email);
      console.log(response)
      if (response.status === 200) {
        console.log('OTP sent successfully');

      } else {
        Toast.show({
          text1: 'Failed to send OTP',
          text2: 'Please try again later',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await verifyOtpApi(id, value);
      if (response.data.status === 201) {
        router.push({
          pathname: '/auth/UserInfo',
          params: {
            id: response.data.data.createdUser.id
          }
        })
      } 
      else if (response.data.status === 400) {
        Toast.show({
          text1: 'Incorrect Passcode',
          text2: 'Please enter a valid code',
          type: 'error',
        })
      }
    } catch (err) {
      Toast.show({
        text1: 'Something went wrong',
        text2: `${err}`,
        type: 'error',
      })
    }
  }

  useEffect(() => {
    sendOtp();
  }, []);

  
  return (
    <SafeAreaView style={styles.root}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.whiteSpace}>
        <Pressable onPress={() => {router.back()}}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
          <View style={styles.topTextContainer}>
            <Text style={styles.header}>Enter verification code</Text>
            <Text style={styles.subHeader}>
              A 6 digit one-time verification code has been sent to your email!
              Please enter it below.
            </Text>
          </View>
          <View style={styles.codeFieldContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              testID="my-code-input"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor/> : null)}
                </Text>
              )}
            />
          </View>
          <Pressable style={styles.signUpButton} onPress={handleSubmit}>
            <Text style={styles.signUpButtonText}>Verify</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20, width: '100%'},
  whiteSpace: {
    marginTop: 50,
    flex: 1,
    width: "100%",
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
  codeFieldContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  codeFieldRoot: {
    marginTop: 20,
    justifyContent: 'space-between',
    width: "100%"
  },
  cell: {
    width: 50,
    height: 60,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
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