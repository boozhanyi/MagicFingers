import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../Backend/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { addDrawing } from "../Backend/Firebase";

export default function AddDrawing({ isVisible, onClose, folder }) {
  const [drawings, setDrawings] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const user = auth.currentUser;
    const drawingRef = collection(db, "Users", user.uid, "Drawings");

    const unsubscribe = onSnapshot(drawingRef, (snapshot) => {
      const drawings = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        drawings.push({
          DrawingId: doc.id,
          DrawingName: data.DrawingName,
          DrawingUrl: data.DrawingUrl,
          Time: data.TimeStamp,
        });
      });
      setDrawings(drawings);
    });
    return () => {
      unsubscribe(); // Unsubscribe when the cleanup function is called
    };
  };

  const add = (drawing) => {
    addDrawing(drawing, folder);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View className="flex-1 justify-center items-center">
        <View className="w-11/12 p-10 bg-cyan-50 shadow-xl shadow-slate-950 items-center rounded-xl sm:w-1/2 sm:h-1/2">
          <Text className="text-base font-bold sm:text-2xl">Add a drawing</Text>
          <ScrollView
            style={{ maxHeight: width > 600 ? 500 : 200, marginTop: 5 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex flex-row flex-wrap">
              {drawings.map((drawing, index) => (
                <View key={index} className="w-1/2 justify-center items-center">
                  <Pressable
                    onPress={() => add(drawing)}
                    className="mt-5 border rounded-2xl w-11/12 h-10 justify-center items-center bg-white active:bg-slate-200 sm:h-16"
                  >
                    <Text className="sm:text-xl">{drawing.DrawingName}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>

          <Pressable
            onPress={onClose}
            className="border justify-center items-center w-1/2 h-10 mt-5 rounded-2xl bg-cyan-100 active:bg-white sm:h-16"
          >
            <Text className="sm:text-xl">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
