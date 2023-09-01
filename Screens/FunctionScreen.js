import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../Backend/Firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SetProjectName from "../Components/SetProjectNameModel";
import { useFocusEffect } from "@react-navigation/native";

export default function FunctionScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [nameModalVisible, setNameModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      setNameModal(false);
    }, [])
  );

  const fetchData = () => {
    const user = auth.currentUser;
    const drawingRef = doc(db, "Users", user.uid);

    const unsubscribe = onSnapshot(drawingRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        setProfileImage(data.ProfileImage);
      } else {
        console.log("Document does not exist.");
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const onOpenImportPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("DrawingScreen", { image: result.assets[0].uri });
    } else {
      alert("You did not select any image.");
    }
  };

  const onOpenDesign = () => {
    setNameModal(true);
  };

  const onOpenVideo = () => {
    navigation.navigate("VideoScreen");
  };

  const onPressProfile = () => {
    navigation.navigate("Profile");
  };

  const onClose = () => {
    setNameModal(false);
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[styles.container, { opacity: nameModalVisible ? 0.1 : 1 }]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>EXPLORE</Text>
              <View style={styles.flexSpacer} />
              <Pressable
                style={styles.profileImageContainer}
                onPress={onPressProfile}
              >
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              </Pressable>
            </View>
            <View style={styles.mainContainer}>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                  },
                  styles.subContainer,
                ]}
                onPress={onOpenDesign}
              >
                <Text style={styles.mainText}>Start Your Design</Text>
                <Text style={styles.subText}>Various tools to help you</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                  },
                  styles.subContainer,
                ]}
                onPress={onOpenVideo}
              >
                <Text style={styles.mainText}>Video</Text>
                <Text style={styles.subText}>
                  Step-by-step drawing instructions for kids of all ages. Large
                  collection of drawing tutorials featuring various topics .
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "#DDFFFF",
                  },
                  styles.subContainer,
                ]}
                onPress={onOpenImportPicture}
              >
                <Text style={styles.mainText}>
                  Import and edit your picture
                </Text>
                <Text style={styles.subText}>
                  Import your picture and you can edit on it now
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <SetProjectName
        isVisible={nameModalVisible}
        onClose={onClose}
        navigation={navigation}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 115,
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  profileImageContainer: {
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  flexSpacer: {
    flex: 1,
  },
  mainContainer: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
  },
  subContainer: {
    width: "90%",
    padding: 20,
    margin: 10,
    alignItems: "center",
    borderRadius: 30,
    borderWidth: 1,
  },
  mainText: {
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    opacity: 0.4,
  },
});
