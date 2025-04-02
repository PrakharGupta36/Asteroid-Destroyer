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

function Particles({
  count,
  shape,
  lifetime,
  maxLifetime,
}: {
  count: number;
  shape: "box" | "sphere";
  lifetime: number;
  maxLifetime: number;
}) {
  const points = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(count * 3));

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let x, y, z;

      if (shape === "box") {
        x = (Math.random() - 0.5) * 8;
        y = (Math.random() - 0.5) * 10;
        z = (Math.random() - 0.5) * 12;
      } else {
        // Sphere explosion
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.random() * 2;

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }

      positions.set([x, y, z], i * 3);

      velocities.current[i * 3] = (Math.random() - 0.5) * 3;
      velocities.current[i * 3 + 1] = Math.random() * 6;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }

    return positions;
  }, [count, shape]);

  useFrame((_, delta) => {
    if (!points.current) return;

    const positions = points.current.geometry.attributes.position
      .array as Float32Array;
    const gravity = -9.81 * delta * 0.2;

    for (let i = 0; i < count; i++) {
      const index = i * 3;
      positions[index] += velocities.current[index] * delta; // X
      positions[index + 1] += velocities.current[index + 1] * delta; // Y
      positions[index + 2] += velocities.current[index + 2] * delta; // Z

      velocities.current[index + 1] += gravity;

      velocities.current[index] *= 0.98;
      velocities.current[index + 1] *= 0.98;
      velocities.current[index + 2] *= 0.98;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors={true}
        transparent={true}
        color={"red"}
        blending={THREE.AdditiveBlending}
        opacity={Math.max(0, 1 - lifetime / maxLifetime)}
      />
    </points>
  );
}

export default function Explosion({
  position,
  scale = 1,
  onComplete,
}: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [lifetime, setLifetime] = useState(0);
  const maxLifetime = 1.5;
  const completedRef = useRef(false);

  const explosionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: new THREE.Vector2() },
        u_resolution: {
          value: new THREE.Vector2(0.1, 1),
        },
      },
      vertexShader: explosionVertexShader,
      fragmentShader: explosionFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
    });
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || completedRef.current) return;

    const material = meshRef.current.material as
      | THREE.ShaderMaterial
      | undefined;

    if (material?.uniforms?.u_time) {
      material.uniforms.u_time.value += delta;
    }

    const newLifetime = lifetime + delta;

    if (newLifetime >= maxLifetime && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      setLifetime(maxLifetime);
    } else {
      setLifetime(newLifetime);
    }

    if (explosionMaterial.uniforms?.u_time) {
      explosionMaterial.uniforms.u_time.value = lifetime / maxLifetime;
    }

    if (groupRef.current) {
      const currentScale = scale * (1 + lifetime * 1.5);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <shaderMaterial
          uniforms={explosionMaterial.uniforms}
          vertexShader={explosionMaterial.vertexShader}
          fragmentShader={explosionMaterial.fragmentShader}
          transparent={explosionMaterial.transparent}
          blending={explosionMaterial.blending}
          depthWrite={explosionMaterial.depthWrite}
        />
      </mesh>

      <Particles
        count={4000}
        shape='sphere'
        lifetime={lifetime}
        maxLifetime={maxLifetime}
      />
      <Particles
        count={50}
        shape='box'
        lifetime={lifetime}
        maxLifetime={maxLifetime}
      />
    </group>
  );
}
