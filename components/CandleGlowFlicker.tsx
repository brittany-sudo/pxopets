import React from "react";
import {
  Group, Circle, RadialGradient, vec, Blur,
  useClockValue, useComputedValue
} from "@shopify/react-native-skia";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function CandleGlowFlicker({
  x, y, baseR,
  coreAlpha = 0.34, haloAlpha = 0.14,
  enableHalo = true,
}: {
  x: number; y: number; baseR: number;
  coreAlpha?: number; haloAlpha?: number; enableHalo?: boolean;
}) {
  const clock = useClockValue();
  const t = useComputedValue(() => clock.current / 1000, [clock]);

  // smooth layered flicker
  const opacity = useComputedValue(() => {
    const slow = Math.sin(t.current * 0.7) * 0.04;
    const mid  = Math.sin(t.current * 6.2 + 0.9) * 0.05;
    const fast = Math.sin(t.current * 12.7 + 2.1) * 0.03 + Math.sin(t.current * 17.9) * 0.02;
    return clamp(0.70 + slow + mid + fast, 0.62, 0.82);
  }, [t]);

  // tiny wobble
  const jx = useComputedValue(() => Math.sin(t.current * 3.9) * 0.9, [t]);
  const jy = useComputedValue(() => Math.cos(t.current * 4.3) * 0.9, [t]);

  // radii coupled to intensity
  const rCore = useComputedValue(
    () => baseR * (0.56 + (opacity.current - 0.70) * 0.18),
    [opacity, baseR]
  );
  const rHalo = useComputedValue(
    () => baseR * (0.92 + (opacity.current - 0.70) * 0.12),
    [opacity, baseR]
  );

  const haloOpacity = useComputedValue(
    () => Math.max(0.48, opacity.current) * 0.60,
    [opacity]
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core */}
      <Group opacity={opacity} transform={[{ translateX: jx }, { translateY: jy }]}>
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
      {enableHalo && (
        <Group opacity={haloOpacity} transform={[{ translateX: jx }, { translateY: jy }]}>
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
      )}
    </Group>
  );
}






