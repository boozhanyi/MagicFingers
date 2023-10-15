import React, { useState } from "react";
import { View, Pressable, Modal, Text, Alert } from "react-native";
import { deleteDrawing, favouriteDrawings } from "../Backend/Firebase";
import { AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function ProjectFucntion({ isVisible, onClose, projects }) {
  const [deleteButton, pressedButtonDelete] = useState(false);

  const deleteProject = () => {
    pressedButtonDelete(true);
  };

  const confirmDelete = async () => {
    pressedButtonDelete(false);
    onClose();
    await deleteDrawing(projects);
  };

  const starProject = async () => {
    onClose();
    await favouriteDrawings(projects);
  };

  const cancelDelete = () => {
    pressedButtonDelete(false);
    onClose();
  };

  const onSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed!");
      }

      projects.forEach(async (drawing) => {
        const { uri } = await FileSystem.downloadAsync(
          drawing.DrawingUrl,
          FileSystem.cacheDirectory + drawing.DrawingName + ".png"
        );
        await MediaLibrary.saveToLibraryAsync(uri);
      });

      Alert.alert("Download Complete");
      onClose();
    } catch (error) {
      console.error("Error downloading drawing:", error);
    }
  };

  const onShare = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("You platform does not support this function");
    }

    if (projects.length > 1) {
      Alert.alert("Please select only 1 image");
      return;
    }

    projects.forEach(async (drawing) => {
      const { uri } = await FileSystem.downloadAsync(
        drawing.DrawingUrl,
        FileSystem.cacheDirectory + drawing.DrawingName + ".png"
      );
      await Sharing.shareAsync(uri);
    });
  };

  return (
    isVisible && (
      <View className="flex-1 justify-center items-center">
        {deleteButton && (
          <Modal animationType="fade" transparent={true}>
            <View className="flex-1 justify-center items-center">
              <View className="w-11/12 p-10 bg-cyan-50 items-center rounded-xl border">
                <Text className="font-bold">Confirm your deletion!</Text>
                <Pressable
                  className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4"
                  onPress={confirmDelete}
                >
                  <Text className="font-bold">Confirm</Text>
                </Pressable>
                <Pressable
                  className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4"
                  onPress={cancelDelete}
                >
                  <Text className="font-bold">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        <View
          pointerEvents="box-none"
          className="flex flex-row bg-cyan-100 p-3 absolute bottom-5 rounded-2xl shadow-xl shadow-slate-950 gap-x-7"
        >
          <Pressable onPress={deleteProject} style={{ alignItems: "center" }}>
            <AntDesign name="delete" size={26} color="blue" />
          </Pressable>
          <Pressable style={{ alignItems: "center" }} onPress={starProject}>
            <AntDesign name="staro" size={26} color="blue" />
          </Pressable>
          <Pressable onPress={onSave} style={{ alignItems: "center" }}>
            <AntDesign name="save" size={26} color="blue" />
          </Pressable>
          <Pressable onPress={onShare} style={{ alignItems: "center" }}>
            <AntDesign name="sharealt" size={26} color="blue" />
          </Pressable>
          <Pressable onPress={onClose} style={{ alignItems: "center" }}>
            <AntDesign name="closecircleo" size={26} color="blue" />
          </Pressable>
        </View>
      </View>
    )
  );
}
