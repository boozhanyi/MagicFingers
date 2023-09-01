import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";
import { updateDrawingName } from "../Backend/Firebase";

export default function EditProjectName({ isVisible, onClose, project }) {
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (project) {
      setProjectName(project.DrawingName);
    }
  });

  const updateProjectName = async () => {
    await updateDrawingName(project, projectName);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Enter New Project Name</Text>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => setProjectName(text)}
              value={projectName}
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#A3FFFE" : "#B9B9B9",
              },
              styles.confirmButton,
            ]}
            onPress={updateProjectName}
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
            onPress={onClose}
          >
            <Text style={styles.text}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
