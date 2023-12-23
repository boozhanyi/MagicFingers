import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ImageBackground,
  Dimensions,
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

export default function HomeScreen() {
  const [projectName, setProjectName] = useState("");
  const [isEditProjectNameModalVisible, setEditProjectNameModalVisible] =
    useState(false);
  const [isFunctionVisible, setFunctionVisible] = useState(false);
  const [isPressedButtonAll, setIsPressedButtonAll] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [imageProject, setImageProject] = useState([]);
  const [allDrawing, setAllDrawings] = useState([]);
  const [starDrawing, setStarDrawing] = useState([]);
  const originalDrawing = useRef([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsPressedButtonAll(true);
      setProjectName("");
    }, [])
  );

  useEffect(() => {
    fetchAllDrawing();
    fetchStarDrawing();
  }, []);

  useEffect(() => {
    if (isPressedButtonAll) {
      setImageProject(allDrawing);
      setProjectName("");
      originalDrawing.current = allDrawing;
    }
  }, [allDrawing]);

  useEffect(() => {
    if (!isPressedButtonAll) {
      setImageProject(starDrawing);
      setProjectName("");
      originalDrawing.current = starDrawing;
    }
  }, [starDrawing]);

  useEffect(() => {
    setFunctionVisible(selectedItems.length === 0 ? false : true);
  }, [selectedItems]);

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
    setSelectedItems([]);
    setEditProjectNameModalVisible(!isEditProjectNameModalVisible);
  };

  const onModalClose = () => {
    setEditProjectNameModalVisible(!isEditProjectNameModalVisible);
  };

  const pressedButtonAll = () => {
    setIsPressedButtonAll(true);
    setImageProject(allDrawing);
    onFunctionClose();
    originalDrawing.current = allDrawing;
  };

  const pressedButtonFavourite = async () => {
    setIsPressedButtonAll(false);
    setImageProject(starDrawing);
    onFunctionClose();
    originalDrawing.current = starDrawing;
  };

  const onFunctionClose = () => {
    setFunctionVisible(false);
    setSelectedItems([]);
  };

  const selectProject = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (selectedItem) => selectedItem.DrawingId === item.DrawingId
      );
      const updatedSelectedItems = isSelected
        ? prevSelectedItems.filter(
            (selectedItem) => selectedItem.DrawingId !== item.DrawingId
          )
        : [...prevSelectedItems, item];
      return updatedSelectedItems;
    });
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
        <Text className="text-2xl font-bold mt-5 text-center sm:text-4xl sm:mt-10">
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
            <View className="flex flex-row mt-3 self-start ml-3 sm:ml-8">
              <Pressable
                className="w-1/5 h-10 rounded-full justify-center items-center border bg-cyan-100 active:bg-white"
                onPress={pressedButtonAll}
              >
                <Text className="text-xs sm:text-lg">All</Text>
              </Pressable>
              <Pressable
                className="w-2/6 h-10 rounded-full justify-center items-center border bg-cyan-100 ml-3 active:bg-white"
                onPress={pressedButtonFavourite}
              >
                <Text className="text-zs sm:text-lg">Favourite</Text>
              </Pressable>
            </View>
            <View className="mt-2 self-start ml-4 sm:ml-10">
              {isPressedButtonAll ? (
                <Text className="text-lg sm:text-2xl">All Designs</Text>
              ) : (
                <Text className="text-lg sm:text-2xl">Favourite Designs</Text>
              )}
            </View>
            <View className="flex flex-row w-11/12">
              <View className="flex-1 h-px opacity-100 bg-black" />
            </View>
            <View className="flex-1 flex-row flex-wrap">
              {imageProject.map((item) => (
                <View key={item.DrawingId} className="w-1/2 items-center">
                  <View
                    style={[
                      styles.project,
                      {
                        backgroundColor: selectedItems.find(
                          (selectedItem) =>
                            selectedItem.DrawingId === item.DrawingId
                        )
                          ? "#F3FEFF"
                          : "#EBEBEB",
                      },
                    ]}
                  >
                    <View className=" w-full items-end">
                      <Pressable onPress={() => selectProject(item)}>
                        <View
                          style={[
                            styles.squareBox,
                            {
                              backgroundColor: selectedItems.find(
                                (selectedItem) =>
                                  selectedItem.DrawingId === item.DrawingId
                              )
                                ? "#00B6FF"
                                : "white",
                            },
                          ]}
                        />
                      </Pressable>
                    </View>
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
                      <Text className="text-base mr-3 sm:text-2xl">
                        {item.DrawingName}
                      </Text>
                      <Pressable onPress={() => onModalAction(item)}>
                        <Feather name="edit" size={18} color="black" />
                      </Pressable>
                    </View>
                    <Text className="mt-2 font-normal">{item.TimeStamp}</Text>
                  </View>
                </View>
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
      <View style={{ alignItems: "center" }}>
        <ProjectFucntion
          isVisible={isFunctionVisible}
          onClose={onFunctionClose}
          projects={selectedItems}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  project: {
    width: "90%",
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    padding: 5,
  },
  squareBox: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: 10,
  },
});
