import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SignUpAccount } from "../Backend/Firebase";
import { AntDesign } from "@expo/vector-icons";

export default function LogInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const showPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const signUp = async () => {
    try {
      if (confirmPassword == password) {
        await SignUpAccount(email, password, username);
        navigation.navigate("HomeScreen");
      } else {
        setConfirmPassword("");
        setPassword("");
        Alert.alert("Password did not match");
      }
    } catch (error) {
      setConfirmPassword("");
      setPassword("");
      setEmail("");
      setUsername("");
      console.error("Error signing up:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={{
        flex: 1,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
      }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.nameInput}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <TextInput
                style={styles.nameInput}
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
                value={username}
              />
              <View style={styles.passwordInput}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Password"
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={passwordVisible}
                />
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPressIn={showPassword}
                  onPressOut={showPassword}
                >
                  <AntDesign name="eyeo" size={24} color="black" />
                </Pressable>
              </View>
              <View style={[styles.passwordInput, { marginTop: 30 }]}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Password"
                  onChangeText={(text) => setConfirmPassword(text)}
                  value={confirmPassword}
                  secureTextEntry={passwordVisible}
                />
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPressIn={showPassword}
                  onPressOut={showPassword}
                >
                  <AntDesign name="eyeo" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                  },
                  styles.signUpButton,
                ]}
                onPress={signUp}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    width: "100%",
  },
  nameInput: {
    height: 50,
    width: "90%",
    borderColor: "#000000",
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  passwordInput: {
    height: 50,
    width: "90%",
    borderColor: "#000000",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: "row",
  },
  signUpButton: {
    marginTop: 30,
    width: "80%",
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
    color: "black",
    fontWeight: "500",
  },
});
