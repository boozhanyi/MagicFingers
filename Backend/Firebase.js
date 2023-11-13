import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  collection,
  getDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  addDoc,
  arrayUnion,
  where,
  query,
  getDocs,
  Timestamp,
  arrayRemove,
} from "@firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Alert } from "react-native";
import {
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  signOut,
  sendPasswordResetEmail,
  getReactNativePersistence,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9e5B19FW09shyrrPqGyHH4NZjw2ZiofI",
  authDomain: "magicfingers-6bd79.firebaseapp.com",
  projectId: "magicfingers-6bd79",
  storageBucket: "magicfingers-6bd79.appspot.com",
  messagingSenderId: "99486055146",
  appId: "1:99486055146:web:fc10805c6ae0bb7899b593",
  measurementId: "G-5RTH7DHWQ2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

const LogInAccount = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    console.log("Successfully logged in");
    return { status: true, error: null };
  } catch (error) {
    console.log(error);
    return { status: false, error: error.message };
  }
};

const SignUpAccount = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    user = userCredential.user;

    const usersCollection = doc(db, "Users", user.uid);
    await setDoc(usersCollection, {
      Username: username,
      Email: email,
      ProfileImage: user.photoURL,
    });

    console.log("New user created");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert(
      "Password Reset Email Sent",
      "Check your email for password reset instructions."
    );
  } catch (error) {
    console.log(error);
    Alert.alert("Password Reset Failed", error.message);
  }
};

const logOut = () => {
  signOut(auth)
    .then(() => {
      Alert.alert("Successfully logged out!");
      console.log("User successfully logged out.");
    })
    .catch((error) => {
      console.log("Error logging out:", error);
    });
};

const updateProfile = async (imageUri, newUsername, newEmail, newPassword) => {
  try {
    Alert.alert("Updating Profile!");

    const user = auth.currentUser;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageUri, true);
      xhr.send(null);
    });

    const imageRef = ref(storage, `images/profile_picture/${user.uid}`);
    await uploadBytes(imageRef, blob);
    blob.close();

    try {
      if (user.email !== newEmail) {
        await updateEmail(user, newEmail);
        userEmail = user.email;
      }
    } catch (error) {
      console.log("Error updating email", error);
    }

    const downloadUrl = await getDownloadURL(imageRef);
    const userRef = doc(db, "Users", user.uid);

    await updateDoc(userRef, {
      ProfileImage: downloadUrl,
      Username: newUsername,
      Email: newEmail,
    });

    Alert.alert("Successfully updated!");
    console.log("Successfully updated!");
  } catch (error) {
    Alert.alert("Error updating profile:", error);
    console.error("Error updating profile:", error);
    return null;
  }
};

const uploadVideo = async (videoName, description, videoSource) => {
  try {
    Alert.alert(
      "Uploading Video",
      "Please wait while the video is being uploaded."
    );

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", videoSource, true);
      xhr.send(null);
    });

    const videoRef = ref(storage, `videos/${videoName}.mp4`);
    await uploadBytes(videoRef, blob);
    blob.close();

    const downloadUrl = await getDownloadURL(videoRef);
    const videoCollection = collection(db, "Video");

    await addDoc(videoCollection, {
      VideoName: videoName,
      Keyword: description,
      VideoUrl: downloadUrl,
      TimeStamp: serverTimestamp(),
    });

    Alert.alert("Video Uploaded", "The video has been successfully uploaded.");
    console.log("Video uploaded successfully!");
  } catch (error) {
    console.error("Error uploading video:", error);
  }
};

const setStarVideo = async (video) => {
  try {
    const user = auth.currentUser;

    const videoData = {
      VideoName: video.VideoName,
      Keyword: video.Keyword,
      VideoUrl: video.VideoUrl,
      TimeStamp: serverTimestamp(),
    };

    const documentRef = doc(db, "Users", user.uid);
    const starVideoRef = await getDoc(
      doc(collection(documentRef, "StarVideo"), video.id)
    );

    if (starVideoRef.exists()) {
      await deleteDoc(doc(collection(documentRef, "StarVideo"), video.id));
      Alert.alert("Video Unstared!");
      console.log("Video Unstared!");
    } else {
      await setDoc(
        doc(collection(documentRef, "StarVideo"), video.id),
        videoData
      );
      Alert.alert("Video Stared!");
      console.log("Video Stared!");
    }
  } catch (error) {
    console.error("Error starring video:", error);
  }
};

const setWatchHistory = async (video) => {
  try {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.uid);

    const videoData = {
      VideoName: video.VideoName,
      Keyword: video.Keyword,
      VideoUrl: video.VideoUrl,
      TimeStamp: serverTimestamp(),
    };

    const historyRef = doc(collection(userRef, "VideoHistory"), video.id);
    const historySnapshot = await getDoc(historyRef);

    if (historySnapshot.exists()) {
      await updateDoc(historyRef, {
        TimeStamp: serverTimestamp(),
      });
    } else {
      await setDoc(
        doc(collection(userRef, "VideoHistory"), video.id),
        videoData
      );
    }

    console.log("History Updated");
  } catch (error) {
    console.error("Error Updating History", error);
  }
};

