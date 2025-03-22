import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import explosionVertexShader from "./shaders/explosion-vertex.vert";
import explosionFragmentShader from "./shaders/explosion-fragment.frag";
import { useFrame } from "@react-three/fiber";

interface ExplosionProps {
  position: [number, number, number];
  onComplete: () => void;
  scale?: number;
}

export default function Explosion({
  position,
  scale,
  onComplete,
}: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [lifetime, setLifetime] = useState(0);
  const maxLifetime = 1.5;

  const explosionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#ff9500") },
        color2: { value: new THREE.Color("#ff0000") },
      },
      vertexShader: explosionVertexShader,
      fragmentShader: explosionFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    setLifetime((prev) => {
      const newLifetime = prev + delta;

      if (newLifetime >= maxLifetime) {
        onComplete();
        return maxLifetime;
      }

      return newLifetime;
    });

    // Update explosion shader
    explosionMaterial.uniforms.time.value = lifetime / maxLifetime;

    // Scale explosion over time
    if (groupRef.current && scale) {
      const currentScale = scale * (1 + lifetime * 1.5);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshNormalMaterial />
        {/* <shaderMaterial
          vertexShader={explosionMaterial.vertexShader}
          fragmentShader={explosionMaterial.fragmentShader}
        /> */}
      </mesh>
    </group>
  );
}
