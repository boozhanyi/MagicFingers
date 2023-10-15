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
  const [isPressedButtonFavourite, setIsPressedButtonFavourite] =
    useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [imageProject, setImageProject] = useState([]);
  const [allDrawing, setAllDrawings] = useState([]);
  const [starDrawing, setStarDrawing] = useState([]);
  const originalDrawing = useRef([]);
  const allDrawingRef = useRef([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsPressedButtonAll(true);
      setIsPressedButtonFavourite(false);
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
    }
  }, [allDrawing]);

  useEffect(() => {
    if (isPressedButtonAll) {
      setImageProject(allDrawing);
      originalDrawing.current = allDrawing;
    }
  }, [isPressedButtonAll]);

  useEffect(() => {
    if (isPressedButtonFavourite) {
      setImageProject(starDrawing);
      setProjectName("");
    }
  }, [starDrawing]);

  const fetchAllDrawing = () => {
    const user = auth.currentUser;
    const drawingRef = collection(db, "Users", user.uid, "Drawings");
    const drawingQuery = query(drawingRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(drawingQuery, (snapshot) => {
      const drawings = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        drawings.push({
          DrawingId: doc.id,
          DrawingName: data.DrawingName,
          DrawingUrl: data.DrawingUrl,
        });
      });
      setAllDrawings(drawings);
      console.log(drawings);
      allDrawingRef.current = drawings;
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
        drawings.push({
          DrawingId: doc.id,
          DrawingName: data.DrawingName,
          DrawingUrl: data.DrawingUrl,
        });
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
    setEditProjectNameModalVisible(!isEditProjectNameModalVisible);
  };

  const onModalClose = () => {
    setEditProjectNameModalVisible(!isEditProjectNameModalVisible);
  };

  const pressedButtonAll = () => {
    setIsPressedButtonAll(true);
    setIsPressedButtonFavourite(false);
    setImageProject(allDrawing);
    originalDrawing.current = allDrawing;
  };

  const pressedButtonFavourite = async () => {
    setIsPressedButtonFavourite(true);
    setIsPressedButtonAll(false);
    setFunctionVisible(false);
    setImageProject(starDrawing);
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

  useEffect(() => {
    setFunctionVisible(selectedItems.length === 0 ? false : true);
  }, [selectedItems]);

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
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.header}>Your Project</Text>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="md-search-sharp"
                size={24}
                color="black"
              />
              <TextInput
                style={styles.projectNameInput}
                placeholder="Enter your project name"
                onChangeText={(text) => searchProject(text)}
                value={projectName}
              ></TextInput>
            </View>
            <View style={styles.filterContainer}>
              <Pressable
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isPressedButtonAll
                      ? "rgb(210, 230, 255)"
                      : "#DDFFFF",
                  },
                ]}
                onPress={pressedButtonAll}
              >
                <Text style={styles.filterText}>All</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isPressedButtonFavourite
                      ? "rgb(210, 230, 255)"
                      : "#DDFFFF",
                  },
                ]}
                onPress={pressedButtonFavourite}
              >
                <Text style={styles.filterText}>Favourite</Text>
              </Pressable>
            </View>
            <View
              style={{ marginTop: 5, alignSelf: "flex-start", marginLeft: 12 }}
            >
              <Text style={styles.text}>Recent Designs</Text>
            </View>
            <View style={styles.Linecontainer}>
              <View style={styles.line} />
            </View>
            <View style={styles.projectContainer}>
              {imageProject.map((item) => (
                <View
                  key={item.DrawingId}
                  style={{
                    width: "50%",
                    alignItems: "center",
                  }}
                >
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
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: 120, height: 120 }}>
                        <Image
                          source={{ uri: item.DrawingUrl }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="contain"
                        />
                      </View>
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontSize: 18, marginRight: 10 }}>
                        {item.DrawingName}
                      </Text>
                      <Pressable onPress={() => onModalAction(item)}>
                        <Feather name="edit" size={18} color="black" />
                      </Pressable>
                    </View>
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  searchContainer: {
    height: 40,
    width: "90%",
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#F1F1F1",
  },
  projectNameInput: {
    marginLeft: 10,
    width: "80%",
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 5,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  filterText: { fontSize: 10, fontWeight: "600" },
  filterButton: {
    width: "20%",
    height: 40,
    margin: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "left",
  },
  Linecontainer: {
    flexDirection: "row",
    width: "95%",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "black",
    opacity: 1,
  },
  projectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  project: {
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    padding: 10,
  },
  squareBox: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: 10,
  },
});

if (Dimensions.get("window").width >= 900) {
  styles.header = {
    ...styles.header,
    fontSize: 50,
  };
  styles.searchContainer = {
    ...styles.searchContainer,
    height: 50,
  };
  styles.filterButton = {
    ...styles.filterButton,
    height: 50,
  };
  styles.filterText = {
    ...styles.filterText,
    fontSize: 20,
    fontWeight: "500",
  };
  styles.text = {
    ...styles.text,
    fontSize: 30,
  };
}
