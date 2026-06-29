import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FLOW_DURATION_FRAMES } from "./flow/get-state";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={FLOW_DURATION_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
