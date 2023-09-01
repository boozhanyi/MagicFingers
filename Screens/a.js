import React, { useRef, useState } from "react";
import {
  Canvas,
  useTouchHandler,
  Skia,
  Path,
  Line,
  vec,
  useValue,
  Circle,
  RoundedRect,
  Oval,
  Text as SkiaText,
  useFont,
  useCanvasRef,
  Image as BackgroundImage,
  useImage,
} from "@shopify/react-native-skia";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Modal,
  Alert,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Pencil from "../Components/Pencil";
import Shape from "../Components/Shapes";
import Lines from "../Components/Lines";
import TextView from "../Components/Text";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveDrawing } from "../Backend/Firebase";

export default function A({ route, navigation }) {
  const imageRef = useCanvasRef();
  const currentPath = useRef(null);
  const currentVector = useRef(null);
  const cx = useValue(190);
  const cy = useValue(250);
  const selectedColor = useRef("black");
  const selectedRadius = useRef(1);
  const selectedCircleRadius = useRef(50);
  const selectedWidth = useRef(50);
  const selectedHeight = useRef(50);
  const [selectedSize, setSelectedSize] = useState(50);
  const selectedText = useRef("");
  const drawingTools = useRef(1);
  const font = useFont(require("../assets/OpenSans-Regular.ttf"), selectedSize);
  const [canva, setCanva] = useState([]);
  const [undoCanva, setUndoCanva] = useState([]);
  const [isPencilModelVisible, setPencilVisible] = useState(false);
  const [isShapeModelVisible, setShapeVisible] = useState(false);
  const [isLineModelVisible, setLineVisible] = useState(false);
  const [isTextModelVisible, setTextVisible] = useState(false);
  const [isDeletePressed, setDeletePressed] = useState(false);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const selectedBackgorund = useImage(route.params?.image);
  const [canvaWidth, setCanvaWidth] = useState(0);
  const [canvaHeight, setCanvaHeight] = useState(0);
  const drawingName = route.params?.Name;
  const [backModelVisible, setBackModelVisible] = useState(false);

  if (status === null) {
    requestPermission();
  }

  const onSaveImage = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        quality: 1,
        format: "png",
      });

      await saveDrawing(localUri, drawingName);

      Alert.alert("Saved!");
      navigation.navigate("Function");
    } catch (e) {
      console.log(e);
    }
  };

  const onDownloadImage = async () => {
    try {
      if (canva.length > 0) {
        const localUri = await captureRef(imageRef, {
          quality: 1,
          format: "png",
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } else {
        Alert.alert("You havet draw anything!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSetColor = (color) => {
    selectedColor.current = color;
  };

  const onSetRadius = (value) => {
    selectedRadius.current = value;
  };

  const onSetCircleRadius = (value) => {
    selectedCircleRadius.current = value;
  };

  const onSetWidth = (value) => {
    selectedWidth.current = value;
  };

  const onSetHeight = (value) => {
    selectedHeight.current = value;
  };

  const onSetSize = (value) => {
    setSelectedSize(value);
  };

  const onSetText = (value) => {
    selectedText.current = value;
    drawingTools.current = 6;
    setCanva((prevCanva) => [
      ...prevCanva,
      {
        x: 50,
        y: 300,
        font: font,
        size: selectedSize.current,
        text: selectedText.current,
        type: "text",
      },
    ]);
  };

  const undo = () => {
    setPencilVisible(false);
    setLineVisible(false);
    setShapeVisible(false);
    setTextVisible(false);
    if (canva.length === 0) {
      alert("You cant redo anymore");
    } else {
      const lastCanva = canva[canva.length - 1];
      setCanva((prevCanva) => prevCanva.slice(0, prevCanva.length - 1));
      setUndoCanva((prevUndoCanva) => [...prevUndoCanva, lastCanva]);
    }
  };

  const redo = () => {
    setPencilVisible(false);
    setLineVisible(false);
    setShapeVisible(false);
    setTextVisible(false);
    if (undoCanva.length === 0) {
      alert("You cant undo anymore");
    } else {
      const lastUndoCanva = undoCanva[undoCanva.length - 1];
      setCanva((prevCanva) => [...prevCanva, lastUndoCanva]);
      setUndoCanva((prevUndoCanva) =>
        prevUndoCanva.slice(0, prevUndoCanva.length - 1)
      );
    }
  };

  const deleteCanva = () => {
    setPencilVisible(false);
    setLineVisible(false);
    setShapeVisible(false);
    setTextVisible(false);

    if (canva.length > 0) {
      setDeletePressed(true);
    } else {
      Alert.alert("You have noting to delete");
    }
  };

  const confirmDelete = () => {
    setCanva([]);
    setDeletePressed(false);
  };

  const cancelDelete = () => {
    setDeletePressed(false);
  };

  const onOpenPencil = () => {
    drawingTools.current = 1;
    if (isPencilModelVisible) {
      setPencilVisible(false);
    } else {
      setPencilVisible(true);
      setLineVisible(false);
      setShapeVisible(false);
      setTextVisible(false);
      selectedColor.current = "black";
      selectedRadius.current = 1;
    }
  };

  const onOpenLine = () => {
    drawingTools.current = 2;
    if (isLineModelVisible) {
      setLineVisible(false);
    } else {
      setPencilVisible(false);
      setLineVisible(true);
      setShapeVisible(false);
      setTextVisible(false);
      selectedColor.current = "black";
      selectedRadius.current = 1;
    }
  };

  const onOpenShape = () => {
    if (isShapeModelVisible) {
      setShapeVisible(false);
    } else {
      setPencilVisible(false);
      setLineVisible(false);
      setShapeVisible(true);
      setTextVisible(false);
      selectedColor.current = "black";
      selectedRadius.current = 1;
    }
  };

  const onOpenText = () => {
    if (isTextModelVisible) {
      setTextVisible(false);
    } else {
      setPencilVisible(false);
      setLineVisible(false);
      setShapeVisible(false);
      setTextVisible(true);
      setSelectedSize(50);
    }
  };

  const onClose = () => {
    setShapeVisible(false);
    setTextVisible(false);
  };

  const onSelectShape = (number) => {
    drawingTools.current = number;
    if (number === 3) {
      setCanva((prevCanva) => [
        ...prevCanva,
        {
          cx: cx.current,
          cy: cy.current,
          color: selectedColor.current,
          radius: selectedCircleRadius.current,
          type: "circle",
        },
      ]);
    } else if (number === 4) {
      setCanva((prevCanva) => [
        ...prevCanva,
        {
          x: 50,
          y: 100,
          width: selectedWidth.current,
          height: selectedHeight.current,
          color: selectedColor.current,
          type: "polygon",
        },
      ]);
    } else if (number === 5) {
      setCanva((prevCanva) => [
        ...prevCanva,
        {
          x: 50,
          y: 100,
          width: selectedWidth.current,
          height: selectedHeight.current,
          color: selectedColor.current,
          type: "oval",
        },
      ]);
    }
  };

  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      setLineVisible(false);
      setPencilVisible(false);
      if (drawingTools.current === 1) {
        currentPath.current = Skia.Path.Make();
        currentPath.current.moveTo(x, y);
      } else if (drawingTools.current === 2) {
        currentVector.current = vec(x, y);
      } else if (drawingTools.current === 3) {
        setCanva((prevCanva) => {
          const updatedCanva = [...prevCanva];
          const lastCircle = updatedCanva[updatedCanva.length - 1];
          if (lastCircle && lastCircle.type === "circle") {
            lastCircle.cx = x;
            lastCircle.cy = y;
          }
          return updatedCanva;
        });
      } else if (drawingTools.current === 4) {
        setCanva((prevCanva) => {
          const updatedCanva = [...prevCanva];
          const lastSquare = updatedCanva[updatedCanva.length - 1];
          if (lastSquare && lastSquare.type === "polygon") {
            lastSquare.x = x - selectedWidth.current / 2;
            lastSquare.y = y - selectedHeight.current / 2;
          }
          return updatedCanva;
        });
      } else if (drawingTools.current === 5) {
        setCanva((prevCanva) => {
          const updatedCanva = [...prevCanva];
          const lastOval = updatedCanva[updatedCanva.length - 1];
          if (lastOval && lastOval.type === "oval") {
            lastOval.x = x - selectedWidth.current / 2;
            lastOval.y = y - selectedHeight.current / 2;
          }
          return updatedCanva;
        });
      } else if (drawingTools.current === 6) {
        setCanva((prevCanva) => {
          const updatedCanva = [...prevCanva];
          const lastText = updatedCanva[updatedCanva.length - 1];
          if (lastText && lastText.type === "text") {
            lastText.x = x;
            lastText.y = y;
          }
          return updatedCanva;
        });
      }
    },
    onActive: ({ x, y }) => {
      if (drawingTools.current === 1) {
        currentPath.current?.lineTo(x, y);
      }
    },
    onEnd: ({ x, y }) => {
      if (drawingTools.current === 1) {
        setCanva((prevCanva) => [
          ...prevCanva,
          {
            path: currentPath.current,
            color: selectedColor.current,
            radius: selectedRadius.current,
            type: "drawing",
          },
        ]);
      } else if (drawingTools.current === 2) {
        setCanva((prevCanva) => [
          ...prevCanva,
          {
            startCoor: currentVector.current,
            endCoor: vec(x, y),
            width: selectedRadius.current,
            color: selectedColor.current,
            type: "line",
          },
        ]);
      }
      currentPath.current = null;
      currentVector.current = null;
    },
  });

  const back = () => {
    if (canva.length > 0) {
      setBackModelVisible(true);
    } else {
      navigation.navigate("Function");
    }
  };

  const confirmBack = () => {
    navigation.navigate("Function");
  };

  const cancelBack = () => {
    setBackModelVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={false}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Pressable onPress={back} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={20} color="black" />
            </Pressable>
            <Text style={styles.projectName}>{drawingName}</Text>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#A3FFFE" : "white",
                },
                styles.button,
              ]}
              onPress={onSaveImage}
            >
              <Text style={styles.buttonName}>Save</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "#A3FFFE" : "white",
                },
                styles.button,
              ]}
              onPress={onDownloadImage}
            >
              <Text style={styles.buttonName}>Download</Text>
            </Pressable>
          </View>
          <Canvas
            style={[
              styles.drawingCanva,
              selectedBackgorund
                ? { backgroundColor: "transparent" }
                : { backgroundColor: "white" },
            ]}
            onTouch={onTouch}
            ref={imageRef}
            collapsable={false}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              const height = event.nativeEvent.layout.height;
              setCanvaWidth(width);
              setCanvaHeight(height);
            }}
          >
            {selectedBackgorund && (
              <BackgroundImage
                image={selectedBackgorund}
                fit="fill"
                x={0}
                y={0}
                width={canvaWidth}
                height={canvaHeight}
              />
            )}
            {canva.map((item, index) => {
              if (item.type === "drawing") {
                return (
                  <Path
                    key={index}
                    path={item.path}
                    style="stroke"
                    strokeWidth={item.radius}
                    color={item.color}
                  />
                );
              } else if (item.type === "line") {
                return (
                  <Line
                    key={index}
                    p1={item.startCoor}
                    p2={item.endCoor}
                    strokeWidth={item.width}
                    color={item.color}
                  />
                );
              } else if (item.type === "circle") {
                return (
                  <Circle
                    key={index}
                    cx={item.cx}
                    cy={item.cy}
                    r={item.radius}
                    color={item.color}
                  />
                );
              } else if (item.type === "polygon") {
                return (
                  <RoundedRect
                    key={index}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    r={0}
                    color={item.color}
                  />
                );
              } else if (item.type === "oval") {
                return (
                  <Oval
                    key={index}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    color={item.color}
                  />
                );
              } else if (item.type === "text") {
                return (
                  <SkiaText
                    key={index}
                    x={item.x}
                    y={item.y}
                    font={item.font}
                    text={item.text}
                  />
                );
              }
            })}
          </Canvas>
          <View style={styles.drawingTools}>
            <Pressable onPress={onOpenPencil}>
              <Image
                style={styles.image}
                source={require("../assets/Pencil.png")}
              />
            </Pressable>
            <Pressable onPress={onOpenLine}>
              <Image
                style={styles.image}
                source={require("../assets/Line.png")}
              />
            </Pressable>
            <Pressable onPress={onOpenShape}>
              <Image
                style={styles.image}
                source={require("../assets/Shapes.png")}
              />
            </Pressable>
            <Pressable onPress={onOpenText}>
              <Image
                style={styles.image}
                source={require("../assets/Text.png")}
              />
            </Pressable>
            <Pressable onPress={undo}>
              <Image
                style={styles.image}
                source={require("../assets/Undo.png")}
              />
            </Pressable>
            <Pressable onPress={redo}>
              <Image
                style={styles.image}
                source={require("../assets/Redo.png")}
              />
            </Pressable>
            <Pressable onPress={deleteCanva}>
              <Image
                style={styles.image}
                source={require("../assets/Delete.png")}
              />
            </Pressable>
          </View>
        </View>
        <StatusBar style="auto" />
        <View style={{ alignItems: "center" }}>
          {isPencilModelVisible && (
            <Pencil onSetColor={onSetColor} onSetRadius={onSetRadius} />
          )}
          {isShapeModelVisible && (
            <Shape
              onSetColor={onSetColor}
              onSetRadius={onSetCircleRadius}
              onSetHeight={onSetHeight}
              onSetWidth={onSetWidth}
              onSelectShape={onSelectShape}
              onClose={onClose}
            />
          )}
          {isLineModelVisible && (
            <Lines onSetColor={onSetColor} onSetRadius={onSetRadius} />
          )}

          {isTextModelVisible && (
            <TextView
              onSetSize={onSetSize}
              onSetText={onSetText}
              onSelectShape={onSelectShape}
              onClose={onClose}
            />
          )}
        </View>
        {backModelVisible && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={backModelVisible}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.deleteContainer}>
                <Text style={{ textAlign: "center" }}>
                  You havent save your image! Are you sure you want to go back?
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
                    },
                    styles.confirmButton,
                  ]}
                  onPress={confirmBack}
                >
                  <Text style={{ color: "white" }}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
                    },
                    styles.confirmButton,
                  ]}
                  onPress={cancelBack}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        {isDeletePressed && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={isDeletePressed}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.deleteContainer}>
                <Text>Are you sure you want to delete?</Text>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
                    },
                    styles.confirmButton,
                  ]}
                  onPress={confirmDelete}
                >
                  <Text style={{ color: "white" }}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "rgb(210, 230, 255)" : "black",
                    },
                    styles.confirmButton,
                  ]}
                  onPress={cancelDelete}
                >
                  <Text style={{ color: "white" }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#D2FEFF",
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
  },
  projectName: {
    fontSize: 15,
    marginLeft: 30,
    marginRight: 30,
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    alignContent: "center",
    elevation: 3,
    marginLeft: 20,
  },
  buttonName: {
    fontWeight: "bold",
    fontSize: 10,
  },
  drawingTools: {
    backgroundColor: "#D2FEFF",
    marginTop: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 30,
    height: 30,
    margin: 10,
  },
  drawingCanva: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "white",
  },
  deleteContainer: {
    padding: 50,
    backgroundColor: "#F0FDFF",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderWidth: 1,
  },
  confirmButton: {
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
});
