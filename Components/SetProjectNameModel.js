import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

export default function SetProjectName({
  isVisible,
  onClose,
  navigation,
  image,
}) {
  const [projectName, setProjectName] = useState("");

  const confirmName = () => {
    if (projectName === "") {
      Alert.alert("please give your project a name");
    } else {
      navigation.navigate("DrawingScreen", { Name: projectName, image: image });
    }
    onClose();
  };

  useEffect(() => {
    if (!isVisible) {
      setProjectName("");
    }
  }, [isVisible]);

  const cancel = () => {
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.setNameContainer}>
          <Text>Give Your Project a Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Your project name"
            onChangeText={(text) => setProjectName(text)}
            value={projectName}
          />
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
              },
              styles.confirmButton,
            ]}
            onPress={confirmName}
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
              },
              styles.confirmButton,
            ]}
            onPress={cancel}
          >
            <Text style={{ color: "white" }}>Cancel</Text>
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
  setNameContainer: {
    flex: 1,
    padding: 40,
    backgroundColor: "#F0FDFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderWidth: 1,
  },
  confirmButton: {
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  nameInput: {
    height: 50,
    width: "90%",
    borderColor: "#000000",
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
});
