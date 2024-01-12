import React, { useState } from "react";
import { View, Pressable, Modal, Text, Alert, Image } from "react-native";
import {
  deleteDrawing,
  favouriteDrawings,
  deleteDrawingfromFolder,
} from "../Backend/Firebase";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function ProjectFucntion({
  isVisible,
  onClose,
  drawing,
  folder,
}) {
  const [deleteButton, pressedButtonDelete] = useState(false);

  const deleteProject = () => {
    pressedButtonDelete(true);
  };

  const confirmDelete = async () => {
    pressedButtonDelete(false);
    onClose();
    await deleteDrawing(drawing);
  };

  const starProject = async () => {
    onClose();
    await favouriteDrawings(drawing);
  };

  const cancelDelete = () => {
    pressedButtonDelete(false);
  };

  const onCloseModel = () => {
    onClose();
  };

  const onSave = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed!");
      }

      const { uri } = await FileSystem.downloadAsync(
        drawing.DrawingUrl,
        FileSystem.cacheDirectory + drawing.DrawingName + ".png"
      );
      await MediaLibrary.saveToLibraryAsync(uri);

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

    const { uri } = await FileSystem.downloadAsync(
      drawing.DrawingUrl,
      FileSystem.cacheDirectory + drawing.DrawingName + ".png"
    );
    await Sharing.shareAsync(uri);
  };

  const removeDrawing = async () => {
    await deleteDrawingfromFolder(drawing, folder);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      visible={isVisible}
    >
      {!deleteButton ? (
        <View className="flex-1 justify-center items-center">
          <View className="flex w-11/12 h-auto p-5 bg-cyan-50 items-center rounded-xl border space-y-3 sm:w-1/2 ">
            {folder ? (
              <Pressable
                onPress={removeDrawing}
                className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20"
              >
                <Image
                  className="w-7 h-7 sm:h-14 sm:w-14"
                  source={require("../assets/Delete.png")}
                />
                <Text className="sm:text-2xl">Remove from folder</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={deleteProject}
                className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20"
              >
                <Image
                  className="w-7 h-7 sm:h-14 sm:w-14"
                  source={require("../assets/Delete.png")}
                />
                <Text className="sm:text-2xl">Delete</Text>
              </Pressable>
            )}
            <Pressable
              className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20"
              onPress={starProject}
            >
              <Image
                className="w-7 h-7 sm:h-14 sm:w-14"
                source={require("../assets/Star.png")}
              />
              <Text className="sm:text-2xl">Star</Text>
            </Pressable>
            <Pressable
              className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20 "
              onPress={onSave}
            >
              <Image
                className="w-7 h-7 sm:h-14 sm:w-14"
                source={require("../assets/Save.png")}
              />
              <Text className="sm:text-2xl">Save to your phone</Text>
            </Pressable>
            <Pressable
              className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:h-20"
              onPress={onShare}
            >
              <Image
                className="w-7 h-7 sm:h-14 sm:w-14"
                source={require("../assets/Share.png")}
              />
              <Text className="sm:text-2xl">Share</Text>
            </Pressable>
            <Pressable
              className="flex flex-row w-full h-10 justify-center items-center space-x-5 active:bg-slate-200 sm:mb-5 sm:h-20"
              onPress={onCloseModel}
            >
              <Image
                className="w-7 h-7 sm:h-14 sm:w-14"
                source={require("../assets/Close.png")}
              />
              <Text className="sm:text-2xl">Close</Text>
            </Pressable>
          </View>
        </View>
      ) : (
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
    </Modal>
  );
}
