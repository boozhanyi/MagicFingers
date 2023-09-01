import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { TriangleColorPicker } from "react-native-color-picker";
import { center } from "@shopify/react-native-skia";

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
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}>
          Press the color bar to confirm selection of color!
        </Text>
        <TriangleColorPicker
          style={{ width: "80%", height: 150 }}
          onColorSelected={(color) => onColorChange(color)}
        />
        <Text style={{ marginTop: 10, fontWeight: "bold", marginBottom: 10 }}>
          Stroke
        </Text>
        <Text style={{ marginTop: 10 }}>{radius}</Text>
        <Slider
          value={1}
          style={{ width: 200, marginBottom: 10, height: 50 }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 80,
    width: "90%",
    alignItems: "center",
    backgroundColor: "#E9FFFF",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    width: 100,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});
