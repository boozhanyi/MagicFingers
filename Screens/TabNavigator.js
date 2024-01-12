import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FunctionScreen from "./FunctionScreen";
import ProfileScreen from "./ProfileScreen";
import HomeScreen from "./HomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useWindowDimensions } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { width } = useWindowDimensions();
  const iconSize = width > 600 ? 50 : 24;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { height: width > 600 ? 80 : 50 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Function") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: width > 600 ? 20 : 10 },
        tabBarIconStyle: { width: 50 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Function"
        component={FunctionScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
