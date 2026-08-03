import React from "react";
import { Composition } from "remotion";
import { SavvoraPromo } from "./SavvoraPromo";
import "./style.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SavvoraPromo"
        component={SavvoraPromo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
