import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur, BlendMode,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
// soft gate for twinkle bursts (0..1)
function smoothstep(x: number) { return x * x * (3 - 2 * x); }

export default function CandleGlowCinematic({
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

  const p = useComputedValue(() => {
    const t = clock.current / 1000; // seconds

    // ---- Layered "noise" (no single heartbeat)
    // slow "breath"
    const slow  = Math.sin(t * 0.7) * 0.06;       // ±0.06
    // medium flutter
    const mid   = Math.sin(t * 6.3 + 0.9) * 0.05; // ±0.05
    // fast micro-flicker
    const fast  = Math.sin(t * 12.7 + 2.1) * 0.03 + Math.sin(t * 17.9) * 0.02;

    // occasional twinkle burst (short, not frequent)
    let tw = 0;
    if (twinkle) {
      // pseudo-random gate that opens briefly every ~2–4s
      const gate = (Math.sin(t * 2.1 + 1.7) + Math.sin(t * 1.3 + 0.4) * 0.5 + 1.5) / 3; // 0..1
      const on = smoothstep(Math.max(0, gate - 0.82) / 0.18); // opens near the top of gate
      tw = on * Math.max(0, Math.sin(t * 24.0)) ** 3 * 0.08; // brief sparkly bump up to +0.08
    }

    // base intensity with layers
    let intensity = 0.70 + slow + mid + fast + tw;           // ~0.58..0.86
    intensity = clamp(intensity, 0.60, 0.88);

    // couple radius to intensity (subtle)
    const rCore = baseR * (0.54 + (intensity - 0.70) * 0.18 + 0.02); // ±~6–8%
    const rHalo = baseR * (0.90 + (intensity - 0.70) * 0.12 + 0.03); // ±~5–7%

    // tiny flame jitter (sub-pixel wobble)
    const jx = Math.sin(t * 3.9) * 0.9 + Math.sin(t * 7.7) * 0.4;
    const jy = Math.cos(t * 4.3) * 0.9 + Math.sin(t * 6.2) * 0.3;

    // spark orbit path near flame
    const spR = 6; // radius of spark orbit
    const sx = Math.cos(t * 2.6) * spR + Math.sin(t * 5.3) * 1.2;
    const sy = Math.sin(t * 2.1) * spR * 0.6 + Math.cos(t * 3.7) * 1.0;
    const spAlpha = clamp(0.55 + Math.sin(t * 9.5) * 0.45, 0.25, 0.95);

    return { intensity, rCore, rHalo, jx, jy, sx, sy, spAlpha };
  }, [clock, baseR, twinkle, spark]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow (small, stronger) */}
      <Group
        opacity={p.intensity}
        transform={[{ translateX: p.jx }, { translateY: p.jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={p.rCore}>
          <RadialGradient
            c={vec(0, 0)} r={p.rCore}
            colors={[
              `rgba(255,220,150,${coreAlpha})`, // warm core
              "rgba(255,185,100,0.10)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={10} />
      </Group>

      {/* Halo (bigger, faint) */}
      <Group
        opacity={Math.max(0.48, p.intensity) * 0.60}
        transform={[{ translateX: p.jx }, { translateY: p.jy }]}
        blendMode={BlendMode.Screen}
      >
        <Circle cx={0} cy={0} r={p.rHalo}>
          <RadialGradient
            c={vec(0, 0)} r={p.rHalo}
            colors={[
              `rgba(255,200,120,${haloAlpha})`,
              "rgba(255,170,80,0.06)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={16} />
      </Group>

      {/* Tiny spark near the flame (optional but sells "life") */}
      {spark && (
        <Group opacity={p.spAlpha} blendMode={BlendMode.Screen}>
          <Circle cx={p.sx} cy={-p.rCore * 0.35 + p.sy} r={1.6} color="rgba(255,240,220,0.95)" />
          <Blur blur={1.2} />
        </Group>
      )}
    </Group>
  );
}






