import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image, Pressable, ImageBackground } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { db, logOut, auth } from "../Backend/Firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [userID, setUserId] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    const user = auth.currentUser;
    setUserId(user.uid);

    const drawingRef = doc(db, "Users", user.uid);

    const unsubscribe = onSnapshot(drawingRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        setProfileImage(data.ProfileImage);
        setUsername(data.Username);
      } else {
        console.log("Document does not exist.");
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const editProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const yourProject = () => {
    navigation.navigate("Home");
  };

  const moreAboutUs = () => {
    navigation.navigate("MoreAboutUsScreen");
  };

  const uploadVideo = () => {
    navigation.navigate("UploadVideoScreen");
  };

  const folder = () => {
    navigation.navigate("FolderScreen");
  };

  const LogOut = () => {
    logOut();
    navigation.navigate("LogInScreen");
  };

  return (
    <>
      {profileImage && (
        <ImageBackground
          source={require("../assets/Background.png")}
          style={{ flex: 1 }}
        >
          <SafeAreaView className="flex-1 items-center">
            <View className="overflow-hidden border rounded-full mt-10">
              <Image
                source={{ uri: profileImage }}
                className="w-24 h-24 sm:h-40 sm:w-40"
              />
            </View>
            <Text
              className="font-bold text-lg mt-5 sm:text-3
        xl"
            >
              {username}
            </Text>
            <Pressable
              className="items-center justify-center border rounded-xl p-1 w-2/5 bg-black mt-5"
              onPress={editProfile}
            >
              <Text className="font-bold text-white text-sm sm:text-2xl">
                Edit Profile
              </Text>
            </Pressable>
            <View className="flex flex-row items-center mt-5 w-11/12">
              <View className="flex-1 h-0.5 bg-black opacity-80" />
            </View>
            <View className="flex flex-row mt-6 w-11/12 justify-between items-center">
              <FontAwesome name="file" size={24} color="black" />
              <Text className="flex-1 text-base font-medium ml-4 sm:text-2xl">
                Your Project
              </Text>
              <Pressable onPress={yourProject}>
                <MaterialIcons name="navigate-next" size={27} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row mt-6 w-11/12 justify-between items-center">
              <Ionicons name="folder" size={24} color="black" />
              <Text className="flex-1 text-base font-medium ml-4 sm:text-2xl">
                Folder
              </Text>
              <Pressable onPress={folder}>
                <MaterialIcons name="navigate-next" size={27} color="black" />
              </Pressable>
            </View>
            <View className="flex flex-row mt-6 w-11/12 justify-between items-center">
              <Entypo name="info-with-circle" size={24} color="black" />
              <Text className="flex-1 text-base font-medium ml-4 sm:text-2xl">
                More About Us
              </Text>
              <Pressable onPress={moreAboutUs}>
                <MaterialIcons name="navigate-next" size={27} color="black" />
              </Pressable>
            </View>
            {userID === "LE5gtcFiv8feSDeYqnpBhjrA9f42" && (
              <View className="flex flex-row mt-6 w-11/12 justify-between items-center">
                <Entypo name="upload-to-cloud" size={24} color="black" />
                <Text className="flex-1 text-base font-medium ml-4 sm:text-2xl">
                  UploadVideo
                </Text>
                <Pressable onPress={uploadVideo}>
                  <MaterialIcons name="navigate-next" size={27} color="black" />
                </Pressable>
              </View>
            )}
            <View className="flex flex-row mt-6 w-11/12 justify-between items-center">
              <MaterialCommunityIcons name="logout" size={24} color="black" />
              <Text className="flex-1 text-base font-medium ml-4 sm:text-2xl">
                Log Out
              </Text>
              <Pressable onPress={LogOut}>
                <MaterialIcons name="navigate-next" size={27} color="black" />
              </Pressable>
            </View>
          </SafeAreaView>
        </ImageBackground>
      )}
    </>
  );
}
