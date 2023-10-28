import MainScreen from "./Screens/MainScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "./Screens/LogInScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import TabNavigator from "./Screens/TabNavigator";
import EditProfileScreen from "./Screens/EditProfileScreen";
import UploadVideoScreen from "./Screens/UploadVideoScreen";
import ResetPassword from "./Screens/ResetPasswordScreen";
import MoreAboutUsScreen from "./Screens/MoreAboutUsScreen";
import VideoScreen from "./Screens/VideoScreen";
import WatchVideoScreen from "./Screens/WatchVideoScreen";
import DrawingScreen from "./Screens/DrawingScreen";
import FolderScreen from "./Screens/FolderScreen";
import FolderDrawingsScreen from "./Screens/FolderDrawingsScreen";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadVideoScreen"
          component={UploadVideoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MoreAboutUsScreen"
          component={MoreAboutUsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WatchVideoScreen"
          component={WatchVideoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawingScreen"
          component={DrawingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FolderScreen"
          component={FolderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FolderDrawingsScreen"
          component={FolderDrawingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
