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
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 p-10 bg-cyan-50 shadow-xl shadow-slate-950 items-center rounded-xl sm:w-1/2">
          <Text className="text-base font-bold sm:text-2xl">
            Enter New Project Name
          </Text>
          <TextInput
            className="w-11/12 border rounded-xl mt-5 p-2 sm:text-2xl sm:p-3"
            onChangeText={(text) => setProjectName(text)}
            value={projectName}
          />
          <Pressable
            className="bg-slate-200 w-2/4 p-2 mt-5 justify-center items-center rounded-xl"
            onPress={updateProjectName}
          >
            <Text className="font-bold text-sm sm:text-xl">Confirm</Text>
          </Pressable>
          <Pressable
            className="bg-slate-200 w-2/4 p-2 mt-5 justify-center items-center rounded-xl"
            onPress={onClose}
          >
            <Text className="font-bold text-sm sm:text-xl">Cancel</Text>
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
