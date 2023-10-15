import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Pressable, Alert } from "react-native";

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
      <View className="flex-1 justify-center items-center">
        <View className="flex-1 p-10 bg-cyan-50 border rounded-2xl items-center justify-center absolute">
          <Text>Give Your Project a Name</Text>
          <TextInput
            className="h-10 w-full border rounded-md mt-6 p-2"
            placeholder="Your project name"
            onChangeText={(text) => setProjectName(text)}
            value={projectName}
          />
          <Pressable
            className="mt-5 border rounded-xl bg-black p-2 w-1/2 items-center justify-center "
            onPress={confirmName}
          >
            <Text className="text-white">Confirm</Text>
          </Pressable>
          <Pressable
            className="mt-5 border rounded-xl bg-black p-2 w-1/2 items-center justify-center "
            onPress={cancel}
          >
            <Text className="text-white">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
