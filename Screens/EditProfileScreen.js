import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateProfile, auth, db } from "../Backend/Firebase";
import { getDoc, doc } from "firebase/firestore";

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = auth.currentUser;

    const drawingRef = doc(db, "Users", user.uid);
    const drawingDoc = await getDoc(drawingRef);

    setUsername(drawingDoc.data().Username);
    setProfileImage(drawingDoc.data().ProfileImage);
    setEmail(user.email);
  };

  const uploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const update = async () => {
    await updateProfile(profileImage, username, email);
    navigation.navigate("Profile");
  };

  const resetPass = () => {
    navigation.navigate("ResetPassword", { state: 1 });
  };

  const back = () => {
    navigation.navigate("Profile");
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
          <View style={styles.inner}>
            <Pressable
              style={{
                width: "90%",
                justifyContent: "flex-start",
              }}
              onPress={back}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#C3BFBF" : "black",
                },
                styles.uploadPhotoContainer,
              ]}
              onPress={uploadPhoto}
            >
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
              <FontAwesome name="upload" size={24} color="white" />
            </Pressable>
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>Username</Text>
              <TextInput
                style={styles.textInputContainer}
                onChangeText={(text) => setUsername(text)}
                value={username}
              ></TextInput>
              <Text style={styles.profileText}>Email</Text>
              <TextInput
                style={styles.textInputContainer}
                onChangeText={(text) => setEmail(text)}
                value={email}
              ></TextInput>
            </View>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                },
                styles.updateContainer,
              ]}
              onPress={update}
            >
              <Text style={styles.updateText}>Update</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                },
                styles.updateContainer,
              ]}
              onPress={resetPass}
            >
              <Text style={styles.updateText}>Reset Password</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    overflow: "hidden",
    borderRadius: 50,
    borderWidth: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  uploadPhotoContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 10,
    padding: 8,
    elevation: 10,
  },
  uploadPhotoText: {
    marginRight: 15,
    color: "white",
  },
  profileContainer: {
    width: "90%",
    justifyContent: "flex-start",
  },
  profileText: {
    fontSize: 15,
    marginTop: 20,
  },
  textInputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    height: 40,
    padding: 10,
  },
  updateContainer: {
    marginTop: 40,
    width: "70%",
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  updateText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
