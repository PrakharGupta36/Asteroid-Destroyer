import { Stars, Environment, Grid } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function Ambience() {
  const { scene } = useThree();

  useEffect(() => {
    // Create a fog effect
    // Parameters: color, near, far
    const fog = new THREE.FogExp2("#000020", 0.008);
    scene.fog = fog;

    return () => {
      // Clean up when component unmounts
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <Stars fade={true} count={5000} speed={5} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid
        infiniteGrid
        fadeDistance={100}
        fadeStrength={5}
        position={[0, -2, 0]}
      />
      <Environment preset='city' />
    </>
  );
}
