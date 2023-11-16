import React, { useState, useEffect } from "react";
import {
  Text,
  ImageBackground,
  View,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db, deleteDrawingfromFolder } from "../Backend/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import AddDrawing from "../Components/AddDrawing";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function FolderDrawingsScreen({ route, navigation }) {
  const [folder, setFolder] = useState(route.params?.Folder);
  const [drawings, setDrawing] = useState([]);
  const [addDrawingModel, setAddDrawingModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteDrawing, setDeleteDrawing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const user = auth.currentUser;
    const folderRef = doc(db, "Users", user.uid, "Folder", folder.FolderID);

    const unsubscribe = onSnapshot(folderRef, (docSnapshot) => {
      const drawingData = [];
      if (docSnapshot.exists()) {
        const data = docSnapshot.data().Drawings;

        data.forEach((drawing) => {
          if (drawing.TimeStamp) {
            const TimeStamp = drawing.TimeStamp.toDate();
            const dateObject = new Date(TimeStamp);

            const year = dateObject.getUTCFullYear();
            const month = dateObject.getUTCMonth() + 1; // Months are zero-indexed, so add 1
            const day = dateObject.getUTCDate();

            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            drawingData.push({
              DrawingName: drawing.DrawingName,
              DrawingUrl: drawing.DrawingUrl,
              TimeStamp: formattedDate,
            });
          }
        });

        setDrawing(drawingData);
      } else {
        console.log("Document does not exist.");
      }
    });
    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const back = () => {
    navigation.navigate("FolderScreen");
  };

  const openModel = () => {
    setAddDrawingModel(true);
  };

  const closeModel = () => {
    setAddDrawingModel(false);
  };

  const cancelDelete = () => {
    setDeleteModel(false);
  };

  const confirmDelete = async () => {
    deleteDrawingfromFolder(deleteDrawing, folder);
    setDeleteModel(false);
  };

  const openDeleteModel = (drawing) => {
    setDeleteDrawing(drawing);
    setDeleteModel(true);
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 relative">
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 item-center">
            <View className="flex flex-row mt-10 items-center justify-center">
              <Pressable onPress={back} className="w-1/3 justify-start ">
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Text className="w-1/2 justify-start text-xl font-bold ml-5">
                {folder.FolderName}
              </Text>
            </View>

            <View className="flex flex-row flex-wrap mt-5">
              {drawings.reverse().map((drawing, index) => (
                <Pressable
                  onLongPress={() => openDeleteModel(drawing)}
                  key={index}
                  className="w-1/2 items-center"
                >
                  <View className="w-11/12 justify-center items-center p-4 border rounded-xl bg-slate-100 mt-5">
                    <View className="w-28 h-28 sm:w-56 sm:h-56">
                      <Image
                        source={{ uri: drawing.DrawingUrl }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                    <View className="justify-center items-center">
                      <Text className="mt-1 text-base font-semibold">
                        {drawing.DrawingName}
                      </Text>
                      <Text className="mt-1 text-base font-semibold">
                        {drawing.TimeStamp}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
            <View className="justify-center items-center mt-5 w-full">
              <Pressable
                onPress={openModel}
                className="bg-slate-200 border rounded-2xl w-1/2 h-12 justify-center items-center shadow-2xl shadow-black"
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
          <AddDrawing
            isVisible={addDrawingModel}
            onClose={closeModel}
            folder={folder}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
