import React, { useEffect, useRef, useState } from "react";
import {
  Canvas,
  useTouchHandler,
  Skia,
  Path,
  Line,
  vec,
  Circle,
  RoundedRect,
  Oval,
  Text as SkiaText,
  useFont,
  useCanvasRef,
  Image as BackgroundImage,
  useImage,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
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
  Dimensions,
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
  const selectedBackground = useImage(route.params?.image);
  const [background, backgroundSelected] = useState(false);
  const [canvaWidth, setCanvaWidth] = useState(0);
  const [canvaHeight, setCanvaHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const drawingName = route.params?.Name;
  const project = route.params?.project;
  const [backModelVisible, setBackModelVisible] = useState(false);
  const additionalHeight = 100;

  useEffect(() => {
    if (route.params?.image) {
      backgroundSelected(true);
    } else {
      backgroundSelected(false);
    }
  }, []);

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

  if (status === null) {
    requestPermission();
  }

  const onSaveImage = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        quality: 1,
        format: "png",
      });

      await saveDrawing(localUri, drawingName, project);

      Alert.alert("Saved!");
      navigation.navigate("Home");
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
          alert("Saved to your gallery!");
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
          cx: 190,
          cy: 250,
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

  const getPaint = () => {
    const paint = Skia.Paint();
    paint.setStrokeWidth(selectedRadius.current);
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeMiter(5);
    paint.setStrokeCap(StrokeCap.Round);
    paint.setStrokeJoin(StrokeJoin.Round);
    paint.setAntiAlias(true);
    const _color = paint.copy();
    _color.setColor(Skia.Color(selectedColor.current));
    return _color;
  };

  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      setLineVisible(false);
      setPencilVisible(false);
      if (drawingTools.current === 1) {
        currentPath.current = Skia.Path.Make();
        currentPath.current.moveTo(x, y);
        setCanva((prevCanva) => [
          ...prevCanva,
          {
            path: currentPath.current,
            type: "drawing",
            paint: getPaint(),
          },
        ]);
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
        setCanva((prevCanva) => {
          currentPath.current.lineTo(x, y);
          return [
            ...prevCanva.slice(0, prevCanva.length - 1),
            {
              path: currentPath.current,
              type: "drawing",
              paint: getPaint(),
            },
          ];
        });
      }
    },
    onEnd: ({ x, y }) => {
      if (drawingTools.current === 2) {
        setCanva((prevCanva) => [
          ...prevCanva,
          {
            startCoor: currentVector.current,
            endCoor: vec(x, y),
            type: "line",
            paint: getPaint(),
          },
        ]);
      }
      currentPath.current = null;
      currentVector.current = null;
    },
  });

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        enabled={false}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 ">
          <View
            className="flex flex-row bg-cyan-50 p-2 items-center border justify-between sm:p-5"
            onLayout={(event) => {
              const height = event.nativeEvent.layout.height;
              setHeaderHeight(height);
            }}
          >
            <Pressable onPress={back} className="ml-1">
              <Ionicons name="arrow-back" size={20} color="black" />
            </Pressable>
            <Pressable onPress={onOpenPencil}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Pencil.png")}
              />
            </Pressable>
            <Pressable onPress={onOpenLine}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Line.png")}
              />
            </Pressable>
            <Pressable onPress={onOpenShape}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Shapes.png")}
              />
            </Pressable>
            {/* <Pressable onPress={onOpenText}>
              <Image
                className="w-7 h-7"
                source={require("../assets/Text.png")}
              />
            </Pressable> */}
            <Pressable onPress={undo}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Undo.png")}
              />
            </Pressable>
            <Pressable onPress={redo}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Redo.png")}
              />
            </Pressable>
            <Pressable onPress={deleteCanva}>
              <Image
                className="w-7 h-7 sm:h-10 sm:w-10"
                source={require("../assets/Delete.png")}
              />
            </Pressable>
            <Pressable onPress={onSaveImage}>
              <Image
                className="w-6 h-6 sm:h-10 sm:w-10"
                source={require("../assets/Save.png")}
              />
            </Pressable>
          </View>
          <Canvas
            style={[
              styles.drawingCanva,
              background
                ? { backgroundColor: "transparent" }
                : { backgroundColor: "white" },
              {
                height:
                  Dimensions.get("window").height -
                  headerHeight -
                  (Dimensions.get("window").height > 1000
                    ? additionalHeight
                    : 40),
              },
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
            {background && (
              <BackgroundImage
                image={selectedBackground}
                fit="fill"
                x={0}
                y={0}
                width={canvaWidth}
                height={canvaHeight}
              />
            )}
            {canva.map((item, index) => {
              if (item.type === "drawing") {
                return <Path key={index} path={item.path} paint={item.paint} />;
              } else if (item.type === "line") {
                return (
                  <Line
                    key={index}
                    p1={item.startCoor}
                    p2={item.endCoor}
                    paint={item.paint}
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
        </View>
        <StatusBar style="auto" />
        <View>
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
            <View className="flex-1 justify-center items-center">
              <View className="p-10 bg-cyan-50 justify-center items-center border rounded-xl">
                <Text className="text-center sm:text-2xl">
                  You havent save your image! Are you sure you want to go back?
                </Text>
                <Pressable
                  className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                  onPress={confirmBack}
                >
                  <Text className="text-white sm:text-xl">Confirm</Text>
                </Pressable>
                <Pressable
                  className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                  onPress={cancelBack}
                >
                  <Text className="text-white sm:text-xl">Cancel</Text>
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
            <View className="flex-1 justify-center items-center">
              <View className="p-10 bg-cyan-50 justify-center items-center border rounded-xl">
                <Text className="sm:text-2xl">
                  Are you sure you want to delete?
                </Text>
                <Pressable
                  className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                  onPress={confirmDelete}
                >
                  <Text className="text-white sm:text-xl">Confirm</Text>
                </Pressable>
                <Pressable
                  className="bg-black p-2 w-20 mt-5 rounded-xl justify-center items-center sm:w-32"
                  onPress={cancelDelete}
                >
                  <Text className="text-white sm:text-xl">Cancel</Text>
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
  drawingCanva: {
    marginTop: 5,
    backgroundColor: "white",
  },
});
