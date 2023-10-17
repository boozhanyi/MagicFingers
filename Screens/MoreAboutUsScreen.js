import * as React from "react";
import { Text, ImageBackground, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreAboutUsScreen({ navigation }) {
  const back = () => {
    navigation.navigate("Profile");
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 items-center mt-15 sm:mt-24">
        <Text className="font-bold text-lg mt-10 sm:text-4xl">Our Team</Text>
        <View className="mt-3 item-center bg-cyan-50 p-5 border rounded-2xl">
          <Text className="text-base text-justify sm:text-2xl">
            Boo Zhan Yi
          </Text>
          <Text className="text-base text-justify mt-2 sm:text-2xl">
            U2005356/1
          </Text>
          <Text className="text-base text-justify mt-2 sm:text-2xl">
            University of Malaya
          </Text>
        </View>
        <Text className="font-bold text-lg mt-5 sm:text-4xl">Our App</Text>
        <View className=" mt-3 items-center justify-center bg-cyan-50 p-3 border rounded-xl mx-auto w-11/12">
          <Text className="text-base text-center sm:text-2xl">
            MagicFingers is an app designed to provide a user-friendly app for
            children who enjoys expressing their creativity through drawing.
            With colorful graphics and easy-to-use features. Our app has some
            interesting features such as providing drawing platform,videos that
            designed to promote learning and creativity. Children art works also
            can easily saved in your phone with our app.
          </Text>
        </View>
        <Pressable
          className="bg-cyan-50 mt-5 items-center justify-center w-1/2 h-10 rounded-2xl shadow-lg shadow-neutral-950 sm:h-20"
          onPress={back}
        >
          <Text className="text-base font-bold sm:text-2xl">Back</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}
