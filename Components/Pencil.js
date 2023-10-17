import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TriangleColorPicker } from "react-native-color-picker";
import Slider from "@react-native-community/slider";

export default function Pencil({ onSetColor, onSetRadius }) {
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
      <View className="flex-1 absolute bottom-20 bg-cyan-50 p-2 border justify-center items-center rounded-xl sm:p-5">
        <Text className="text-sm text-center sm:text-2xl">
          Press the color bar to confirm selection of color!
        </Text>
        <TriangleColorPicker
          className="w-4/5 h-40 sm:h-52"
          onColorSelected={(color) => onColorChange(color)}
        />
        <Text className="font-bold mt-5 sm:text-2xl">Stroke</Text>
        <Text className="mt-5 sm:text-2xl">{radius}</Text>
        <Slider
          value={1}
          style={{ width: Dimensions.get("window").width > 500 ? 400 : 200 }}
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
