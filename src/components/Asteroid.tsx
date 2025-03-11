import { useGLTF } from "@react-three/drei";
import {
  RigidBody,
  RigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type GLTFResult = {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.Material;
  };
};

export default function Asteroid(props: RigidBodyProps) {
  const { nodes, materials } = useGLTF(
    "/Asteroid.glb"
  ) as unknown as GLTFResult;
  const asteroidRef = useRef<RapierRigidBody>(null);

  useFrame(() => {
    if (asteroidRef.current) {
      const position = asteroidRef.current.translation(); // Get current position
      const force = new THREE.Vector3(-position.x, -position.y, -position.z); // Pull towards center
      force.normalize().multiplyScalar(0.02); // Small force for smooth movement

      asteroidRef.current.applyImpulse(force, true); // Apply force gently
    }
  });

  return (
    <RigidBody
      ref={asteroidRef}
      type='dynamic'
      mass={1}
      canSleep={false} // Keep it active
      linearDamping={0} // No air resistance
      angularDamping={0} // No rotation resistance
      {...props}
    >
      <group dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["Material.003"]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/Asteroid.glb");
