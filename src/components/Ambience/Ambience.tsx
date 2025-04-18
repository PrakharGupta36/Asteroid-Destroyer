import { Stars, Environment, Grid } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import DistantPlanets from "./components/DistantPlanets";
import PostProcessing from "./components/PostProcessing";
import * as THREE from "three";

function Lighting() {
  return (
    <>
      <directionalLight position={[-10, 15, 10]} intensity={1.75} />
      <directionalLight position={[10, 15, 10]} intensity={2.75} />
      <directionalLight position={[-5, 5, 10]} intensity={2.75} />
      <directionalLight position={[5, 5, 10]} intensity={1.75} />
    </>
  );
}

export default function Ambience() {
  const gridRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.elapsedTime * 5) % 500;
    }
  });

  return (
    <>
      <Stars count={5000} factor={0.1} speed={0.1} radius={900} depth={2.0} />
      <Lighting />
      <DistantPlanets />
      <Grid
        ref={gridRef}
        infiniteGrid
        fadeDistance={300}
        fadeStrength={70}
        cellSize={10}
        cellThickness={1.25}
        cellColor='#2563eb'
        sectionSize={2.0}
        sectionThickness={10.0}
        sectionColor='#60a5fa'
        position={[0, -1, -10]}
        followCamera
      />

      <Environment preset='city' background={false} />

      <PostProcessing />
    </>
  );
}
