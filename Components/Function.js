import React, { useState } from "react";
import { View, Pressable, Modal, Text, Alert, Image } from "react-native";
import { deleteDrawing, favouriteDrawings } from "../Backend/Firebase";
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
        <Modal animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center">
            <View className="w-11/12 pt-5 pb-5 pl-5 bg-cyan-50 items-center rounded-xl border gap-y-3 sm:w-1/2">
              <Pressable
                onPress={deleteProject}
                className="flex flex-row w-full h-10 justify-center items-center gap-x-5 active:bg-slate-200"
              >
                <Image
                  className="w-7 h-7"
                  source={require("../assets/Delete.png")}
                />
                <Text>Delete</Text>
              </Pressable>
              <Pressable
                className="flex flex-row w-full h-10 justify-center items-center gap-x-5 active:bg-slate-200"
                onPress={starProject}
              >
                <Image
                  className="w-7 h-7"
                  source={require("../assets/Star.png")}
                />
                <Text>Star</Text>
              </Pressable>
              <Pressable
                className="flex flex-row w-full h-10 justify-center items-center gap-x-5 active:bg-slate-200 "
                onPress={onSave}
              >
                <Image
                  className="w-7 h-7"
                  source={require("../assets/Save.png")}
                />
                <Text>Save to your phone</Text>
              </Pressable>
              <Pressable
                className="flex flex-row w-full h-10 justify-center items-center gap-x-5 active:bg-slate-200"
                onPress={onShare}
              >
                <Image
                  className="w-7 h-7"
                  source={require("../assets/Share.png")}
                />
                <Text>Share</Text>
              </Pressable>
              <Pressable
                className="flex flex-row w-full h-10 justify-center items-center gap-x-5 active:bg-slate-200"
                onPress={onClose}
              >
                <Image
                  className="w-7 h-7"
                  source={require("../assets/Close.png")}
                />
                <Text>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {deleteButton && (
          <Modal animationType="fade" transparent={true}>
            <View className="flex-1 justify-center items-center">
              <View className="w-11/12 p-10 bg-cyan-50 items-center rounded-xl border sm:w-1/2">
                <Text className="font-bold sm:text-2xl">
                  Confirm your deletion!
                </Text>
                <Pressable
                  className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-white"
                  onPress={confirmDelete}
                >
                  <Text className="font-bold sm:text-xl">Confirm</Text>
                </Pressable>
                <Pressable
                  className="bg-slate-200 rounded-xl justify-center items-center p-2 mt-5 w-2/4 active:bg-white"
                  onPress={cancelDelete}
                >
                  <Text className="font-bold sm:text-xl">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </View>
    )
  );
}
