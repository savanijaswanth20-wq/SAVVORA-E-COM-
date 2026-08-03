import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const GoldParticles: React.FC<{ count?: number; color?: string }> = ({
  count = 35,
  color = "#F5B301",
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 137.5;
      const x = (Math.sin(seed) * 0.5 + 0.5) * 1920;
      const yBase = (Math.cos(seed * 1.3) * 0.5 + 0.5) * 1080;
      const size = (i % 5) + 3;
      const speed = 0.4 + (i % 4) * 0.3;
      const isBlue = i % 3 === 0;
      return { id: i, x, yBase, size, speed, isBlue };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => {
        const y = (p.yBase - frame * p.speed * 1.5 + 1080) % 1080;
        const opacity = interpolate(
          Math.sin(frame * 0.05 + p.id),
          [-1, 1],
          [0.15, 0.85]
        );
        const particleColor = p.isBlue ? "#2563EB" : color;

        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}px`,
              top: `${y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: particleColor,
              opacity,
              boxShadow: `0 0 ${p.size * 3}px ${particleColor}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </div>
  );
};
