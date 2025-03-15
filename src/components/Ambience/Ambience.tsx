import useGame from "@/hooks/State";
import { Stars, Environment, Grid } from "@react-three/drei";
import SpaceDust from "./components/SpaceDust";
import DistantPlanets from "../DistantPlanets";
import PostProcessing from "./components/PostProcessing";

function Lighting() {
  return (
    <>
      <ambientLight intensity={1.65} />
      <directionalLight position={[10, 15, 10]} intensity={1} />
    </>
  );
}

export default function Ambience() {
  const { settings } = useGame();

  return (
    <>
      <Stars count={1000} factor={0.5} speed={0.25} radius={500} depth={0.5} />

      <Lighting />
      <DistantPlanets />
      <SpaceDust count={70} size={0.005} />

      <Grid
        infiniteGrid
        fadeDistance={300}
        fadeStrength={20}
        cellSize={1}
        cellThickness={0.1}
        cellColor='#2563eb'
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor='#60a5fa'
        position={[0, -2, -10]}
        followCamera
      />

      <Environment preset='city' background={false} />

      {settings[2].value && <PostProcessing />}
    </>
  );
}
