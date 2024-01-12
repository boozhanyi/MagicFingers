import React from "react";
import { View, Pressable, Text } from "react-native";

export default function Lines({ onSetColor, onSetRadius }) {
  const onSetColorChange = (color) => {
    onSetColor(color);
  };

  const onSetRadiusChange = (value) => {
    onSetRadius(value);
  };

  return (
    <View className="justify-center items-center p-5">
      <View className="flex-1 absolute bottom-5 bg-cyan-50 p-5 border justify-center items-center rounded-xl sm:p-5">
        <Text className="text-bold text-xl mb-5">Line</Text>
        <View className="flex flex-row flex-wrap gap-x-3 gap-y-3 justify-center items-center ">
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
        <View className="flex flex-row flex-wrap gap-x-3 items-center mt-5">
          <Pressable
            className="bg-white w-20 h-7 border items-center justify-center rounded-xl"
            onPress={() => onSetRadiusChange(1)}
          >
            <View className="bg-black h-1 w-16 border rounded-full" />
          </Pressable>
          <Pressable
            className="bg-white w-20 h-7 border items-center justify-center rounded-xl"
            onPress={() => onSetRadiusChange(3)}
          >
            <View className="bg-black h-1 w-16 border-2 rounded-full" />
          </Pressable>
        </View>
        <View className="flex flex-row flex-wrap gap-x-3 items-center mt-5">
          <Pressable
            className="bg-white w-20 h-7 border items-center justify-center rounded-xl"
            onPress={() => onSetRadiusChange(6)}
          >
            <View className="bg-black h-1 w-16 border-4 rounded-full" />
          </Pressable>
          <Pressable
            className="bg-white w-20 h-7 border items-center justify-center rounded-xl"
            onPress={() => onSetRadiusChange(10)}
          >
            <View className="bg-black h-1 w-16 border-8 rounded-full" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
