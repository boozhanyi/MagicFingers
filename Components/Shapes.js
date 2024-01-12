import React, { useState } from "react";
import { View, Pressable, Image, Text } from "react-native";

export default function Shape({
  onSetColor,
  onSetHeight,
  onSetWidth,
  onSetRadius,
  onSelectShape,
  onClose,
}) {
  const [selectedShape, setSelectedShape] = useState(3);
  const [selectedCube, setSelectedCube] = useState("");

  const onSetColorChange = (color) => {
    onSetColor(color);
  };

  const onSetRadiusChange = (value) => {
    onSetRadius(value);
    onSelectShape(selectedShape);
    onClose();
  };

  const onSetPolygon = (width, height) => {
    onSetHeight(height);
    onSetWidth(width);
    onSelectShape(selectedShape);
    onClose();
  };

  const selectShape = (number, cube) => {
    setSelectedShape(number);
    setSelectedCube(cube);
  };

  return (
    <View className="justify-center items-center p-5">
      <View className="flex-1 absolute bottom-5 bg-cyan-50 p-5 border justify-center items-center rounded-xl">
        <View className="flex flex-row gap-x-2">
          <Pressable onPress={() => selectShape(3)}>
            <Image
              source={require("../assets/Circle.png")}
              className="w-10 h-10 sm:w-20 sm:h-20"
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(4, "Square")}>
            <Image
              source={require("../assets/Square.png")}
              className="w-10 h-10 sm:w-20 sm:h-20"
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(4, "Rectangle")}>
            <Image
              source={require("../assets/Rectangle.png")}
              className="w-10 h-10 sm:w-20 sm:h-20"
            ></Image>
          </Pressable>
          <Pressable onPress={() => selectShape(5)}>
            <Image
              source={require("../assets/Oval.png")}
              className="w-10 h-10 sm:w-20 sm:h-20"
            ></Image>
          </Pressable>
        </View>
        {selectedShape === 3 && (
          <>
            <Text className="font-bold text-lg mt-2">Circle</Text>
          </>
        )}
        {selectedShape === 4 && selectedCube === "Square" && (
          <>
            <Text className="font-bold text-lg mt-2">Square</Text>
          </>
        )}
        {selectedShape === 4 && selectedCube === "Rectangle" && (
          <>
            <Text className="font-bold text-lg mt-2">Rectangle</Text>
          </>
        )}
        {selectedShape === 5 && (
          <>
            <Text className="font-bold text-lg mt-2">Oval</Text>
          </>
        )}
        <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center mt-3 ">
          <Pressable
            className="bg-black w-10 h-10 rounded-full "
            onPress={() => onSetColorChange("#000000")}
          />
          <Pressable
            className="bg-white w-10 h-10 rounded-full border "
            onPress={() => onSetColorChange("#FFFFFF")}
          />
          <Pressable
            className="bg-red-700 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#b91c1c")}
          />
          <Pressable
            className="bg-pink-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#f472b6")}
          />
          <Pressable
            className="bg-purple-800 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#6b21a8")}
          />
          <Pressable
            className="bg-purple-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#c084fc")}
          />
          <Pressable
            className="bg-blue-900 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#1e3a8a")}
          />
          <Pressable
            className="bg-blue-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#60a5fa")}
          />
          <Pressable
            className="bg-green-900 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#14532d")}
          />
          <Pressable
            className="bg-green-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#34d399")}
          />
          <Pressable
            className="bg-yellow-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#fde047")}
          />
          <Pressable
            className="bg-orange-400 w-10 h-10 rounded-full"
            onPress={() => onSetColorChange("#fb923c")}
          />
        </View>
        {selectedShape === 3 && (
          <View>
            <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center mt-5 ">
              <Pressable
                className="bg-white w-5 h-5 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetRadiusChange(10)}
              ></Pressable>
              <Pressable
                className="bg-white w-8 h-8 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetRadiusChange(30)}
              ></Pressable>
              <Pressable
                className="bg-white w-14 h-14 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetRadiusChange(50)}
              ></Pressable>
            </View>
          </View>
        )}
        {selectedShape === 4 && selectedCube === "Square" && (
          <View>
            <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center mt-5 ">
              <Pressable
                className="bg-white w-5 h-5 border items-center justify-center active:bg-cyan-200"
                onPress={() => onSetPolygon(40, 40)}
              ></Pressable>
              <Pressable
                className="bg-white w-8 h-8 border items-center justify-center  active:bg-cyan-200"
                onPress={() => onSetPolygon(60, 60)}
              ></Pressable>
              <Pressable
                className="bg-white w-12 h-12 border items-center justify-center active:bg-cyan-200"
                onPress={() => onSetPolygon(100, 100)}
              ></Pressable>
            </View>
          </View>
        )}
        {selectedShape === 4 && selectedCube === "Rectangle" && (
          <View>
            <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center mt-5 ">
              <Pressable
                className="bg-white w-10 h-4  border items-center justify-center active:bg-cyan-200"
                onPress={() => onSetPolygon(60, 30)}
              ></Pressable>
              <Pressable
                className="bg-white w-14 h-6 border items-center justify-center  active:bg-cyan-200"
                onPress={() => onSetPolygon(100, 50)}
              ></Pressable>
              <Pressable
                className="bg-white w-20 h-10 border items-center justify-center active:bg-cyan-200"
                onPress={() => onSetPolygon(160, 80)}
              ></Pressable>
            </View>
          </View>
        )}
        {selectedShape === 5 && (
          <View>
            <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center mt-5 ">
              <Pressable
                className="bg-white w-5 h-5 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetPolygon(60, 30)}
              ></Pressable>
              <Pressable
                className="bg-white w-8 h-8 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetPolygon(100, 50)}
              ></Pressable>
              <Pressable
                className="bg-white w-14 h-14 border items-center justify-center rounded-full active:bg-cyan-200"
                onPress={() => onSetPolygon(160, 80)}
              ></Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
