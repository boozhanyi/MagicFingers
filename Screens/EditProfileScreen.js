import {
  View,
  TextInput,
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
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center">
            <Pressable className="w-11/12 justify-start" onPress={back}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
            <View className="overflow-hidden border rounded-full mt-10">
              <Image source={{ uri: profileImage }} className="w-24 h-24" />
            </View>
            <Pressable
              className="flex flex-row mt-5 border rounded-lg p-2 gap-x-2 bg-black justify-center items-center"
              onPress={uploadPhoto}
            >
              <Text className="text-white">Upload Photo</Text>
              <FontAwesome name="upload" size={24} color="white" />
            </Pressable>
            <View className="w-11/12 justify-start mt-5">
              <Text className="text-sm">Username</Text>
              <TextInput
                className="border rounded-lg mt-2 h-10 p-2"
                onChangeText={(text) => setUsername(text)}
                value={username}
              ></TextInput>
              <Text className="text-sm mt-5">Email</Text>
              <TextInput
                className="border rounded-lg mt-2 h-10 p-2"
                onChangeText={(text) => setEmail(text)}
                value={email}
              ></TextInput>
            </View>
            <Pressable
              className="w-3/5 h-12 rounded-full bg-cyan-50  mt-5 justify-center items-center shadow-lg shadow-neutral-950"
              onPress={update}
            >
              <Text className="font-bold text-base">Update</Text>
            </Pressable>
            <Pressable
              className="w-3/5 h-12 rounded-full bg-cyan-50  mt-5 justify-center items-center shadow-lg shadow-neutral-950"
              onPress={resetPass}
            >
              <Text className="font-bold text-base">Reset Password</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}
