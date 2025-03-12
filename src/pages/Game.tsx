import { Environment, Grid, Loader, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import Asteroid from "../components/Asteroid";
import Spaceship from "../components/Spaceship";

export default function Game() {
  const [asteroidPosition, setAsteroidPosition] = useState([
    { id: 1, position: [90, 0, 90] },
  ]);

  function randomValue() {
    const value = Math.random() * 40 + 50; // Generates a number between 50 and 90
    return Math.random() < 0.5 ? -value : value; // Randomly makes it negative
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAsteroidPosition((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          position: [randomValue(), 0, randomValue()],
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const spaceshipRef = useRef<RapierRigidBody>(null!);

  return (
    <>
      <Canvas shadows>
        <Stars fade={true} count={5000} speed={5} />
        <Physics gravity={[0, 0, 0]}>
          {asteroidPosition.map((e) => (
            <Asteroid
              key={e.id}
              position={e.position as [number, number, number]}
            />
          ))}
          <Suspense fallback={null}>
            <Spaceship spaceshipRef={spaceshipRef} />
          </Suspense>
        </Physics>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Grid infiniteGrid fadeDistance={100} fadeStrength={10} />
        <Environment preset='sunset' />
      </Canvas>
      <Loader />
    </>
  );
}
