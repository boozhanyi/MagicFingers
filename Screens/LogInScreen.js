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
  const [email, setEmail] = useState("boo@gmail.com");
  const [password, setPassword] = useState("zhanyi821");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const LogIn = async () => {
    const logInStatus = await LogInAccount(email, password);
    if (logInStatus.status) {
      navigation.navigate("HomeScreen");
    } else {
      Alert.alert(logInStatus.error);
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
          <View className="flex-1 items-center mt-10">
            <Pressable onPress={back} className="w-11/12 justify-start mb-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-4xl font-bold">Log In</Text>
            <TextInput
              className="h-12 w-11/12 border mt-10 p-2 rounded-xl"
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <View className="flex flex-row justify-center items-center border w-11/12 mt-5 rounded-xl h-12 p-2">
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
            <Pressable
              className="flex w-11/12 items-end mt-3 "
              onPress={() => {
                forgotPassword();
              }}
            >
              <Text>Forgot Password ?</Text>
            </Pressable>
            <Pressable
              className=" bg-cyan-50 active:bg-cyan-100 mt-4 w-11/12 h-12 border rounded-xl items-center justify-center p-2"
              onPress={LogIn}
            >
              <Text className="text-md uppercase font-medium">Log In</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
