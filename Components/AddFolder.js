import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Pressable, Alert } from "react-native";
import { createFolder } from "../Backend/Firebase";

export default function AddFolder({ isVisible, onClose }) {
  useEffect(() => {
    setFolderName("");
  }, [isVisible]);

  const [folderName, setFolderName] = useState("");

  const addFolder = async () => {
    if (folderName === "") {
      Alert.alert("Please give you folder a name");
    } else {
      await createFolder(folderName);
    }
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 p-10 bg-cyan-50 shadow-xl shadow-slate-950 items-center rounded-xl sm:w-1/2">
          <Text className="text-base font-bold sm:text-2xl">
            Enter New Folder Name
          </Text>
          <TextInput
            className="w-11/12 border rounded-xl mt-5 p-2 sm:text-2xl sm:p-3"
            onChangeText={(text) => setFolderName(text)}
            value={folderName}
          />
          <Pressable
            className="bg-slate-200 w-2/4 p-2 mt-5 justify-center items-center rounded-xl active:bg-white"
            onPress={addFolder}
          >
            <Text className="font-bold text-sm sm:text-xl">Confirm</Text>
          </Pressable>
          <Pressable
            className="bg-slate-200 w-2/4 p-2 mt-5 justify-center items-center rounded-xl active:bg-white"
            onPress={onClose}
          >
            <Text className="font-bold text-sm sm:text-xl ">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
