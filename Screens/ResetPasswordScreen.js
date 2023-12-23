import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPassword } from "../Backend/Firebase";

export default function ResetPassword({ navigation, route }) {
  const [email, setEmail] = useState("");
  const state = route.params?.state;

  const setNewPassword = async () => {
    if (email === "") {
      Alert.alert("Please enter a email!");
      return;
    }
    await resetPassword(email);
    if (state === 0) {
      navigation.navigate("LogInScreen");
    } else {
      navigation.navigate("Profile");
    }
  };

  const back = () => {
    if (state === 0) {
      navigation.navigate("LogInScreen");
    } else {
      navigation.navigate("Profile");
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
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center mt-10 sm:mt-20">
          <Text className="text-3xl font-bold sm:text-6xl">Reset Password</Text>
          <View className="justify-center items-center w-full mt-10">
            <TextInput
              className="w-11/12 h-14 border rounded-xl p-3 sm:text-2xl sm:h-20"
              placeholder="Your Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
            <Pressable
              className="w-3/5 h-10 rounded-xl mt-5 justify-center items-center bg-cyan-50 shadow-xl shadow-neutral-950 sm:h-20 active:bg-white"
              onPress={setNewPassword}
            >
              <Text className="text-base uppercase text-black font-semibold">
                Reset
              </Text>
            </Pressable>
            <Pressable
              className="w-3/5 h-10 rounded-xl mt-5 justify-center items-center bg-cyan-50 shadow-xl shadow-neutral-950 sm:h-20 active:bg-white"
              onPress={back}
            >
              <Text className="text-base uppercase text-black font-semibold">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
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
    width: "100%",
    marginTop: 50,
  },
  input: {
    height: 50,
    width: "90%",
    borderColor: "#000000",
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    marginTop: 30,
    width: "70%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
    color: "black",
    fontWeight: "500",
  },
});
