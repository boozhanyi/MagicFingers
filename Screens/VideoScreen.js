import React, { useEffect, useRef, useState } from "react";
import { Text, View, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Backend/Firebase";

export default function VideoScreen({ navigation }) {
  const [video, setVideo] = useState([]);
  const [videoName, setVideoName] = useState("");
  const isPressedButtonHistory = useRef(false);
  const isPressedButtonStar = useRef(false);
  const isPressedButtonAll = useRef(true);
  const [historyVideo, setHistoryVideo] = useState([]);
  const [starVideo, setStarVideo] = useState([]);
  const [allVideo, setAllVideo] = useState([]);
  const originalVideo = useRef([]);

  useEffect(() => {
    fetchVideo();
    fetchHistoryVideo();
    fetchStarVideo();
  }, []);

  useEffect(() => {
    if (isPressedButtonAll.current) {
      setVideo(allVideo);
      originalVideo.current = allVideo;
    }
  }, [allVideo]);

  useEffect(() => {
    if (isPressedButtonHistory.current) {
      setVideo(historyVideo);
      originalVideo.current = historyVideo;
    }
  }, [historyVideo]);

  useEffect(() => {
    if (isPressedButtonStar.current) {
      setVideo(starVideo);
      originalVideo.current = starVideo;
    }
  }, [starVideo]);

  const fetchHistoryVideo = () => {
    const user = auth.currentUser;
    const videoRef = collection(db, "Users", user.uid, "VideoHistory");
    const videoQuery = query(videoRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(videoQuery, (snapshot) => {
      const videos = [];
      snapshot.forEach((video) => {
        videos.push({
          id: video.id,
          VideoName: video.data().VideoName,
          Keyword: video.data().Keyword,
          VideoUrl: video.data().VideoUrl,
        });
      });

      setHistoryVideo(videos);
    });

    return () => {
      unsubscribe(); // Unsubscribe from history video listener
    };
  };

  const fetchStarVideo = () => {
    const user = auth.currentUser;
    const videoRef = collection(db, "Users", user.uid, "StarVideo");
    const videoQuery = query(videoRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(videoQuery, (snapshot) => {
      const videos = [];
      snapshot.forEach((video) => {
        videos.push({
          id: video.id,
          VideoName: video.data().VideoName,
          Keyword: video.data().Keyword,
          VideoUrl: video.data().VideoUrl,
        });
      });

      setStarVideo(videos);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const fetchVideo = async () => {
    const videoRef = collection(db, "Video");
    const videoQuery = query(videoRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(videoQuery, (snapshot) => {
      const videos = [];
      snapshot.forEach((video) => {
        videos.push({
          id: video.id,
          VideoName: video.data().VideoName,
          Keyword: video.data().Keyword,

          VideoUrl: video.data().VideoUrl,
        });
      });

      setAllVideo(videos);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const search = (text) => {
    setVideoName(text);
    if (text !== "") {
      console.log(video);
      const filtered = originalVideo.current.filter((item) =>
        item.VideoName.toLowerCase().includes(text.toLowerCase())
      );
      setVideo(filtered);
    } else {
      setVideo(originalVideo.current);
    }
  };

  const selectedVideo = (videoSource) => {
    navigation.navigate("WatchVideoScreen", { video: videoSource });
  };

  const pressedButtonHistory = () => {
    isPressedButtonHistory.current = true;
    isPressedButtonAll.current = false;
    isPressedButtonStar.current = false;
    setVideo(historyVideo);
    originalVideo.current = historyVideo;
  };

  const pressedButtonStar = () => {
    isPressedButtonAll.current = false;
    isPressedButtonHistory.current = false;
    isPressedButtonStar.current = true;
    setVideo(starVideo);
    originalVideo.current = starVideo;
  };

  const pressedButtonAll = () => {
    isPressedButtonAll.current = true;
    isPressedButtonHistory.current = false;
    isPressedButtonStar.current = false;
    setVideo(allVideo);
    originalVideo.current = allVideo;
  };

  const back = () => {
    navigation.navigate("Function");
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center sm:mt-10">
          <Pressable className="w-11/12 justify-start mt-5" onPress={back}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="font-bold sm:text-3xl">How To Draw For Kids</Text>
          <Text className="text-center mt-3 font-extralight mr-2 ml-2 sm:text-lg">
            Here is where you'll find every single on of our how to draw
            lessons! It's a massive drawing library! You'll find lessons for
            young and old kids. You'll find everything from how to draw cupcakes
            to how to draw sharks. So, what are you waiting for? Grab a marker
            and follow along with us.
          </Text>
          <View className="flex flex-row items-center w-11/12 border mt-5 rounded-xl p-2 sm:h-16">
            <Ionicons name="md-search-sharp" size={24} color="black" />
            <TextInput
              className="flex-1 ml-2 text-sm sm:text-lg"
              placeholder="Search your video name here"
              onChangeText={(text) => search(text)}
              value={videoName}
            ></TextInput>
          </View>
          <View className="flex flex-row mt-2 self-start ml-3">
            <Pressable
              className="bg-cyan-50 active:bg-cyan-100 w-1/5 rounded-xl justify-center items-center h-10 sm:h-14 "
              onPress={pressedButtonAll}
            >
              <Text className="font-semibold text-xs sm:text-lg">All</Text>
            </Pressable>
            <Pressable
              className="bg-cyan-50 active:bg-cyan-100 w-1/5 rounded-xl justify-center items-center h-10 ml-2 sm:h-14"
              onPress={pressedButtonHistory}
            >
              <Text className="font-semibold text-xs sm:text-lg">History</Text>
            </Pressable>
            <Pressable
              className="bg-cyan-50 active:bg-cyan-100 w-2/5 rounded-xl justify-center items-center h-10 ml-2 sm:h-14"
              onPress={pressedButtonStar}
            >
              <Text className="font-semibold text-xs sm:text-lg">
                Stared Video
              </Text>
            </Pressable>
          </View>
          {/* <View className="w-full mt-5">
            {video.map((item) => (
              <View
                className="w-full justify-center items-center"
                key={item.id}
              >
                <Pressable
                  className="w-11/12 h-20 bg-black rounded-lg mt-3 sm:h-32"
                  onPress={() => selectedVideo(item)}
                >
                  <Video
                    className="w-full h-full"
                    useNativeControls
                    resizeMode="contain"
                    source={{ uri: item.VideoUrl }}
                    shouldPlay
                    volume={0}
                    isLooping
                  />
                </Pressable>
                <Text className="font-medium text-base mt-5 text-center sm:text-2xl">
                  {item.VideoName}
                </Text>
              </View>
            ))}
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
