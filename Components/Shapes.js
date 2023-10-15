import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import Slider from "@react-native-community/slider";
import { TriangleColorPicker } from "react-native-color-picker";

export default function Shape({
  onSetColor,
  onSetHeight,
  onSetWidth,
  onSetRadius,
  onSelectShape,
  onClose,
}) {
  const [radius, setRadius] = useState(50);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);

  const onColorChange = (color) => {
    onSetColor(color);
  };

  const handleRadiusChange = (value) => {
    const roundedValue = Math.floor(value);
    setRadius(roundedValue);
    onSetRadius(roundedValue);
  };

  const handleHeigthChange = (value) => {
    const roundedValue = Math.floor(value);
    setHeight(roundedValue);
    onSetHeight(roundedValue);
  };

  const handleWidthChange = (value) => {
    const roundedValue = Math.floor(value);
    setWidth(roundedValue);
    onSetWidth(roundedValue);
  };

  const selectShape = (number) => {
    onSelectShape(number);
    onClose();
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
        <Text className="mt-5">Radius : {radius}</Text>
        <Slider
          value={radius}
          style={{ width: 200, height: 50 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          onValueChange={handleRadiusChange}
        />
        <Text>Width : {width}</Text>
        <Slider
          value={width}
          style={{ width: 200, height: 50 }}
          minimumValue={0}
          maximumValue={300}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          onValueChange={handleWidthChange}
        />
        <Text>Height : {height}</Text>
        <Slider
          value={height}
          style={{ width: 200, height: 50 }}
          minimumValue={0}
          maximumValue={300}
          minimumTrackTintColor="black"
          maximumTrackTintColor="black"
          onValueChange={handleHeigthChange}
        />
        <View className="flex flex-row gap-x-2">
          <Pressable onPress={() => selectShape(3)}>
            <Image
              source={require("../assets/Circle.png")}
              className="w-10 h-10"
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(4)}>
            <Image
              source={require("../assets/Square.png")}
              className="w-10 h-10"
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(5)}>
            <Image
              source={require("../assets/Oval.png")}
              className="w-10 h-10"
            ></Image>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