const saveDrawing = async (uri, name) => {
  try {
    const user = auth.currentUser;

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageRef = ref(storage, `images/${user.uid}/${name}`);
    await uploadBytes(imageRef, blob);
    blob.close();

    const downloadUrl = await getDownloadURL(imageRef);
    const userRef = collection(db, "Users", user.uid, "Drawings");

    await addDoc(userRef, {
      DrawingName: name,
      DrawingUrl: downloadUrl,
      TimeStamp: serverTimestamp(),
    });

    console.log("Succesfully Saved to database");
  } catch (error) {
    console.error("Error Saving Drawings", error);
  }
};

const updateDrawingName = async (drawing, drawingNewName) => {
  try {
    const user = auth.currentUser;
    const userRef = doc(db, "Users", user.uid);
    const drawingRef = doc(collection(userRef, "Drawings"), drawing.DrawingId);

    await updateDoc(drawingRef, {
      DrawingName: drawingNewName,
    });

    console.log("Name Updated");
  } catch (error) {
    console.error("Error Updating Name", error);
  }
};

const deleteDrawing = async (drawing) => {
  try {
    const user = auth.currentUser;
    const drawingRef = collection(db, "Users", user.uid, "Drawings");
    const documentRef = collection(db, "Users", user.uid, "StarDrawings");

    for (const drawingItem of drawing) {
      const docRef = doc(drawingRef, drawingItem.DrawingId);
      await deleteDoc(docRef);

      const starDrawingRef = await getDoc(
        doc(documentRef, drawingItem.DrawingId)
      );

      if (starDrawingRef.exists()) {
        await deleteDoc(doc(documentRef, drawingItem.DrawingId));
      }

      const storageRef = ref(storage, drawingItem.DrawingUrl);
      await deleteObject(storageRef);

      console.log(`Drawing with ID ${drawingItem.DrawingId} deleted.`);
    }
  } catch (error) {
    console.error("Error delete drawing", error);
  }
};

const favouriteDrawings = async (drawing) => {
  try {
    const user = auth.currentUser;
    const documentRef = doc(db, "Users", user.uid);

    for (const drawingItem of drawing) {
      const drawingData = {
        DrawingName: drawingItem.DrawingName,
        DrawingUrl: drawingItem.DrawingUrl,
        TimeStamp: serverTimestamp(),
      };

      const starDrawingRef = await getDoc(
        doc(collection(documentRef, "StarDrawings"), drawingItem.DrawingId)
      );

      if (starDrawingRef.exists()) {
        await deleteDoc(
          doc(collection(documentRef, "StarDrawings"), drawingItem.DrawingId)
        );
        console.log("Drawings Unstared!");
      } else {
        await setDoc(
          doc(collection(documentRef, "StarDrawings"), drawingItem.DrawingId),
          drawingData
        );
        console.log("Drawings Stared!");
      }
    }
  } catch (error) {
    console.error("Error starring drawings:", error);
  }
};

const createFolder = async (folderName) => {
  try {
    const user = auth.currentUser;
    const folderRef = collection(db, "Users", user.uid, "Folder");

    const folderNameRef = query(
      folderRef,
      where("FolderName", "==", folderName)
    );

    const querySnapshot = await getDocs(folderNameRef);

    if (!querySnapshot.empty) {
      Alert.alert("Folder with same name exists !");
    } else {
      await addDoc(folderRef, {
        FolderName: folderName,
        TimeStamp: serverTimestamp(),
        Drawings: [],
      });
    }
  } catch (error) {
    console.error("Error create folder:", error);
  }
};

const deleteFolder = async (folderID) => {
  try {
    const user = auth.currentUser;
    const folderRef = doc(db, "Users", user.uid, "Folder", folderID);
    await deleteDoc(folderRef);
  } catch (error) {
    console.error("Error delete folder:", error);
  }
};

const addDrawing = async (drawing, folder) => {
  try {
    const user = auth.currentUser;
    const folderRef = doc(db, "Users", user.uid, "Folder", folder.FolderID);

    await updateDoc(folderRef, {
      Drawings: arrayUnion({
        DrawingName: drawing.DrawingName,
        DrawingUrl: drawing.DrawingUrl,
        TimeStamp: drawing.Time,
      }),
    });
  } catch (error) {
    console.error("Error add drawings:", error);
  }
};

const deleteDrawingfromFolder = async (drawing, folder) => {
  try {
    const user = auth.currentUser;
    const folderRef = doc(db, "Users", user.uid, "Folder", folder.FolderID);

    const docSnap = await getDoc(folderRef);
    const documentData = docSnap.data().Drawings;

    const itemIndex = documentData.findIndex(
      (item) => item.DrawingUrl === drawing.DrawingUrl
    );

    if (itemIndex !== -1) {
      documentData.splice(itemIndex, 1); // Remove the item
    }

    await updateDoc(folderRef, {
      Drawings: documentData,
    });
  } catch (error) {
    console.error("Error add drawings:", error);
  }
};

export {
  db,
  auth,
  storage,
  LogInAccount,
  SignUpAccount,
  updateProfile,
  uploadVideo,
  logOut,
  setStarVideo,
  setWatchHistory,
  saveDrawing,
  updateDrawingName,
  deleteDrawing,
  favouriteDrawings,
  resetPassword,
  createFolder,
  deleteFolder,
  addDrawing,
  deleteDrawingfromFolder,
};
