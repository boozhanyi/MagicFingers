import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { TriangleColorPicker } from "react-native-color-picker";

export default function Lines({ onSetColor, onSetRadius }) {
  const [radius, setRadius] = useState(1);

  const onColorChange = (color) => {
    onSetColor(color);
  };

  const handleRadiusChange = (value) => {
    const roundedValue = Math.floor(value);
    setRadius(roundedValue);
    onSetRadius(roundedValue);
  };

  return (
    <View className="justify-center items-center">
      <View className="flex-1 absolute bottom-20 bg-cyan-50 p-2 border justify-center items-center rounded-xl">
        <Text className="text-sm text-center">
          Press the color bar to confirm selection of color!
        </Text>
        <TriangleColorPicker
          className="w-4/5 h-40"
          onColorSelected={(color) => onColorChange(color)}
        />
        <Text className="font-bold mt-5">Stroke</Text>
        <Text className="mt-5">{radius}</Text>
        <Slider
          value={1}
          style={{ width: 200 }}
          minimumValue={0}
          maximumValue={10}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          onValueChange={handleRadiusChange}
        />
      </View>
    </View>
  );
}
