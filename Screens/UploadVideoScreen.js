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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Pressable
            style={{
              width: "90%",
              justifyContent: "flex-start",
            }}
            onPress={back}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View style={{ width: "100%", height: 200 }}>
            {videoSource && (
              <Video
                source={{ uri: videoSource }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
              />
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
              },
              styles.uploadVideoBtn,
            ]}
            onPress={selectVideo}
          >
            <Text style={styles.uploadVideoText}>Upload Video</Text>
          </Pressable>
          <View style={styles.videoInput}>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>Name</Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="Your Video Name"
              onChangeText={(text) => setVideoName(text)}
              value={videoName}
            />
            <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 10 }}>
              Keyword
            </Text>
            <TextInput
              style={styles.inputContainer}
              placeholder="Your Video Name"
              onChangeText={(text) => setKeyword(text)}
              value={keyword}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
              },
              styles.confirmBtn,
            ]}
            onPress={confirm}
          >
            <Text style={styles.uploadVideoText}>Confirm</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  uploadVideoBtn: {
    marginTop: 10,
    width: "60%",
    height: 50,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  uploadVideoText: {
    fontSize: 15,
    fontWeight: "800",
  },
  videoInput: {
    marginTop: 20,
    marginLeft: 30,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  inputContainer: {
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    marginTop: 10,
  },
  confirmBtn: {
    width: "60%",
    height: 50,
    marginTop: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});
