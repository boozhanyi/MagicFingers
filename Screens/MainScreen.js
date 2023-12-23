import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../Components/FadeInView.js";

const PlaceHolderImage = require("../assets/MagicFingers_Logo.png");

export default function MainScreen({ navigation }) {
  const LogIn = () => {
    navigation.navigate("LogInScreen");
  };

  const SignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-cyan-200 items-center justify-center">
      <FadeInView style={styles.imageContainer}>
        <Image
          source={PlaceHolderImage}
          className="w-2/4 h-1/4 sm:h-2/5"
        ></Image>
        <Pressable
          className="bg-cyan-100 active:bg-white w-5/6 h-12 justify-center items-center rounded-full mt-6 border"
          onPress={LogIn}
        >
          <Text className="text-sm uppercase font-medium sm:text-base ">
            Log In
          </Text>
        </Pressable>
        <Pressable
          className="bg-cyan-100 active:bg-white w-5/6 h-12 justify-center items-center rounded-full mt-6 border "
          onPress={SignUp}
        >
          <Text className="text-sm uppercase font-medium sm:text-base">
            Sign Up
          </Text>
        </Pressable>
      </FadeInView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
