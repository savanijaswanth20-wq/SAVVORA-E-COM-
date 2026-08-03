import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const LightSweep: React.FC<{
  startFrame?: number;
  durationInFrames?: number;
}> = ({ startFrame = 0, durationInFrames = 45 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame - startFrame,
    [0, durationInFrames],
    [-100, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    frame - startFrame,
    [0, durationInFrames * 0.2, durationInFrames * 0.8, durationInFrames],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="w-48 h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent transform -rotate-45"
        style={{
          transform: `translateX(${progress}%) rotate(-45deg)`,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};
