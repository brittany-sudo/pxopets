import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur, BlendMode,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
function smoothstep(x: number) { return x * x * (3 - 2 * x); }

// Intensity (0..1-ish) with slow+mid+fast layers and optional twinkle
function computeIntensity(t: number, twinkle: boolean) {
  const slow = Math.sin(t * 0.7) * 0.06;
  const mid  = Math.sin(t * 6.3 + 0.9) * 0.05;
  const fast = Math.sin(t * 12.7 + 2.1) * 0.03 + Math.sin(t * 17.9) * 0.02;

  let tw = 0;
  if (twinkle) {
    const gate = (Math.sin(t * 2.1 + 1.7) + Math.sin(t * 1.3 + 0.4) * 0.5 + 1.5) / 3; // 0..1
    const on = smoothstep(Math.max(0, gate - 0.85) / 0.15); // brief bursts
    tw = on * Math.max(0, Math.sin(t * 24.0)) ** 3 * 0.08;
  }

  return clamp(0.70 + slow + mid + fast + tw, 0.60, 0.88);
}

export default function CandleGlowCinematicFixed({
  x, y, baseR,
  coreAlpha = 0.34,
  haloAlpha = 0.14,
  twinkle = true,
  spark = true,
}: {
  x: number; y: number; baseR: number;
  coreAlpha?: number; haloAlpha?: number;
  twinkle?: boolean; spark?: boolean;
}) {
  const clock = useClockValue();

  // time
  const time = useComputedValue(() => clock.current / 1000, [clock]);

  // intensity (SkiaValue<number>)
  const intensity = useComputedValue(
    () => computeIntensity(time.current, twinkle),
    [time, twinkle]
  );

  // radius couple to intensity
  const rCore = useComputedValue(
    () => baseR * (0.54 + (intensity.current - 0.70) * 0.18 + 0.02),
    [intensity, baseR]
  );
  const rHalo = useComputedValue(
    () => baseR * (0.90 + (intensity.current - 0.70) * 0.12 + 0.03),
    [intensity, baseR]
  );

  // tiny position jitter
  const jx = useComputedValue(
    () => Math.sin(time.current * 3.9) * 0.9 + Math.sin(time.current * 7.7) * 0.4,
    [time]
  );
  const jy = useComputedValue(
    () => Math.cos(time.current * 4.3) * 0.9 + Math.sin(time.current * 6.2) * 0.3,
    [time]
  );

  // spark orbit (optional)
  const sx = useComputedValue(() => {
    const spR = 6;
    return Math.cos(time.current * 2.6) * spR + Math.sin(time.current * 5.3) * 1.2;
  }, [time]);
  const sy = useComputedValue(() => {
    const spR = 6;
    return Math.sin(time.current * 2.1) * spR * 0.6 + Math.cos(time.current * 3.7) * 1.0;
  }, [time]);
  const cy = useComputedValue(() => -rCore.current * 0.35 + sy.current, [rCore, sy]);
  const spAlpha = useComputedValue(() => {
    const v = 0.55 + Math.sin(time.current * 9.5) * 0.45;
    return clamp(v, 0.25, 0.95);
  }, [time]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow */}
      <Group
        opacity={intensity}
        transform={[{ translateX: jx }, { translateY: jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={rCore}>
          <RadialGradient
            c={vec(0, 0)} r={rCore}
            colors={[
              `rgba(255,220,150,${coreAlpha})`,
              "rgba(255,185,100,0.10)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={10} />
      </Group>

      {/* Halo */}
      <Group
        opacity={useComputedValue(() => Math.max(0.48, intensity.current) * 0.60, [intensity])}
        transform={[{ translateX: jx }, { translateY: jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={rHalo}>
          <RadialGradient
            c={vec(0, 0)} r={rHalo}
            colors={[
              `rgba(255,200,120,${haloAlpha})`,
              "rgba(255,170,80,0.06)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={16} />
      </Group>

      {/* Tiny spark */}
      {spark && (
        <Group opacity={spAlpha} blendMode={BlendMode.Screen}>
          <Circle cx={sx} cy={cy} r={1.6} color="rgba(255,240,220,0.95)" />
          <Blur blur={1.2} />
        </Group>
      )}
    </Group>
  );
}






