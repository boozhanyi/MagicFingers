import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Text,
  Pressable,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { db, auth, deleteFolder, editFolderName } from "../Backend/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AddFolder from "../Components/AddFolder";

const FolderScreen = ({ navigation }) => {
  useEffect(() => {
    fetchAllFolder();
    setAddFolderModel(false);
    setEditNameModel(false);
    setFolderName("");
  }, []);

  const [folder, setFolder] = useState([]);
  const [addFolderModel, setAddFolderModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [editNameModel, setEditNameModel] = useState(false);
  const [functionModel, setFunctonModel] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderName, setFolderName] = useState("");
  const originalFolder = useRef();
  const [newFolderName, setNewFolderName] = useState("");

  const closeModel = () => {
    setAddFolderModel(false);
  };

  const openModel = () => {
    setAddFolderModel(true);
  };

  const openFolder = (folder) => {
    navigation.navigate("FolderDrawingsScreen", { Folder: folder });
  };

  const openFunctionModel = (folder) => {
    setSelectedFolder(folder.FolderId);
    setNewFolderName(folder.FolderName);
    setFunctonModel(true);
  };

  const openDeleteModel = () => {
    setDeleteModel(true);
    setFunctonModel(false);
  };

  const openEditNameModel = () => {
    setFunctonModel(false);
    setEditNameModel(true);
  };

  const confirmDelete = async () => {
    await deleteFolder(selectedFolder);
    setDeleteModel(false);
    setFunctonModel(false);
  };

  const cancelDelete = () => {
    setDeleteModel(false);
    setFunctonModel(true);
  };

  const updateFolderName = async () => {
    await editFolderName(selectedFolder, newFolderName);
    setEditNameModel(false);
    setFunctonModel(false);
  };

  const onClose = () => {
    setEditNameModel(false);
    setFunctonModel(false);
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
            FolderId: doc.id,
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
        opacity: functionModel || deleteModel || editNameModel ? 0.3 : 1,
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
            <View className="justify-center items-center mt-5 w-full">
              <Pressable
                onPress={openModel}
                className="flex flex-row bg-slate-200 border rounded-2xl w-11/12 h-12 justify-center items-center active:bg-white sm:h-16"
              >
                <Text className="font-bold mr-5 sm:text-xl">Add a folder</Text>
                <Ionicons name="add" size={20} color="black" />
              </Pressable>
            </View>
            {folder.map((folder, index) => (
              <Pressable
                key={index}
                className="flex flex-row bg-slate-100 border rounded-2xl w-11/12 h-16 justify-between items-center pr-5 mt-5 sm:h-24 active:bg-white"
                onLongPress={() => openFunctionModel(folder)}
                onPress={() => openFolder(folder)}
              >
                <View className="flex flex-col">
                  <Text className="font-bold ml-4 sm:text-2xl">
                    {folder.FolderName}
                  </Text>
                  <Text className="font-normal ml-4 mt-2 sm:text-lg">
                    {folder.FolderDate}
                  </Text>
                </View>
                <MaterialIcons name="navigate-next" size={27} color="black" />
              </Pressable>
            ))}
          </View>
          {functionModel && (
            <Modal animationType="fade" transparent={true}>
              <View className="flex-1 justify-center items-center">
                <View className="w-11/12 p-10 bg-cyan-50 justify-center items-center border rounded-xl">
                  <Pressable
                    className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20"
                    onPress={openDeleteModel}
                  >
                    <Image
                      className="w-7 h-7 sm:h-14 sm:w-14"
                      source={require("../assets/Delete.png")}
                    />
                    <Text className="text-black sm:text-xl">Delete Folder</Text>
                  </Pressable>
                  <Pressable
                    className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20 mt-5"
                    onPress={openEditNameModel}
                  >
                    <Image
                      className="w-7 h-7 sm:h-14 sm:w-14"
                      source={require("../assets/Edit.png")}
                    />
                    <Text className="text-black sm:text-xl">
                      Edit Folder Name
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20 mt-5"
                    onPress={onClose}
                  >
                    <Image
                      className="w-7 h-7 sm:h-14 sm:w-14"
                      source={require("../assets/Close.png")}
                    />
                    <Text className="text-black sm:text-xl">Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}
          {deleteModel && (
            <Modal animationType="fade" transparent={true}>
              <View className="flex-1 justify-center items-center">
                <View className="w-11/12 p-10 bg-cyan-50 justify-center items-center border rounded-xl">
                  <Text className="text-black text-md font-bold sm:text-xl mb-10">
                    Do you want to delete the folder
                  </Text>
                  <Pressable
                    className="flex flex-row w-full h-10 justify-center items-center space-x-5 border rounded-xl bg-slate-200 active:bg-white sm:h-20"
                    onPress={confirmDelete}
                  >
                    <Text className="text-black sm:text-xl">Delete</Text>
                  </Pressable>
                  <Pressable
                    className="flex flex-row w-full h-10 justify-center items-center space-x-5 border rounded-xl bg-slate-200 active:bg-white sm:h-20 mt-5"
                    onPress={cancelDelete}
                  >
                    <Text className="text-black  sm:text-xl">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}
          {editNameModel && (
            <Modal
              animationType="fade"
              transparent={true}
              onRequestClose={onClose}
            >
              <View className="flex-1 justify-center items-center">
                <View className="w-11/12 p-10 bg-cyan-50 shadow-xl shadow-slate-950 items-center rounded-xl sm:w-1/2">
                  <Text className="text-base font-bold sm:text-2xl">
                    Enter New Folder Name
                  </Text>
                  <TextInput
                    className="w-11/12 border rounded-xl mt-5 p-2 sm:text-2xl sm:p-3"
                    onChangeText={(text) => setNewFolderName(text)}
                    value={newFolderName}
                  />
                  <Pressable
                    className="bg-black w-2/4 p-2 mt-5 justify-center items-center rounded-xl active:bg-slate-300"
                    onPress={updateFolderName}
                  >
                    <Text className="font-bold text-sm sm:text-xl text-white">
                      Confirm
                    </Text>
                  </Pressable>
                  <Pressable
                    className="bg-black w-2/4 p-2 mt-5 justify-center items-center rounded-xl active:bg-slate-300"
                    onPress={onClose}
                  >
                    <Text className="font-bold text-sm sm:text-xl text-white">
                      Cancel
                    </Text>
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
