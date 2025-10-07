import { Group, Circle, RadialGradient, vec } from "@shopify/react-native-skia";

export function CandleGlowLOUD({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core glow */}
      <Circle cx={0} cy={0} r={r * 0.6}>
        <RadialGradient
          c={vec(0, 0)} r={r * 0.6}
          colors={[
            "rgba(255,220,150,0.7)", // Bright core
            "rgba(255,185,100,0.3)",
            "rgba(255,185,100,0.00)",
          ]}
        />
      </Circle>
      {/* Extended glow */}
      <Circle cx={0} cy={0} r={r * 1.5}>
        <RadialGradient
          c={vec(0, 0)} r={r * 1.5}
          colors={[
            "rgba(255,200,120,0.4)", // Extended area
            "rgba(255,170,80,0.15)",
            "rgba(255,170,80,0.00)",
          ]}
        />
      </Circle>
      {/* Outer glow */}
      <Circle cx={0} cy={0} r={r * 2.2}>
        <RadialGradient
          c={vec(0, 0)} r={r * 2.2}
          colors={[
            "rgba(255,180,90,0.2)", // Very extended
            "rgba(255,160,70,0.08)",
            "rgba(255,160,70,0.00)",
          ]}
        />
      </Circle>
    </Group>
  );
}
