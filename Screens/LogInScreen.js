import {
  View,
  TextInput,
  Text,
  Pressable,
  StatusBar,
  ImageBackground,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogInAccount } from "../Backend/Firebase";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function LogInScreen({ navigation }) {
  const [email, setEmail] = useState("boozhanyi@gmail.com");
  const [password, setPassword] = useState("zhanyi821");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const LogIn = async () => {
    const logInStatus = await LogInAccount(email, password);
    if (logInStatus) {
      navigation.navigate("HomeScreen");
    }
  };

  const showPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const forgotPassword = () => {
    navigation.navigate("ResetPassword", { state: 0 });
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
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 items-center mt-10" pointerEvents="auto">
            <Pressable onPress={back} className="w-11/12 justify-start mb-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-4xl font-bold sm:text-5xl">Log In</Text>
            <TextInput
              className="h-12 w-11/12 border mt-10 p-2 rounded-xl sm:h-20 sm:text-2xl"
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <View className="flex flex-row justify-center items-center border w-11/12 mt-5 rounded-xl h-12 p-2 sm:h-20">
              <TextInput
                className="flex-1 sm:text-2xl"
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={passwordVisible}
              />
              <Pressable onPressIn={showPassword} onPressOut={showPassword}>
                <AntDesign name="eyeo" size={24} color="black" />
              </Pressable>
            </View>
            <Pressable
              className="flex w-11/12 items-end mt-3 "
              onPress={() => {
                forgotPassword();
              }}
            >
              <Text className="sm:text-xl">Forgot Password ?</Text>
            </Pressable>
            <Pressable
              className=" bg-cyan-100 active:bg-white mt-4 w-11/12 h-12 border rounded-xl items-center justify-center p-2 sm:mt-8 sm:h-20"
              onPress={LogIn}
            >
              <Text className="text-md uppercase font-medium sm:text-xl">
                Log In
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
