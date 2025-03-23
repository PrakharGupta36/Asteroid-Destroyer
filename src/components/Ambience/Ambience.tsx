import { Stars, Environment, Grid } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import DistantPlanets from "./components/DistantPlanets";
import PostProcessing from "./components/PostProcessing";
import * as THREE from "three";

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 15, 10]} intensity={0.75} />
    </>
  );
}

export default function Ambience() {
  const gridRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.elapsedTime * 5) % 500; // Moves the grid forward
    }
  });

  return (
    <>
      <Stars count={1000} factor={0.5} speed={0.25} radius={500} depth={0.5} />
      <Lighting />
      <DistantPlanets />
      <Grid
        ref={gridRef}
        infiniteGrid
        fadeDistance={400}
        fadeStrength={70}
        cellSize={2}
        cellThickness={0.25}
        cellColor='#2563eb'
        sectionSize={2.95}
        sectionThickness={10.0}
        sectionColor='#60a5fa'
        position={[0, -4, -10]}
        followCamera
      />

      <Environment preset='city' background={false} />

      <PostProcessing />
    </>
  );
}
