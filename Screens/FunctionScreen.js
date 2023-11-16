import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../Backend/Firebase";
import { onSnapshot, doc } from "firebase/firestore";
import SetProjectName from "../Components/SetProjectNameModel";
import { useFocusEffect } from "@react-navigation/native";

export default function FunctionScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [nameModalVisible, setNameModal] = useState(false);
  const [image, setImage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      setNameModal(false);
      setImage(null);
    }, [])
  );

  const fetchData = () => {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.uid);

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        setProfileImage(data.ProfileImage);
      } else {
        console.log("Document does not exist.");
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const onOpenImportPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNameModal(true);
    } else {
      alert("You did not select any image.");
    }
  };

  const onOpenDesign = () => {
    setNameModal(true);
  };

  const onOpenVideo = () => {
    navigation.navigate("VideoScreen");
  };

  const onPressProfile = () => {
    navigation.navigate("Profile");
  };

  const onClose = () => {
    setNameModal(false);
  };

  return (
    <>
      {profileImage && (
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
              enabled={false}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                style={[
                  styles.container,
                  { opacity: nameModalVisible ? 0.1 : 1 },
                ]}
              >
                <View className="flex flex-row w-full items-center justify-end mb-5">
                  <Pressable
                    className="mr-5 overflow-hidden border rounded-full"
                    onPress={onPressProfile}
                  >
                    <Image
                      source={{ uri: profileImage }}
                      className="w-14 h-14 sm:w-20 sm:h-20"
                    />
                  </Pressable>
                </View>
                <Text className="text-center text-3xl font-bold italic sm:text-6xl">
                  EXPLORE
                </Text>
                <Pressable
                  className="bg-cyan-50 w-11/12 h-24 rounded-2xl mt-10 p-2 justify-center items-center border sm:h-32"
                  onPress={onOpenDesign}
                >
                  <Text className="font-medium text-xl mb-2 sm:text-3xl">
                    Start Your Design
                  </Text>
                  <Text className="font-light text-center sm:text-lg">
                    Various tools to help you
                  </Text>
                </Pressable>
                <Pressable
                  className="bg-cyan-50 w-11/12 h-26 rounded-2xl mt-5 p-4 justify-center items-center border sm:h-32"
                  onPress={onOpenVideo}
                >
                  <Text className="font-medium text-xl mb-2 sm:text-3xl">
                    Video
                  </Text>
                  <Text className="font-light text-center gap-2 sm:text-lg">
                    Step-by-step drawing instructions for kids of all ages.
                    Large collection of drawing tutorials featuring various
                    topics .
                  </Text>
                </Pressable>
                <Pressable
                  className="bg-cyan-50 w-11/12 h-24 rounded-2xl mt-5 p-2 justify-center items-center border sm:h-32"
                  onPress={onOpenImportPicture}
                >
                  <Text className="font-medium text-xl mb-2 sm:text-3xl">
                    Import and edit your picture
                  </Text>
                  <Text className="font-light text-center sm:text-lg">
                    Import your picture and you can edit on it now
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
          <SetProjectName
            isVisible={nameModalVisible}
            onClose={onClose}
            navigation={navigation}
            image={image}
          />
        </ImageBackground>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
