import { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Video } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { setStarVideo, setWatchHistory } from "../Backend/Firebase";
import { Ionicons } from "@expo/vector-icons";

export default function WatchVideoScreen({ navigation, route }) {
  const video = route.params?.video;

  const startDesign = () => {
    navigation.navigate("DrawingScreen");
  };

  useEffect(() => {
    const setHistory = async () => {
      await setWatchHistory(video);
    };
    //setHistory();
  }, []);

  const saveVideo = async () => {
    try {
      Alert.alert("Downloading Video");
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed!");
      }

      const fileUri = FileSystem.cacheDirectory + video.VideoName + ".mp4";
      const downloadResumable = FileSystem.createDownloadResumable(
        video.VideoUrl,
        fileUri,
        {},
        false
      );
      const { uri } = await downloadResumable.downloadAsync(null, {
        shouldCache: false,
      });

      await MediaLibrary.createAssetAsync(uri);

      Alert.alert("Download Complete");
    } catch (error) {
      console.error("Error downloading and saving video:", error);
    }
  };

  const starVideo = async () => {
    await setStarVideo(video);
  };

  const back = () => {
    navigation.navigate("VideoScreen");
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center">
          <Pressable className="w-11/12 justify-start" onPress={back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Video
            className="w-full h-1/2"
            useNativeControls
            resizeMode="contain"
            source={{ uri: video.VideoUrl }}
            shouldPlay
            isLooping
          />

          <View className="flex flex-row items-center justify-between mt-4">
            <Text className="font-bold flex-1 ml-5 text-xl sm:text-4xl">
              {video.VideoName}
            </Text>
            <View className="flex flex-row gap-x-2 mr-2 sm:gap-x-10">
              <Pressable onPress={saveVideo}>
                <Entypo className="mr-5" name="save" size={24} color="blue" />
              </Pressable>
              <Pressable onPress={starVideo}>
                <Entypo name="star" size={24} color="blue" />
              </Pressable>
            </View>
          </View>
          <View className="w-full">
            <Text className="text-base mt-5 ml-5 text-left sm:text-3xl">
              {video.Keyword}
            </Text>
          </View>
          <Pressable
            className="mt-5 w-4/5 justify-center items-center bg-cyan-50 rounded-xl h-12 p-2 shadow-xl shadow-neutral-950 sm:h-20"
            onPress={startDesign}
          >
            <Text className="sm:text-xl">Start Your Own Design</Text>
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
  videoContainer: {
    width: "100%",
    height: 250,
  },
  functionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  startDesignBtn: {
    marginTop: 20,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    elevation: 20,
  },
});
