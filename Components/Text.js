import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
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
    <View className="justify-center items-center flex-1">
      <View className="flex-1 absolute bottom-20 bg-cyan-50 p-2 border justify-center items-center rounded-xl">
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
          className="w-72 h-10 border rounded-xl p-2"
          placeholder="Enter text"
          onChangeText={(text) => onSettext(text)}
        ></TextInput>
        <Pressable
          className="bg-slate-200 p-2 h-10 rounded-xl w-1/2 justify-center items-center mt-3 mb-2"
          onPress={() => onConfirm(6)}
        >
          <Text className="font-bold">Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}
