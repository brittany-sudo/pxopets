import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur, BlendMode,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

// Smooth pseudo-random flicker using layered sines (no hard pulsing)
function flickerNoise(t: number) {
  // mix a few frequencies, keep within ~[-1, 1]
  const a = Math.sin(t * 6.7);
  const b = Math.sin(t * 9.1 + 1.4) * 0.6;
  const c = Math.sin(t * 12.3 + 2.2) * 0.35;
  return (a + b + c) / (1 + 0.6 + 0.35);
}

export default function CandleGlowSkia({
  x, y, baseR,
  coreAlpha = 0.32,     // strength of inner glow
  haloAlpha = 0.14,     // strength of outer halo
}: { x: number; y: number; baseR: number; coreAlpha?: number; haloAlpha?: number }) {

  const clock = useClockValue();

  // Compute opacity / radius / tiny jitter on the Skia render thread
  const params = useComputedValue(() => {
    const t = clock.current / 1000;            // seconds
    const n = flickerNoise(t);                 // ~[-1, 1]
    const k = (n + 1) * 0.5;                   // [0, 1]

    // subtle variations
    const intensity = 0.62 + k * 0.20;         // [0.62..0.82]
    const rCore = baseR * (0.54 + k * 0.05);   // ±5% on core radius
    const rHalo = baseR * (0.90 + k * 0.06);   // ±6% on halo radius
    const jx = (Math.sin(t * 3.7) * 0.9);      // ≤ ~1px drift
    const jy = (Math.cos(t * 4.1) * 0.9);

    return { intensity, rCore, rHalo, jx, jy };
  }, [clock, baseR]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow */}
      <Group
        opacity={params.intensity}
        transform={[{ translateX: params.jx }, { translateY: params.jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={params.rCore}>
          <RadialGradient
            c={vec(0, 0)} r={params.rCore}
            colors={[
              `rgba(255,220,150,${coreAlpha})`,
              "rgba(255,185,100,0.10)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={12} />
      </Group>

      {/* Halo */}
      <Group
        opacity={Math.max(0.48, params.intensity) * 0.6}
        transform={[{ translateX: params.jx }, { translateY: params.jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={params.rHalo}>
          <RadialGradient
            c={vec(0, 0)} r={params.rHalo}
            colors={[
              `rgba(255,200,120,${haloAlpha})`,
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






