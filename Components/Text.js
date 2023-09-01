import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";

export default function TextView({
  onSetSize,
  onSetText,
  onSelectShape,
  onClose,
}) {
  const [size, setSize] = useState(50);
  const [text, setText] = useState(null);

  const handleSizeChange = (value) => {
    const roundedValue = Math.floor(value);
    setSize(roundedValue);
    onSetSize(roundedValue);
  };

  const onSettext = (text) => {
    setText(text);
  };

  const onConfirm = (number) => {
    if (text) {
      onSelectShape(number);
      onSetText(text);
    } else {
      alert("You do not enter any text");
    }
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text>Size : {size}</Text>
      <Slider
        value={size}
        style={{ width: 200, height: 50 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="black"
        maximumTrackTintColor="black"
        onValueChange={handleSizeChange}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter text"
        onChangeText={(text) => onSettext(text)}
      ></TextInput>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#A3FFFE" : "#B9B9B9",
          },
          styles.confirmButton,
        ]}
        onPress={() => onConfirm(6)}
      >
        <Text>Confirm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    padding: 10,
    bottom: 80,
    alignItems: "center",
    backgroundColor: "#E9FFFF",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
  confirmButton: {
    width: 70,
    height: 40,
    margin: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  textInput: {
    marginLeft: 10,
    height: 40,
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#F1F1F1",
  },
});
