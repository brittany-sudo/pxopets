import { Group, Circle, RadialGradient, vec, Blur } from "@shopify/react-native-skia";

export function CandleGlowPretty({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {/* Core */}
      <Group opacity={0.78}>
        <Circle cx={0} cy={0} r={r * 0.55}>
          <RadialGradient
            c={vec(0, 0)} r={r * 0.55}
            colors={[
              "rgba(255,220,150,0.38)",
              "rgba(255,185,100,0.12)",
              "rgba(255,185,100,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={10} />
      </Group>
      {/* Halo - larger and more extended */}
      <Group opacity={0.5}>
        <Circle cx={0} cy={0} r={r * 1.4}>
          <RadialGradient
            c={vec(0, 0)} r={r * 1.4}
            colors={[
              "rgba(255,200,120,0.16)",
              "rgba(255,170,80,0.08)",
              "rgba(255,170,80,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={20} />
      </Group>
      {/* Extended outer glow */}
      <Group opacity={0.3}>
        <Circle cx={0} cy={0} r={r * 2.0}>
          <RadialGradient
            c={vec(0, 0)} r={r * 2.0}
            colors={[
              "rgba(255,180,90,0.08)",
              "rgba(255,160,70,0.04)",
              "rgba(255,160,70,0.00)",
            ]}
          />
        </Circle>
        <Blur blur={30} />
      </Group>
    </Group>
  );
}






