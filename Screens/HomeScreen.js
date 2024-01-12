import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import EditProjectName from "../Components/EditProjectNameModel";
import ProjectFucntion from "../Components/Function";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Backend/Firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [projectName, setProjectName] = useState("");
  const [isEditProjectNameModalVisible, setEditProjectNameModalVisible] =
    useState(false);
  const [isFunctionVisible, setFunctionVisible] = useState(false);
  const [isPressedButtonAll, setIsPressedButtonAll] = useState(true);
  const [isPressedButtonFavourite, setIsPressedButtonFavourite] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageProject, setImageProject] = useState([]);
  const [allDrawing, setAllDrawings] = useState([]);
  const [starDrawing, setStarDrawing] = useState([]);
  const originalDrawing = useRef([]);
  const [folder, setFolder] = useState([]);
  const [isPressedFolder, setIsPressedFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setIsPressedButtonAll(true);
      setProjectName("");
      setFunctionVisible(false);
      setEditProjectNameModalVisible(false);
      setIsPressedFolder(false);
      setIsPressedButtonFavourite(false);
      setSelectedFolder(null);
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allDrawingPromise = fetchAllDrawing();
        const starDrawingPromise = fetchStarDrawing();
        const folderPromise = fetchFolder();

        await Promise.all([
          allDrawingPromise,
          starDrawingPromise,
          folderPromise,
        ]);

        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isPressedButtonAll) {
      setImageProject(allDrawing);
      setProjectName("");
      originalDrawing.current = allDrawing;
    }
  }, [allDrawing]);

  useEffect(() => {
    if (isPressedButtonFavourite) {
      setImageProject(starDrawing);
      setProjectName("");
      originalDrawing.current = starDrawing;
    }
  }, [starDrawing]);

  useEffect(() => {
    if (isPressedFolder && folder && selectedFolder) {
      folder.forEach((folder) => {
        if (selectedFolder.FolderId === folder.FolderId) {
          setImageProject(folder.drawings);
          setSelectedFolder(folder);
          originalDrawing.current = folder.drawings;
        }
      });
    }
  }, [folder]);

  useEffect(() => {
    if (isPressedButtonAll) {
      setImageProject(allDrawing);
      setProjectName("");
      originalDrawing.current = allDrawing;
    }
  }, [isPressedButtonAll]);

  const fetchAllDrawing = () => {
    const user = auth.currentUser;
    const drawingRef = collection(db, "Users", user.uid, "Drawings");
    const drawingQuery = query(drawingRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(drawingQuery, (snapshot) => {
      const drawings = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.TimeStamp) {
          const TimeStamp = doc.data().TimeStamp.toDate();
          const dateObject = new Date(TimeStamp);

          const year = dateObject.getUTCFullYear();
          const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
          const day = dateObject.getUTCDate();

          const formattedDate = `${year}-${month
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

          drawings.push({
            DrawingId: doc.id,
            DrawingName: data.DrawingName,
            DrawingUrl: data.DrawingUrl,
            TimeStamp: formattedDate,
          });
        }
      });

      setAllDrawings(drawings);
    });
    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const fetchStarDrawing = () => {
    const user = auth.currentUser;
    const drawingRef = collection(db, "Users", user.uid, "StarDrawings");
    const drawingQuery = query(drawingRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(drawingQuery, (snapshot) => {
      const drawings = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.TimeStamp) {
          const TimeStamp = doc.data().TimeStamp.toDate();
          const dateObject = new Date(TimeStamp);

          const year = dateObject.getUTCFullYear();
          const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
          const day = dateObject.getUTCDate();

          const formattedDate = `${year}-${month
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

          drawings.push({
            DrawingId: doc.id,
            DrawingName: data.DrawingName,
            DrawingUrl: data.DrawingUrl,
            TimeStamp: formattedDate,
          });
        }
      });
      setStarDrawing(drawings);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const fetchFolder = () => {
    const user = auth.currentUser;
    const folderRef = collection(db, "Users", user.uid, "Folder");
    const folderQuery = query(folderRef, orderBy("TimeStamp"));

    const unsubscribe = onSnapshot(folderQuery, (snapshot) => {
      const folderArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data().Drawings.map((drawing) => {
          if (drawing.TimeStamp) {
            const TimeStamp = drawing.TimeStamp.toDate();
            const dateObject = new Date(TimeStamp);

            const year = dateObject.getUTCFullYear();
            const month = dateObject.getUTCMonth() + 1;
            const day = dateObject.getUTCDate();

            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            return {
              ...drawing,
              TimeStamp: formattedDate,
            };
          }
        });
        folderArray.push({
          FolderId: doc.id,
          FolderName: doc.data().FolderName,
          drawings: data,
        });
      });
      setFolder(folderArray);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const searchProject = (text) => {
    setProjectName(text);
    if (text) {
      const filtered = originalDrawing.current.filter((item) =>
        item.DrawingName.toLowerCase().includes(text.toLowerCase())
      );
      setImageProject(filtered);
    } else {
      setImageProject(originalDrawing.current);
    }
  };

  const onModalAction = (item) => {
    setSelectedProject(item);
    setFunctionVisible(false);
    setEditProjectNameModalVisible(true);
  };

  const onModalClose = () => {
    setEditProjectNameModalVisible(false);
    setFunctionVisible(false);
    setSelectedProject(null);
    setSelectedFolder(null);
  };

  const pressedButtonAll = () => {
    setIsPressedButtonAll(true);
    setIsPressedButtonFavourite(false);
    setIsPressedFolder(false);
    setImageProject(allDrawing);
    setSelectedFolder(null);
    originalDrawing.current = allDrawing;
  };

  const pressedButtonFavourite = async () => {
    setIsPressedButtonAll(false);
    setIsPressedButtonFavourite(true);
    setIsPressedFolder(false);
    setImageProject(starDrawing);
    setSelectedFolder(null);
    originalDrawing.current = starDrawing;
  };

  const pressedButtonFolder = (folder) => {
    setIsPressedFolder(true);
    setIsPressedButtonAll(false);
    setIsPressedButtonFavourite(false);
    setImageProject(folder.drawings);
    setFolderName(folder.FolderName);
    setSelectedFolder(folder);
    originalDrawing.current = folder.drawings;
  };

  const selectProject = (item) => {
    setSelectedProject(item);
    setFunctionVisible(true);
  };

  const editDrawing = (drawing) => {
    navigation.navigate("DrawingScreen", {
      Name: drawing.DrawingName,
      project: drawing.DrawingId,
      image: drawing.DrawingUrl,
    });
  };

  return (
    <>
      {isDataFetched && (
        <ImageBackground
          source={require("../assets/Background.png")}
          style={{
            flex: 1,
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
            opacity:
              isFunctionVisible || isEditProjectNameModalVisible ? 0.3 : 1,
          }}
          resizeMode="cover"
        >
          <SafeAreaView className="flex-1">
            <Text className="text-2xl font-bold mt-5 text-center sm:text-5xl sm:mt-10">
              Your Project
            </Text>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 justify-center items-center">
                <View className="flex flex-row w-11/12 mt-5 border-2 rounded-xl p-2 sm:pt-5 sm:pb-5">
                  <Ionicons name="md-search-sharp" size={24} color="black" />
                  <TextInput
                    className="ml-3 w-4/5 sm:text-xl"
                    placeholder="Enter your project name"
                    onChangeText={(text) => searchProject(text)}
                    value={projectName}
                  ></TextInput>
                </View>
                <View className="h-14 w-full sm:h-20">
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      maxWidth: "auto",
                      height: "auto",
                      marginTop: 10,
                      marginLeft: 15,
                      marginRight: 15,
                      padding: 5,
                      paddingRight: 20,
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  >
                    <Pressable
                      className="w-auto pr-6 pl-6 h-10 rounded-full justify-center items-center border bg-cyan-100 active:bg-white sm:h-14"
                      onPress={pressedButtonAll}
                    >
                      <Text className="text-xs sm:text-2xl">All</Text>
                    </Pressable>
                    <Pressable
                      className="w-auto pr-6 pl-6 h-10 rounded-full justify-center items-center border bg-cyan-100 ml-3 active:bg-white sm:h-14"
                      onPress={pressedButtonFavourite}
                    >
                      <Text className="text-xs sm:text-2xl">Favourite</Text>
                    </Pressable>
                    {folder &&
                      folder.map((item, index) => (
                        <Pressable
                          key={index}
                          className="w-auto pr-6 pl-6 h-10 rounded-full justify-center items-center border bg-cyan-100 ml-3 active:bg-white sm:h-14"
                          onPress={() => pressedButtonFolder(item)}
                        >
                          <Text className="text-xs sm:text-2xl">
                            {item.FolderName}
                          </Text>
                        </Pressable>
                      ))}
                  </ScrollView>
                </View>
                <View className="mt-2 self-start ml-4 sm:ml-10 sm:mt-5">
                  {isPressedButtonAll && (
                    <Text className="text-lg sm:text-3xl">All Designs</Text>
                  )}
                  {isPressedButtonFavourite && (
                    <Text className="text-lg sm:text-3xl">
                      Favourite Designs
                    </Text>
                  )}
                  {isPressedFolder && (
                    <Text className="text-lg sm:text-3xl">{folderName}</Text>
                  )}
                </View>
                <View className="flex flex-row w-11/12">
                  <View className="flex-1 h-px opacity-100 bg-black" />
                </View>
                <View className="flex-1 flex-row flex-wrap">
                  {imageProject.map((item, index) => (
                    <Pressable
                      key={index}
                      className="w-1/2 items-center"
                      onLongPress={() => selectProject(item)}
                      onPress={() => editDrawing(item)}
                    >
                      <View className="w-11/12 border rounded-xl mt-5 items-center p-3 pt-5 bg-slate-200">
                        <View className="flex flex-row">
                          <View className="w-28 h-28 sm:w-56 sm:h-56">
                            <Image
                              source={{ uri: item.DrawingUrl }}
                              className="w-full h-full"
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                        <View className="flex flex-row items-center mt-2">
                          <Text className="text-base mr-3 sm:text-2xl text-center">
                            {item.DrawingName}
                          </Text>
                          {!isPressedFolder && (
                            <Pressable onPress={() => onModalAction(item)}>
                              <Feather name="edit" size={18} color="black" />
                            </Pressable>
                          )}
                        </View>
                        <Text className="mt-2 font-normal sm:text-2xl">
                          {item.TimeStamp}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </KeyboardAwareScrollView>
            <StatusBar style="auto" />
          </SafeAreaView>
          <EditProjectName
            isVisible={isEditProjectNameModalVisible}
            onClose={onModalClose}
            project={selectedProject}
          />
          <ProjectFucntion
            isVisible={isFunctionVisible}
            onClose={onModalClose}
            drawing={selectedProject}
            folder={selectedFolder}
          />
        </ImageBackground>
      )}
    </>
  );
}
