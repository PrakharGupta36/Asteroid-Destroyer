import { useGLTF, useProgress } from "@react-three/drei";
import {
  RigidBody,
  type RigidBodyProps,
  type RapierRigidBody,
  CuboidCollider,
  CollisionEnterHandler,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";
import Explosion from "./components/Explosion";

type GLTFResult = {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.Material;
  };
};

type AsteroidProps = RigidBodyProps & {
  onDestroy: (id: number, position: [number, number, number]) => void;
  id: number;
};

function Asteroid({ onDestroy, id, ...props }: AsteroidProps) {
  const { nodes, materials } = useGLTF(
    "/models/Asteroid.glb"
  ) as unknown as GLTFResult;
  const asteroidRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [collided, setCollided] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const {
    setIsOverAsteroid,
    asteroidDestroyed,
    setAsteroidDestroyed,
    currentLevel,
  } = useGame();

  useFrame(() => {
    if (asteroidRef.current) {
      const pos = asteroidRef.current.translation();
      setPosition([pos.x, pos.y, pos.z]);

      const force = new THREE.Vector3(-pos.x, -pos.y, -pos.z);
      force
        .normalize()
        .multiplyScalar(
          currentLevel === 1
            ? 0.3
            : currentLevel === 2
            ? 0.4
            : currentLevel === 3
            ? 0.5
            : 0.3
        );

      asteroidRef.current.applyImpulse(force, true);

      const rotationForce = new THREE.Vector3(
        Math.random() * 0.25 - 0.01,
        Math.random() * 0.25 - 0.01,
        Math.random() * 0.25 - 0.01
      );

      asteroidRef.current.applyTorqueImpulse(rotationForce, true);
    }
  });

  useEffect(() => {
    if (collided) {
      const handle = requestAnimationFrame(() => {
        onDestroy(id, position);
      });

      return () => cancelAnimationFrame(handle);
    }
  }, [collided, id, onDestroy, position]);

  const handleCollision: CollisionEnterHandler = ({
    other,
    rigidBodyObject,
  }) => {
    if (!rigidBodyObject) return;
    if (
      other.rigidBodyObject?.name?.includes("spaceship") ||
      rigidBodyObject?.name?.includes("asteroid")
    ) {
      setCollided(true);
    }
    if (other.rigidBodyObject?.name?.includes("laser")) {
      setAsteroidDestroyed(asteroidDestroyed + 1);
      setCollided(true);
    }
  };

  return (
    <RigidBody
      ref={asteroidRef}
      type='dynamic'
      mass={1}
      canSleep={false}
      linearDamping={0}
      angularDamping={0}
      scale={3}
      onCollisionEnter={handleCollision}
      name={`asteroid-${id}`}
      colliders={false}
      {...props}
    >
      <CuboidCollider args={[3, 3, 3]} />

      <mesh
        ref={meshRef}
        geometry={nodes.Object_2.geometry}
        material={materials["Material.003"]}
        rotation={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsOverAsteroid(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsOverAsteroid(false);
        }}
      />
    </RigidBody>
  );
}

type AsteroidData = {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

type ExplosionData = {
  id: number;
  position: [number, number, number];
  scale: number;
};

export default function SpawnAsteroids() {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const asteroidSound = new Audio("/sounds/asteroidSound.mp3");
  const { pause, settings, currentLevel } = useGame();
  const { progress } = useProgress();

  function randomValue(max: number, min: number) {
    const value = Math.random() * (max - min) + min;
    return Math.random() < 0.5 ? -value : value;
  }

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setExplosions((prev) =>
        prev.filter((explosion) => {
          return now - explosion.id < 2000;
        })
      );
    }, 2000);

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const initialAsteroids = Array.from({ length: 5 }, (_, id) => ({
        id,
        position: [randomValue(80, -80), 0, -300] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        scale: 0.5,
      }));

      setAsteroids(initialAsteroids);
    }
  }, [progress]);

  useEffect(() => {
    if (pause === false) {
      const asteroidInterval = setInterval(
        () => {
          const asteroidX = randomValue(100, -100);
          const asteroidZ = -250 - Math.random() * 100;
          const scale = 0.5 + Math.random() * 0.75;

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
        },
        currentLevel == 1
          ? 3000
          : currentLevel === 2
          ? 1500
          : currentLevel === 3
          ? 1000
          : 3000
      );

      return () => clearInterval(asteroidInterval);
    }
  }, [currentLevel, pause]);

  const destroyAsteroid = (id: number, position: [number, number, number]) => {
    const asteroid = asteroids.find((ast) => ast.id === id);
    const explosionScale = asteroid?.scale || 1;

    if (settings[1].value) {
      asteroidSound.currentTime = 0;
      asteroidSound.volume = 0.1;
      asteroidSound.play();
    }

    setExplosions((prev) => [
      ...prev,
      {
        id: Date.now() * Math.random(),
        position,
        scale: explosionScale * 1.5,
      },
    ]);

    setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== id));
  };

  const removeExplosion = (id: number) => {
    setExplosions((prev) => prev.filter((explosion) => explosion.id !== id));
  };

  return (
    <>
      {progress >= 100 &&
        asteroids.map(({ id, position, rotation, scale }) => (
          <Asteroid
            key={id}
            id={id}
            onDestroy={destroyAsteroid}
            position={position}
            rotation={rotation}
            scale={scale}
          />
        ))}

      {explosions.map(({ id, position, scale }) => (
        <Explosion
          key={id}
          position={position}
          scale={scale}
          onComplete={() => removeExplosion(id)}
        />
      ))}
    </>
  );
}

useGLTF.preload("/models/Asteroid.glb");
