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
import { AntDesign, Ionicons } from "@expo/vector-icons";

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

  const back = () => {
    navigation.navigate("MainScreen");
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
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center mt-10">
            <Pressable onPress={back} className="w-11/12 justify-start mb-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-3xl font-medium">Sign Up</Text>
            <TextInput
              className="w-11/12 h-12 border rounded-xl p-2 mt-10"
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <TextInput
              className="w-11/12 h-12 border rounded-xl p-2 mt-5"
              placeholder="Username"
              onChangeText={(text) => setUsername(text)}
              value={username}
            />
            <View className="mt-5 flex-row w-11/12 border h-12 rounded-xl p-2 items-center">
              <TextInput
                className="flex-1"
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={passwordVisible}
              />
              <Pressable onPressIn={showPassword} onPressOut={showPassword}>
                <AntDesign name="eyeo" size={24} color="black" />
              </Pressable>
            </View>
            <View className="mt-5 flex-row w-11/12 border h-12 rounded-xl p-2 items-center">
              <TextInput
                className="flex-1"
                placeholder="Password"
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry={passwordVisible}
              />
              <Pressable onPressIn={showPassword} onPressOut={showPassword}>
                <AntDesign name="eyeo" size={24} color="black" />
              </Pressable>
            </View>
            <Pressable
              className="h-12 w-4/5 mt-8 border rounded-xl justify-center items-center bg-cyan-50 active:bg-cyan-100"
              onPress={signUp}
            >
              <Text className="text-lg font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
