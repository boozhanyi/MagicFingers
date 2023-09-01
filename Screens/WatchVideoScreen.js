import { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Video } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { setStarVideo, setWatchHistory, storage } from "../Backend/Firebase";
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
    setHistory();
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
          <Video
            style={{ width: "100%", height: "50%" }}
            useNativeControls
            resizeMode="contain"
            source={{ uri: video.VideoUrl }}
            shouldPlay
            isLooping
          />

          <View style={styles.functionContainer}>
            <Text
              style={{
                fontWeight: "bold",
                flex: 1,
                marginLeft: 20,
                fontSize: 20,
              }}
            >
              {video.VideoName}
            </Text>

            <Pressable onPress={saveVideo}>
              <Entypo
                style={{ marginRight: 20 }}
                name="save"
                size={24}
                color="blue"
              />
            </Pressable>
            <Pressable onPress={starVideo}>
              <Entypo
                style={{ marginRight: 10 }}
                name="star"
                size={24}
                color="blue"
              />
            </Pressable>
          </View>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: 15,
                marginTop: 15,
                marginLeft: 20,
                textAlign: "left",
              }}
            >
              {video.Keyword}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
              },
              styles.startDesignBtn,
            ]}
            onPress={startDesign}
          >
            <Text>Start Your Own Design</Text>
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
