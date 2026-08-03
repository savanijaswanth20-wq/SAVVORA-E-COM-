import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1LogoIntro } from "./scenes/Scene1LogoIntro";
import { Scene2HeroShowcase } from "./scenes/Scene2HeroShowcase";
import { Scene3PriceDrop } from "./scenes/Scene3PriceDrop";
import { Scene4ProductWall } from "./scenes/Scene4ProductWall";
import { Scene5OutroCTA } from "./scenes/Scene5OutroCTA";

export const SavvoraPromo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-[#0B0B10]">
      {/* SCENE 1: Logo Intro (0s - 3s / Frames 0 - 90) */}
      <Sequence from={0} durationInFrames={90} name="Scene 1: Logo Intro">
        <Scene1LogoIntro />
      </Sequence>

      {/* SCENE 2: Hero Showcase (3s - 8s / Frames 90 - 240) */}
      <Sequence from={90} durationInFrames={150} name="Scene 2: Hero Showcase">
        <Scene2HeroShowcase />
      </Sequence>

      {/* SCENE 3: Price Strike & Drop (8s - 11s / Frames 240 - 330) */}
      <Sequence from={240} durationInFrames={90} name="Scene 3: Price Drop">
        <Scene3PriceDrop />
      </Sequence>

      {/* SCENE 4: Product Wall & Badges (11s - 16s / Frames 330 - 480) */}
      <Sequence from={330} durationInFrames={150} name="Scene 4: Product Wall">
        <Scene4ProductWall />
      </Sequence>

      {/* SCENE 5: Trust Badges & Outro CTA (16s - 20s / Frames 480 - 600) */}
      <Sequence from={480} durationInFrames={120} name="Scene 5: Outro CTA">
        <Scene5OutroCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
