import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

/**
 * Animated candle glow:
 * - opacity: 0.62..0.82 via layered sines
 * - slight XY jitter: ~±1px
 * - subtle radius wobble
 */
export default function CandleGlowAnimated({
  x, y, baseR,
}: { x: number; y: number; baseR: number }) {
  const clock = useClockValue();

  // time in seconds (SkiaValue<number>)
  const t = useComputedValue(() => clock.current / 1000, [clock]);

  // intensity (SkiaValue<number>) — keep subtle
  const opacity = useComputedValue(() => {
    const slow = Math.sin(t.current * 0.7) * 0.06;
    const mid  = Math.sin(t.current * 6.3 + 0.9) * 0.05;
    const fast = Math.sin(t.current * 12.7 + 2.1) * 0.03 + Math.sin(t.current * 17.9) * 0.02;
    let v = 0.70 + slow + mid + fast; // ~0.58..0.86
    if (v < 0.62) v = 0.62;
    if (v > 0.82) v = 0.82;
    return v;
  }, [t]);

  // tiny position jitter (SkiaValue<number>)
  const jx = useComputedValue(
    () => Math.sin(t.current * 3.9) * 0.9 + Math.sin(t.current * 7.7) * 0.4,
    [t]
  );
  const jy = useComputedValue(
    () => Math.cos(t.current * 4.3) * 0.9 + Math.sin(t.current * 6.2) * 0.3,
    [t]
  );

  // radius wobble coupled to opacity
  const rCore = useComputedValue(
    () => baseR * (0.56 + (opacity.current - 0.70) * 0.20), // ±~5–6%
    [opacity, baseR]
  );
  const rHalo = useComputedValue(
    () => baseR * (0.92 + (opacity.current - 0.70) * 0.14),
    [opacity, baseR]
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow */}
      <Group opacity={opacity} transform={[{ translateX: jx }, { translateY: jy }]}>
        <Circle cx={0} cy={0} r={rCore}>
          <RadialGradient
            c={vec(0, 0)} r={rCore}
            colors={[
              "rgba(255,220,150,0.34)",
              "rgba(255,185,100,0.10)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={10} />
      </Group>

      {/* Halo */}
      <Group opacity={useComputedValue(() =>
          Math.max(0.48, opacity.current) * 0.60, [opacity]
        )}
        transform={[{ translateX: jx }, { translateY: jy }]}
      >
        <Circle cx={0} cy={0} r={rHalo}>
          <RadialGradient
            c={vec(0, 0)} r={rHalo}
            colors={[
              "rgba(255,200,120,0.14)",
              "rgba(255,170,80,0.06)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={16} />
      </Group>
    </Group>
  );
}






