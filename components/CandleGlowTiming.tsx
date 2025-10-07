import React, { useEffect } from "react";
import {
  Group, Circle, RadialGradient, vec, Blur,
  useValue, runTiming, Easing
} from "@shopify/react-native-skia";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function CandleGlowTiming({
  x, y, baseR,
  coreAlpha = 0.32,
  haloAlpha = 0.12,
  enableHalo = true,
}: {
  x: number; y: number; baseR: number;
  coreAlpha?: number; haloAlpha?: number; enableHalo?: boolean;
}) {
  // Skia values (numbers Skia watches)
  const op   = useValue(0.72);           // 0.62..0.82
  const jx   = useValue(0);              // ~±1px
  const jy   = useValue(0);
  const rC   = useValue(baseR * 0.56);   // core radius
  const rH   = useValue(baseR * 0.92);   // halo radius

  useEffect(() => {
    let alive = true;

    const loop = () => {
      if (!alive) return;

      // pick soft random targets
      const nextOp = clamp(0.62 + Math.random() * 0.20, 0.62, 0.82);
      const nextJx = (Math.random() - 0.5) * 1.6;  // -0.8..0.8 px
      const nextJy = (Math.random() - 0.5) * 1.6;
      const nextRC = baseR * (0.54 + Math.random() * 0.06);
      const nextRH = baseR * (0.90 + Math.random() * 0.06);
      const dur    = 90 + Math.random() * 120;     // 90–210 ms

      // tween toward targets; onComplete, schedule next hop
      runTiming(op, nextOp,   { duration: dur, easing: Easing.out(Easing.cubic) }, loop);
      runTiming(jx, nextJx,   { duration: dur, easing: Easing.inOut(Easing.cubic) });
      runTiming(jy, nextJy,   { duration: dur, easing: Easing.inOut(Easing.cubic) });
      runTiming(rC, nextRC,   { duration: dur, easing: Easing.out(Easing.cubic) });
      runTiming(rH, nextRH,   { duration: dur, easing: Easing.out(Easing.cubic) });
    };

    loop();
    return () => { alive = false; };
  }, [baseR, op, jx, jy, rC, rH]);

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core */}
      <Group opacity={op} transform={[{ translateX: jx }, { translateY: jy }]}>
        <Circle cx={0} cy={0} r={rC}>
          <RadialGradient
            c={vec(0, 0)} r={rC}
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
        <Group opacity={op.map(v => Math.max(0.48, v) * 0.60)}
               transform={[{ translateX: jx }, { translateY: jy }]}>
          <Circle cx={0} cy={0} r={rH}>
            <RadialGradient
              c={vec(0, 0)} r={rH}
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






