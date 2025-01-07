import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteSpace}>
        <View style={styles.topTextContainer}>
          <Text style={styles.header}>Sign in</Text>
          <Text style={styles.subHeader}>
            Welcome back to happs! Please enter the details to continue
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput style={styles.textInput} placeholder="Username/Email" />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </View>
        <View>
          <Pressable style={styles.signInButton}>
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
          <Pressable style={styles.thirdPartyButton}>
            <Text>Google</Text>
          </Pressable>
          <Pressable style={styles.thirdPartyButton}>
            <Text>Apple</Text>
          </Pressable>
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
    width: 150,
    height: 60,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  }
});