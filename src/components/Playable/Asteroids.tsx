import { useGLTF } from "@react-three/drei";
import {
  RigidBody,
  RigidBodyProps,
  RapierRigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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

type AsteroidProps = RigidBodyProps & {
  onDestroy: (id: number) => void;
  id: number;
};

function Asteroid({ onDestroy, id, ...props }: AsteroidProps) {
  const { nodes, materials } = useGLTF(
    "/models/Asteroid.glb"
  ) as unknown as GLTFResult;
  const asteroidRef = useRef<RapierRigidBody>(null);
  const [collided, setCollided] = useState(false);

  useFrame(() => {
    if (asteroidRef.current) {
      const position = asteroidRef.current.translation();
      const force = new THREE.Vector3(-position.x, -position.y, -position.z);
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

  useEffect(() => {
    if (collided) {
      const handle = requestAnimationFrame(() => {
        onDestroy(id);
      });

      return () => cancelAnimationFrame(handle);
    }
  }, [collided, id, onDestroy]);

  const handleCollision = () => {
    setCollided(true);
  };

  return (
    <RigidBody
      ref={asteroidRef}
      type='dynamic'
      mass={1}
      canSleep={false}
      linearDamping={0}
      angularDamping={0}
      onCollisionEnter={handleCollision}
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

type AsteroidData = {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export default function SpawnAsteroids() {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const { pause } = useGame();

  function randomValue(max: number, min: number) {
    const value = Math.random() * (max - min) + min;
    return Math.random() < 0.5 ? -value : value;
  }

  useEffect(() => {
    const initialAsteroids = Array.from({ length: 5 }, (_, id) => ({
      id,
      position: [randomValue(80, -80), 0, -300] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 0.5,
    }));

    setAsteroids(initialAsteroids);
  }, []);

  // Spawn asteroids
  useEffect(() => {
    if (pause === false) {
      const asteroidInterval = setInterval(() => {
        const asteroidX = randomValue(100, -100);
        const asteroidZ = -250 - Math.random() * 100;
        const scale = 0.5 + Math.random() * 0.5;

        setAsteroids((prev) => {
          const newAsteroids = [
            ...prev,
            {
              id: Date.now(),
              position: [asteroidX, 0, asteroidZ] as [number, number, number],
              rotation: [
                randomValue(-Math.random() / 2, Math.random() / 2),
                randomValue(-Math.random() / 2, Math.random() / 2),
                randomValue(-Math.random() / 2, Math.random() / 2),
              ] as [number, number, number],
              scale,
            },
          ];

          if (newAsteroids.length > 20) {
            return newAsteroids.slice(-20);
          }

          return newAsteroids;
        });
      }, 3000);

      return () => clearInterval(asteroidInterval);
    }
  }, [pause]);

  const destroyAsteroid = (id: number) => {
    setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== id));
  };

  return (
    <>
      {asteroids.map(({ id, position, rotation, scale }) => (
        <Asteroid
          key={id}
          id={id}
          onDestroy={destroyAsteroid}
          position={position}
          rotation={rotation}
          scale={scale}
        />
      ))}
    </>
  );
}

useGLTF.preload("/models/Asteroid.glb");
