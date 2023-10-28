import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  Pressable,
  Modal,
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
  }, []);

  const [folder, setFolder] = useState([]);
  const [addFolderModel, setAddFolderModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");

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
        folder.push({
          FolderName: data.FolderName,
          FolderID: doc.id,
        });
      });
      setFolder(folder);
    });
    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
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
            <Text className="font-bold text-2xl">Folder</Text>
            {folder.map((folder, index) => (
              <View
                key={index}
                className="flex flex-row bg-slate-100 border rounded-2xl w-11/12 h-14 justify-between items-center pr-5  mt-5"
              >
                <Text className="font-bold ml-4">{folder.FolderName}</Text>
                <Pressable
                  onPress={() => openFolder(folder)}
                  onLongPress={() => openDeleteModel(folder.FolderID)}
                >
                  <MaterialIcons name="navigate-next" size={27} color="black" />
                </Pressable>
              </View>
            ))}
            <View className="justify-center items-center mt-5 w-full">
              <Pressable
                onPress={openModel}
                className="bg-slate-200 border rounded-2xl w-1/2 h-12 justify-center items-center"
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
                    className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                    onPress={confirmDelete}
                  >
                    <Text className="text-white sm:text-xl">Confirm</Text>
                  </Pressable>
                  <Pressable
                    className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                    onPress={cancelDelete}
                  >
                    <Text className="text-white sm:text-xl">Cancel</Text>
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
