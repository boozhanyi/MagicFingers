import React, { useState, useEffect } from "react";
import { Text, ImageBackground, View, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../Backend/Firebase";
import { doc, query, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import AddDrawing from "../Components/AddDrawing";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function FolderDrawingsScreen({ route, navigation }) {
  const [folder, setFolder] = useState(route.params?.Folder);
  const [drawings, setDrawing] = useState([]);
  const [addDrawingModel, setAddDrawingModel] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const user = auth.currentUser;
    const folderRef = doc(db, "Users", user.uid, "Folder", folder.FolderID);
    //const folderQuery = query(folderRef, orderBy("TimeStamp", "desc"));

    const unsubscribe = onSnapshot(folderRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setDrawing(data.Drawings);
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

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 relative">
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1">
            <View className="flex flex-row mt-10 items-center justify-center">
              <Pressable onPress={back} className="w-1/3 justify-start ">
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>
              <Text className="w-1/2 justify-start text-xl font-bold ml-5">
                {folder.FolderName}
              </Text>
            </View>

            <View className="flex-1 flex-row flex-wrap mt-5">
              {drawings.map((drawing, index) => (
                <View key={index} className="w-1/2 items-center">
                  <View className="w-11/12 justify-center items-center p-5 border rounded-xl bg-slate-100 mt-5">
                    <View className="w-28 h-28 sm:w-56 sm:h-56">
                      <Image
                        source={{ uri: drawing.DrawingUrl }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </View>
                    <Text className="mt-3 text-base font-semibold">
                      {drawing.DrawingName}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View className="justify-center items-center mt-5">
              <Pressable
                onPress={openModel}
                className="bg-slate-200 border rounded-2xl w-1/2 h-12 justify-center items-center shadow-2xl shadow-black"
              >
                <Ionicons name="add" size={24} color="black" />
              </Pressable>
            </View>
          </View>
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
