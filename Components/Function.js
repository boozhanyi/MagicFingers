import React, { useState } from "react";
import { StyleSheet, View, Pressable, Modal, Text, Alert } from "react-native";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {deleteButton && (
          <Modal animationType="fade" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Confirm your deletion!</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#A3FFFE" : "#B9B9B9",
                    },
                    styles.confirmButton,
                  ]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.text}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#A3FFFE" : "#B9B9B9",
                    },
                    styles.cancelButton,
                  ]}
                  onPress={cancelDelete}
                >
                  <Text style={styles.text}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        <View pointerEvents="box-none" style={styles.overlayView}>
          <View style={styles.functionButton}>
            <Pressable onPress={deleteProject} style={{ alignItems: "center" }}>
              <AntDesign name="delete" size={26} color="blue" />
            </Pressable>
          </View>
          <View style={styles.functionButton}>
            <Pressable style={{ alignItems: "center" }} onPress={starProject}>
              <AntDesign name="staro" size={26} color="blue" />
            </Pressable>
          </View>
          <View style={styles.functionButton}>
            <Pressable onPress={onSave} style={{ alignItems: "center" }}>
              <AntDesign name="save" size={26} color="blue" />
            </Pressable>
          </View>
          <View style={styles.functionButton}>
            <Pressable onPress={onShare} style={{ alignItems: "center" }}>
              <AntDesign name="sharealt" size={26} color="blue" />
            </Pressable>
          </View>
          <View style={styles.functionButton}>
            <Pressable onPress={onClose} style={{ alignItems: "center" }}>
              <AntDesign name="closecircleo" size={26} color="blue" />
            </Pressable>
          </View>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  overlayView: {
    position: "absolute",
    bottom: 5,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#E9FFFF",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    elevation: 10,
  },
  functionButton: {
    marginLeft: 20,
    marginRight: 10,
    alignItems: "center",
  },
  confirmDeleteContainer: {
    width: "90%",
    padding: 35,
    backgroundColor: "#F0FDFF",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 35,
    backgroundColor: "#F0FDFF",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
  },
  titleContainer: {
    borderRadius: 30,
    marginTop: 10,
  },
  textInputContainer: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    paddingLeft: 10,
  },
  text: {
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 30,
    width: "60%",
    height: 40,
    marginLeft: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    marginTop: 10,
    width: "60%",
    height: 40,
    marginLeft: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
