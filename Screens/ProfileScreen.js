import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { db, logOut, auth } from "../Backend/Firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [userID, setUserId] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = () => {
    const user = auth.currentUser;
    setUserId(user.uid);

    const drawingRef = doc(db, "Users", user.uid);

    const unsubscribe = onSnapshot(drawingRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        setProfileImage(data.ProfileImage);
        setUsername(data.Username);
      } else {
        console.log("Document does not exist.");
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const editProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const yourProject = () => {
    navigation.navigate("Home");
  };

  const moreAboutUs = () => {
    navigation.navigate("MoreAboutUsScreen");
  };

  const uploadVideo = () => {
    navigation.navigate("UploadVideoScreen");
  };

  const LogOut = () => {
    logOut();
    navigation.navigate("LogInScreen");
  };

  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
        <Text style={styles.nameText}>{username}</Text>
        <Pressable style={styles.editButtonContainer} onPress={editProfile}>
          <Text style={styles.editNametext}>Edit Profile</Text>
        </Pressable>
        <View style={styles.Linecontainer}>
          <View style={styles.line} />
        </View>
        <View style={styles.functionContainer}>
          <FontAwesome name="file" size={24} color="black" />
          <Text style={styles.functionText}>Your Project</Text>
          <Pressable onPress={yourProject}>
            <MaterialIcons name="navigate-next" size={27} color="black" />
          </Pressable>
        </View>
        <View style={styles.functionContainer}>
          <Entypo name="info-with-circle" size={24} color="black" />
          <Text style={styles.functionText}>More About Us</Text>
          <Pressable onPress={moreAboutUs}>
            <MaterialIcons name="navigate-next" size={27} color="black" />
          </Pressable>
        </View>
        {userID === "LE5gtcFiv8feSDeYqnpBhjrA9f42" && (
          <View style={styles.functionContainer}>
            <Entypo name="upload-to-cloud" size={24} color="black" />
            <Text style={styles.functionText}>UploadVideo</Text>
            <Pressable onPress={uploadVideo}>
              <MaterialIcons name="navigate-next" size={27} color="black" />
            </Pressable>
          </View>
        )}
        <View style={styles.functionContainer}>
          <MaterialCommunityIcons name="logout" size={24} color="black" />
          <Text style={styles.functionText}>Log Out</Text>
          <Pressable onPress={LogOut}>
            <MaterialIcons name="navigate-next" size={27} color="black" />
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileImageContainer: {
    overflow: "hidden",
    borderRadius: 50,
    borderWidth: 2,
    marginTop: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
  },
  editButtonContainer: {
    alignItems: "center",
    alignContent: "center",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    marginTop: 20,
    width: "40%",
    backgroundColor: "black",
    elevation: 10,
  },
  editNametext: {
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  Linecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: "95%",
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "black",
    opacity: 0.4,
  },
  functionContainer: {
    flexDirection: "row",
    marginTop: 30,
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  functionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
});
