import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Pressable, Alert } from "react-native";
import { auth, db } from "../Backend/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function SetProjectName({
  isVisible,
  onClose,
  navigation,
  image,
}) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setProjectName("");
    }
  }, [isVisible]);

  const checkName = async () => {
    try {
      const user = auth.currentUser;
      const drawingRef = collection(db, "Users", user.uid, "Drawings");

      const drawingNameRef = query(
        drawingRef,
        where("DrawingName", "==", projectName)
      );

      const querySnapshot = await getDocs(drawingNameRef);

      if (!querySnapshot.empty) {
        Alert.alert("Drawing with same name exists !");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error create folder:", error);
      return false;
    }
  };

  const confirmName = async () => {
    if (projectName === "") {
      Alert.alert("please give your project a name");
    } else {
      if (await checkName()) {
        onClose();
        navigation.navigate("DrawingScreen", {
          Name: projectName,
          image: image,
        });
      }
    }
  };

  const cancel = () => {
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View className="flex-1 justify-center items-center">
        <View className="flex-1 w-11/12 p-10 bg-cyan-50 border rounded-2xl items-center justify-center absolute sm:w-1/2">
          <Text className="sm:text-2xl">Give Your Project a Name</Text>
          <TextInput
            className=" w-full border rounded-md mt-6 p-2 sm:text-2xl sm:p-4"
            placeholder="Your project name"
            onChangeText={(text) => setProjectName(text)}
            value={projectName}
          />
          <Pressable
            className="bg-black rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-slate-300"
            onPress={confirmName}
          >
            <Text className="text-white sm:text-xl">Confirm</Text>
          </Pressable>
          <Pressable
            className="bg-black rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-slate-300"
            onPress={cancel}
          >
            <Text className="text-white sm:text-xl">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
