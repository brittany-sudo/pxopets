import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur, BlendMode,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

export default function SimpleCandleFlicker({
  x, y, baseR,
}: {
  x: number; y: number; baseR: number;
}) {
  const clock = useClockValue();

  // Simple realistic flicker using multiple sine waves
  const flicker = useComputedValue(() => {
    const t = clock.current / 1000;
    
    // Multiple frequencies for realistic flicker
    const slow = Math.sin(t * 0.8) * 0.15;
    const medium = Math.sin(t * 4.2) * 0.1;
    const fast = Math.sin(t * 8.7) * 0.05;
    const micro = Math.sin(t * 15.3) * 0.03;
    
    // Combine all frequencies
    const intensity = 0.7 + slow + medium + fast + micro;
    
    // Clamp between 0.4 and 1.0
    return Math.max(0.4, Math.min(1.0, intensity));
  }, [clock]);

  // Slight position jitter
  const jitterX = useComputedValue(() => {
    const t = clock.current / 1000;
    return Math.sin(t * 3.1) * 0.8 + Math.sin(t * 6.7) * 0.3;
  }, [clock]);

  const jitterY = useComputedValue(() => {
    const t = clock.current / 1000;
    return Math.cos(t * 2.8) * 0.6 + Math.sin(t * 5.4) * 0.2;
  }, [clock]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow */}
      <Group
        opacity={flicker}
        transform={[{ translateX: jitterX }, { translateY: jitterY }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={baseR * 0.6}>
          <RadialGradient
            c={vec(0, 0)} r={baseR * 0.6}
            colors={[
              "rgba(255,220,150,0.4)",
              "rgba(255,185,100,0.15)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={8} />
      </Group>

      {/* Halo */}
      <Group
        opacity={useComputedValue(() => flicker.current * 0.6, [flicker])}
        transform={[{ translateX: jitterX }, { translateY: jitterY }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={baseR * 1.2}>
          <RadialGradient
            c={vec(0, 0)} r={baseR * 1.2}
            colors={[
              "rgba(255,200,120,0.2)",
              "rgba(255,170,80,0.08)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={12} />
      </Group>

      {/* Outer glow */}
      <Group
        opacity={useComputedValue(() => flicker.current * 0.3, [flicker])}
        transform={[{ translateX: jitterX }, { translateY: jitterY }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={baseR * 1.8}>
          <RadialGradient
            c={vec(0, 0)} r={baseR * 1.8}
            colors={[
              "rgba(255,180,90,0.1)",
              "rgba(255,160,70,0.04)",
              "rgba(255,160,70,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={20} />
      </Group>
    </Group>
  );
}






