import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
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

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 10);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 8;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 12;

        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      const distance = 1;

      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(theta) * Math.sin(phi);
        const z = distance * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          key={Math.random()}
          attach='attributes-position'
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color='#ff5500'
        transparent={true}
        blending={THREE.AdditiveBlending}
        opacity={1 - lifetime / maxLifetime}
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

  // Ensure we clean up even if animation frames are dropped
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, maxLifetime * 1000 + 100); // Add a small buffer to ensure it runs after the max lifetime

    return () => {
      clearTimeout(timeoutId);
    };
  }, [maxLifetime, onComplete]);

  const explosionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: new THREE.Color("#ff9500") },
        u_color2: { value: new THREE.Color("#ff0000") },
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

    // Update lifetime
    const newLifetime = lifetime + delta;

    // Check if explosion should be complete
    if (newLifetime >= maxLifetime && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      setLifetime(maxLifetime);
    } else {
      setLifetime(newLifetime);
    }

    // Update explosion material
    if (explosionMaterial.uniforms?.u_time) {
      explosionMaterial.uniforms.u_time.value = lifetime / maxLifetime;
    }

    // Scale the explosion
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
        count={2000}
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
