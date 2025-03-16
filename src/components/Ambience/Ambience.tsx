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
  return (
    <>
      <Stars count={1000} factor={0.5} speed={0.25} radius={500} depth={0.5} />

      <Lighting />
      <DistantPlanets />
      <SpaceDust count={20} size={0.005} />

      <Grid
        infiniteGrid
        fadeDistance={400}
        fadeStrength={40}
        cellSize={1}
        cellThickness={0.5}
        cellColor='#2563eb'
        sectionSize={1.5}
        sectionThickness={2.0}
        sectionColor='#60a5fa'
        position={[0, -2, -10]}
        followCamera
      />

      <Environment preset='city' background={false} />

      <PostProcessing />
    </>
  );
}
