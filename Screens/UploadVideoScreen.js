import * as React from "react";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { uploadVideo } from "../Backend/Firebase";
import { Ionicons } from "@expo/vector-icons";

export default function UploadVideoScreen({ navigation }) {
  const [videoName, setVideoName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [videoSource, setVideoSource] = useState(null);

  const confirm = async () => {
    await uploadVideo(videoName, keyword, videoSource);
    navigation.navigate("Profile");
  };

  const selectVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoSource(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const back = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center">
          <Pressable className="w-11/12 justify-start" onPress={back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="w-full h-1/4 justify-center items-center">
            {videoSource && (
              <Video
                source={{ uri: videoSource }}
                className="w-full h-full"
                useNativeControls
                resizeMode="contain"
              />
            )}
            {!videoSource && (
              <View className="w-2/4 h-full items-center justify-center bg-slate-200">
                <Text className="font-bold text-xl ">Video</Text>
              </View>
            )}
          </View>
          <Pressable
            className="w-3/5 mt-5 justify-center items-center bg-cyan-50 shadow-xl shadow-neutral-950 h-10 rounded-xl"
            onPress={selectVideo}
          >
            <Text className="text-base font-bold">Upload Video</Text>
          </Pressable>
          <View className="w-full justify-start items-start mt-5">
            <Text className="text-sm font-bold ml-5">Name</Text>
            <TextInput
              className="w-11/12 ml-5 border rounded-lg h-10 mt-3 p-2"
              placeholder="Your Video Name"
              onChangeText={(text) => setVideoName(text)}
              value={videoName}
            />
            <Text className="text-sm font-bold ml-5 mt-3">Keyword</Text>
            <TextInput
              className="w-11/12 ml-5 border rounded-lg h-10 mt-3 p-2"
              placeholder="Your Video Name"
              onChangeText={(text) => setKeyword(text)}
              value={keyword}
            />
          </View>
          <Pressable
            className="bg-cyan-50 mt-10 w-1/2 h-10 justify-center items-center rounded-xl shadow-lg shadow-neutral-950"
            onPress={confirm}
          >
            <Text className="text-base font-bold">Confirm</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
