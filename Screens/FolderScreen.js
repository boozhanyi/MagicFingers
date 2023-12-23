import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { db, auth, deleteFolder } from "../Backend/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AddFolder from "../Components/AddFolder";

const FolderScreen = ({ navigation }) => {
  useEffect(() => {
    fetchAllFolder();
    setAddFolderModel(false);
    setFolderName("");
  }, []);

  const [folder, setFolder] = useState([]);
  const [addFolderModel, setAddFolderModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const originalFolder = useRef();

  const closeModel = () => {
    setAddFolderModel(false);
  };

  const openModel = () => {
    setAddFolderModel(true);
  };

  const openFolder = (folder) => {
    navigation.navigate("FolderDrawingsScreen", { Folder: folder });
  };

  const openDeleteModel = (folder) => {
    setSelectedFolder(folder);
    setDeleteModel(true);
  };

  const confirmDelete = async () => {
    await deleteFolder(selectedFolder);
    setDeleteModel(false);
  };

  const cancelDelete = () => {
    setDeleteModel(false);
  };

  const fetchAllFolder = () => {
    const user = auth.currentUser;
    const folderRef = collection(db, "Users", user.uid, "Folder");
    const folderQuery = query(folderRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(folderQuery, (snapshot) => {
      const folder = [];
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

          folder.push({
            FolderName: data.FolderName,
            FolderID: doc.id,
            FolderDate: formattedDate,
          });
        }
      });
      setFolder(folder);
      originalFolder.current = folder;
    });
    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const searchFolder = (text) => {
    setFolderName(text);

    if (text) {
      const filtered = originalFolder.current.filter((item) =>
        item.FolderName.toLowerCase().includes(text.toLowerCase())
      );
      setFolder(filtered);
    } else {
      setFolder(originalFolder.current);
    }
  };

  const back = () => {
    navigation.navigate("Profile");
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
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginTop: 30,
              opacity: addFolderModel ? 0.1 : 1,
            }}
          >
            <View className="flex flex-row mt-5 items-center justify-center">
              <Pressable onPress={back} className="w-1/3 justify-start ">
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Text className="w-1/2 justify-start text-xl font-bold ml-5 sm:text-3xl">
                Folder
              </Text>
            </View>
            <View className="flex flex-row w-11/12 mt-5 border-2 rounded-xl p-2 sm:pt-5 sm:pb-5">
              <Ionicons name="md-search-sharp" size={24} color="black" />
              <TextInput
                className="ml-3 w-4/5 sm:text-xl"
                placeholder="Enter your project name"
                onChangeText={(text) => searchFolder(text)}
                value={folderName}
              ></TextInput>
            </View>
            {folder.map((folder, index) => (
              <Pressable
                key={index}
                className="flex flex-row bg-slate-100 border rounded-2xl w-11/12 h-16 justify-between items-center pr-5 mt-5 sm:h-20 active:bg-white"
                onLongPress={() => openDeleteModel(folder.FolderID)}
              >
                <View className="flex flex-col">
                  <Text className="font-bold ml-4 sm:text-xl">
                    {folder.FolderName}
                  </Text>
                  <Text className="font-normal ml-4 mt-2 sm:text-md">
                    {folder.FolderDate}
                  </Text>
                </View>
                <Pressable onPress={() => openFolder(folder)}>
                  <MaterialIcons name="navigate-next" size={27} color="black" />
                </Pressable>
              </Pressable>
            ))}
            <View className="justify-center items-center mt-5 w-full">
              <Pressable
                onPress={openModel}
                className="bg-slate-200 border rounded-2xl w-1/2 h-12 justify-center items-center active:bg-white"
              >
                <Ionicons name="add" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          {deleteModel && (
            <Modal
              animationType="fade"
              transparent={true}
              visible={deleteModel}
            >
              <View className="flex-1 justify-center items-center">
                <View className="w-11/12 p-10 bg-cyan-50 justify-center items-center border rounded-xl">
                  <Text className="sm:text-2xl">
                    Are you sure you want to delete this folder?
                  </Text>
                  <Pressable
                    className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-white"
                    onPress={confirmDelete}
                  >
                    <Text className="text-black sm:text-xl">Confirm</Text>
                  </Pressable>
                  <Pressable
                    className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-white"
                    onPress={cancelDelete}
                  >
                    <Text className="text-black sm:text-xl">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}
        </KeyboardAwareScrollView>
        <StatusBar style="auto" />
        <AddFolder isVisible={addFolderModel} onClose={closeModel} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FolderScreen;
