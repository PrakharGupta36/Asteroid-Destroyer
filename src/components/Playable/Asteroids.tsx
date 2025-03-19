import { useGLTF } from "@react-three/drei";
import {
  RigidBody,
  RigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";

type GLTFResult = {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.Material;
  };
};

function Asteroids(props: RigidBodyProps) {
  const { nodes, materials } = useGLTF(
    "/Asteroid.glb"
  ) as unknown as GLTFResult;
  const asteroidRef = useRef<RapierRigidBody>(null);


  useFrame(() => {
    if (asteroidRef.current) {
      const position = asteroidRef.current.translation();
      const force = new THREE.Vector3(-position.x, -position.y, -position.z); // Pull towards center
      force.normalize().multiplyScalar(0.07);

      asteroidRef.current.applyImpulse(force, true);

      const rotationForce = new THREE.Vector3(
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.02 - 0.01
      );

      asteroidRef.current.applyTorqueImpulse(rotationForce, true);
    }
  });

  return (
    <RigidBody
      ref={asteroidRef}
      type='dynamic'
      mass={1}
      canSleep={false}
      linearDamping={0}
      angularDamping={0}
      {...props}
    >
      <group dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials["Material.003"]}
          rotation={[0, 0, 0]}
        />
      </group>
    </RigidBody>
  );
}

export default function SpawnAsteroids() {
  const { pause } = useGame();

  function randomValue(max: number, min: number) {
    const value = Math.random() * (max - min) + min;
    return Math.random() < 0.5 ? -value : value;
  }

  const initialAsteroids = useMemo(() => {
    return Array.from({ length: 5 }, (_, id) => ({
      id,
      position: [randomValue(80, -80), 0, -300],
      rotation: [0, 0, 0],
      scale: 0.5,
    }));
  }, []);

  const asteroidRef = useRef(initialAsteroids);

  // Spawn asteroids
  useEffect(() => {
    if (pause === false) {
      const asteroidInterval = setInterval(() => {
        const asteroidX = randomValue(100, -100);
        const asteroidZ = -250 - Math.random() * 100;
        const scale = 0.5 + Math.random() * 0.5;

        asteroidRef.current.push({
          id: asteroidRef.current.length + 1,
          position: [asteroidX, 0, asteroidZ],
          rotation: [
            randomValue(-Math.random() / 2, Math.random() / 2),
            randomValue(-Math.random() / 2, Math.random() / 2),
            randomValue(-Math.random() / 2, Math.random() / 2),
          ],
          scale,
        });

        if (asteroidRef.current.length > 30) {
          asteroidRef.current = asteroidRef.current.slice(-30);
        }
      }, 3000);

      return () => clearInterval(asteroidInterval);
    }
  }, [pause]);

  return (
    <>
      {asteroidRef.current?.map(({ id, position, rotation, scale }) => (
        <Asteroids
          key={id}
          position={[...position] as [number, number, number]}
          rotation={[...rotation] as [number, number, number]}
          scale={scale}
        />
      ))}
    </>
  );
}

useGLTF.preload("/Asteroid.glb");
