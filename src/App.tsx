import { Canvas } from "@react-three/fiber";
import Asteroid from "./components/Asteroid";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useEffect, useState } from "react";

export default function App() {
  const [asteroidPosition, setAsteroidPosition] = useState([
    { id: 1, position: [90, 90, 90] },
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
          position: [randomValue(), randomValue(), randomValue()],
        },
      ]);
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [asteroidPosition]);

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <Stars fade={true} count={500} />

      <Physics gravity={[0, 0, 0]}>
        {asteroidPosition.map((e) => {
          return (
            <Asteroid
              key={e.id}
              position={e.position as [number, number, number]}
            />
          );
        })}
      </Physics>

      
      <ambientLight />
      <OrbitControls />
    </Canvas>
  );
}
