import React, { useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Canvas } from "@shopify/react-native-skia";

export function SafeCanvas({
  height = 480,
  children,
  bg = "#1a120d",
}: { height?: number; bg?: string; children: React.ReactNode }) {
  const [w, setW] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const width = Math.floor(e.nativeEvent.layout.width);
    if (width > 0 && width !== w) setW(width);
  };

  return (
    <View onLayout={onLayout} style={{ width: "100%" }}>
      {w ? (
        <Canvas style={{ width: w, height, backgroundColor: bg }}>
          {children}
        </Canvas>
      ) : (
        <View style={{ width: "100%", height, backgroundColor: bg }} />
      )}
    </View>
  );
}






