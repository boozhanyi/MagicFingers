import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
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
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Press the color bar to confirm selection of color!
        </Text>
        <TriangleColorPicker
          style={{ width: "80%", height: 150 }}
          onColorSelected={(color) => onColorChange(color)}
        />
        <Text style={{ marginTop: 10 }}>Radius : {radius}</Text>
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
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => selectShape(3)}>
            <Image
              source={require("../assets/Circle.png")}
              style={styles.image}
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(4)}>
            <Image
              source={require("../assets/Square.png")}
              style={styles.image}
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(5)}>
            <Image
              source={require("../assets/Oval.png")}
              style={styles.image}
            ></Image>
          </Pressable>
        </View>
      </View>
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
});
