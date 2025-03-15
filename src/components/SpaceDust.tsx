// Obviously I'm not this smart. It's made by v0 :)

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface SpaceDustProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  area?: number;
}

export default function SpaceDust({
  count = 10,
  color = "#ffffff",
  size = 0.01,
  speed = 0.02,
  area = 100,
}: SpaceDustProps) {
  const mesh = useRef<THREE.Points>(null);

  // Create particles only once
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random position in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = area * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = -speed - Math.random() * 0.1; // Mostly moving toward camera
    }

    return [positions, velocities];
  }, [count, area, speed]);

  // Animation loop
  useFrame(({ camera }) => {
    if (!mesh.current) return;

    const positions = mesh.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Reset particles that go too far
      const distance = Math.sqrt(
        Math.pow(positions[i3] - camera.position.x, 2) +
          Math.pow(positions[i3 + 1] - camera.position.y, 2) +
          Math.pow(positions[i3 + 2] - camera.position.z, 2)
      );

      if (distance > area || positions[i3 + 2] > camera.position.z) {
        // Reset to a position in front of the camera
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = area * Math.random();

        positions[i3] = camera.position.x + r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] =
          camera.position.y + r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = camera.position.z - area;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={positions}
          args={[positions, 3]}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
