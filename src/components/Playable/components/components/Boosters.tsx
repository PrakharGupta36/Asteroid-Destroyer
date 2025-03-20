import { useRef } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/booster-vertex.vert";
import fragmentShader from "./shaders/booster-fragment.frag";

export default function Boosters() {
  const plane = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={plane} rotation={[0, 0, 0]} scale={10} position={[500, 2, 2]}>
      <boxGeometry args={[3, 3, 3]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
