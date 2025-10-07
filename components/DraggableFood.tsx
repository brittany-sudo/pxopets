import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { clampToBounds, overlapArea, Rect } from "../utils/dragMath";

type Props = {
  src: any; // require('...') or { uri }
  containerSize: { width: number; height: number };
  petRect: Rect;           // coordinates RELATIVE to the container
  onFed: () => void;       // do inventory--, stamina+, hunger+ here
};

export default function DraggableFood({ src, containerSize, petRect, onFed }: Props) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);

  const [foodSize, setFoodSize] = useState({ width: 30, height: 30 });

  // spawn bottom-center, in-bounds
  const spawnPos = useMemo(() => {
    const px = Math.round(containerSize.width / 2 - foodSize.width / 2);
    const py = Math.round(containerSize.height - foodSize.height - 16);
    return clampToBounds(px, py, containerSize.width, containerSize.height, foodSize.width, foodSize.height);
  }, [containerSize, foodSize]);

  // initialize x/y when sizes known
  useEffect(() => {
    x.value = spawnPos.x;
    y.value = spawnPos.y;
  }, [spawnPos.x, spawnPos.y, x, y]);

  // measure food once it lays out (so we keep it in-bounds even if bigger/smaller than 60)
  const onFoodLayout = useCallback(({ nativeEvent }: any) => {
    const { width, height } = nativeEvent.layout;
    setFoodSize((prev) => {
      if (prev.width === width && prev.height === height) return prev;
      // after size update, re-clamp current position
      const clamped = clampToBounds(x.value, y.value, containerSize.width, containerSize.height, width, height);
      x.value = clamped.x;
      y.value = clamped.y;
      return { width, height };
    });
  }, [containerSize, x, y]);

  // drag gesture
  const pan = Gesture.Pan()
    .onBegin(() => {
      scale.value = withTiming(1.05, { duration: 80 });
    })
    .onChange((e) => {
      const nx = x.value + e.changeX;
      const ny = y.value + e.changeY;
      const clamped = clampToBounds(nx, ny, containerSize.width, containerSize.height, foodSize.width, foodSize.height);
      x.value = clamped.x;
      y.value = clamped.y;
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 120 });

      // hit test against pet (15% overlap threshold)
      const foodRect: Rect = { x: x.value, y: y.value, width: foodSize.width, height: foodSize.height };
      const area = overlapArea(foodRect, petRect);
      const minArea = Math.min(foodSize.width * foodSize.height, petRect.width * petRect.height) * 0.15;

      if (area >= minArea) {
        // fly to pet mouth center, shrink, then feed
        const tx = petRect.x + petRect.width / 2 - foodSize.width / 2;
        const ty = petRect.y + petRect.height / 2 - foodSize.height / 2;

        x.value = withTiming(tx, { duration: 180 });
        y.value = withTiming(ty, { duration: 180 });
        scale.value = withTiming(0.1, { duration: 180 }, (finished) => {
          if (finished) runOnJS(onFed)();
        });
      }
    })
    .runOnJS(true); // we call onFed from UI thread callback

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Number.isFinite(x.value) ? x.value : 10 }, 
      { translateY: Number.isFinite(y.value) ? y.value : 10 }, 
      { scale: scale.value || 1 }
    ],
    opacity: 1, // Force visible
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.abs, animStyle]} onLayout={onFoodLayout}>
        <Image source={src} style={{ width: foodSize.width, height: foodSize.height }} resizeMode="contain" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  abs: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 9999, // Ensure it's on top
  },
});

