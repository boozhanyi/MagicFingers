import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image, Pressable, Text } from "react-native";
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
    <SafeAreaView style={styles.container}>
      <FadeInView style={styles.imageContainer}>
        <Image source={PlaceHolderImage} style={styles.image}></Image>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
              },
              styles.button,
            ]}
            onPress={LogIn}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
              },
              styles.button,
            ]}
            onPress={SignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </View>
      </FadeInView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C5FFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "50%",
    height: "25%",
  },
  buttonContainer: {
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: "70%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textTransform: "uppercase",
    color: "black",
    fontWeight: "500",
  },
});
