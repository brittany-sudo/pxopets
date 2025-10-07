import React, { useEffect } from "react";
import { Group, Circle, RadialGradient, vec, Blur, BlendMode } from "@shopify/react-native-skia";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";

// tiny random-walk helper (smooth, non-sine)
function stepToward(v: number, target: number, k = 0.18) {
  return v + (target - v) * k;
}

export default function CandleGlow({
  x, y, baseR,
}: { x: number; y: number; baseR: number }) {
  // Use regular state for Skia props
  const [intensity, setIntensity] = React.useState(0.72);
  const [jitterX, setJitterX] = React.useState(0);
  const [jitterY, setJitterY] = React.useState(0);
  const [radius, setRadius] = React.useState(baseR);

  useEffect(() => {
    let v = 0.72;
    let r = baseR;
    let jx = 0, jy = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;

      // pick soft new targets
      const next = 0.62 + Math.random() * 0.20;         // 0.62–0.82
      const nextR = baseR * (0.96 + Math.random() * 0.08); // ±4%
      const nextJx = (Math.random() - 0.5) * 1.6;       // -0.8..0.8 px
      const nextJy = (Math.random() - 0.5) * 1.6;

      // move v/r/jitter toward targets (internal smoothing)
      v = stepToward(v, next, 0.25);
      r = stepToward(r, nextR, 0.25);
      jx = stepToward(jx, nextJx, 0.35);
      jy = stepToward(jy, nextJy, 0.35);

      // Update state
      setIntensity(v);
      setRadius(r);
      setJitterX(jx);
      setJitterY(jy);

      // schedule next flicker at a slightly irregular interval
      const delay = 90 + Math.random() * 70; // 90–160ms
      setTimeout(tick, delay);
    };

    tick();
    return () => { alive = false; };
  }, [baseR]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow (small, stronger) */}
      <Group
        opacity={intensity}
        transform={[{ translateX: jitterX }, { translateY: jitterY }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={radius * 0.55}>
          <RadialGradient
            c={vec(0, 0)}
            r={radius * 0.55}
            colors={[
              "rgba(255,220,150,0.35)", // warm core
              "rgba(255,180,90,0.10)",
              "rgba(255,180,90,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={12} />
      </Group>

      {/* Halo (bigger, faint) */}
      <Group
        opacity={Math.max(0.48, intensity) * 0.65}
        transform={[{ translateX: jitterX }, { translateY: jitterY }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={radius * 0.95}>
          <RadialGradient
            c={vec(0, 0)}
            r={radius * 0.95}
            colors={[
              "rgba(255,200,120,0.18)",
              "rgba(255,170,80,0.06)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={18} />
      </Group>
    </Group>
  );
}
