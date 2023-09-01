import * as React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreAboutUsScreen({ navigation }) {
  const back = () => {
    navigation.navigate("Profile");
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
          Our Team
        </Text>
        <View style={styles.ourTeamContainer}>
          <Text style={styles.text}>Boo Zhan Yi</Text>
          <Text style={[styles.text, { marginTop: 10 }]}>U2005356/1</Text>
          <Text style={[styles.text, { marginTop: 10 }]}>
            University of Malaya
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 15,
            marginTop: 20,
          }}
        >
          Our App
        </Text>
        <View style={styles.appDesciptionContainer}>
          <Text style={styles.text}>
            MagicFingers is an app designed to provide a user-friendly app for
            children who enjoys expressing their creativity through drawing.
            With colorful graphics and easy-to-use features. Our app has some
            interesting features such as providing drawing platform,videos that
            designed to promote learning and creativity. Children art works also
            can easily saved in your phone with our app.
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
            },
            styles.backButton,
          ]}
          onPress={back}
        >
          <Text style={{ fontSize: 15, fontWeight: "800" }}>Back</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ourTeamContainer: {
    alignItems: "center",
    backgroundColor: "#D5F8F9",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  text: {
    fontSize: 15,
    textAlign: "justify",
    lineHeight: 25,
  },
  appDesciptionContainer: {
    alignItems: "center",
    backgroundColor: "#D5F8F9",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  backButton: {
    marginTop: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    width: "50%",
    height: "5%",
  },
});
