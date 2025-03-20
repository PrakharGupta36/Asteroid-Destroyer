import { useMemo, useRef } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/booster-vertex.vert";
import fragmentShader from "./shaders/booster-fragment.frag";
import { useFrame } from "@react-three/fiber";

export default function Boosters() {
  const leftBoosterMesh = useRef<THREE.Mesh>(null);
  const leftBoosterMaterial = useRef<THREE.ShaderMaterial>(null);

  const rightBoosterMesh = useRef<THREE.Mesh>(null);
  const rightBoosterMaterial = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;

    if (leftBoosterMaterial.current && rightBoosterMaterial.current) {
      leftBoosterMaterial.current.uniforms.u_time.value =
        0.4 * clock.getElapsedTime();
      rightBoosterMaterial.current.uniforms.u_time.value =
        0.4 * clock.getElapsedTime();
    }
  });

  return (
    <group>
      <mesh
        ref={leftBoosterMesh}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={15}
        position={[600, -20, -150]}
      >
        <boxGeometry args={[10, 1.5, 1]} />
        <shaderMaterial
          ref={leftBoosterMaterial}
          side={THREE.DoubleSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <mesh
        ref={rightBoosterMesh}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        scale={15}
        position={[600, -20, 150]}
      >
        <boxGeometry args={[10, 1.5, 1]} />
        <shaderMaterial
          ref={rightBoosterMaterial}
          side={THREE.DoubleSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}
