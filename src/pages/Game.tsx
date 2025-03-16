import { PerspectiveCamera, Preload, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import Asteroid from "../components/Asteroid";
import Spaceship from "../components/Spaceship";
import Ambience from "@/components/Ambience/Ambience";
import * as THREE from "three";
import useGame from "@/hooks/State";
import SettingsGame from "@/components/Settings/SettingsGame";
import CustomLoader from "@/components/CustomLoader";

function Camera() {
  useFrame(({ pointer }) => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y = -pointer.x / 3;
    }
  });

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  return (
    <PerspectiveCamera
      position={[0, 3, 12]}
      makeDefault
      near={0.05}
      far={10000}
      ref={cameraRef}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Game() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { progress } = useProgress();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const showLoaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 100);

    return () => clearTimeout(showLoaderTimer);
  }, []);

  // Handle loading state
  useEffect(() => {
    if (progress === 100) {
      // Start fade out animation
      setFadeOut(true);

      // After fade completes, set loading to false
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Duration of the fade-out animation

      return () => clearTimeout(timer);
    }
  }, [progress]);

  function randomValue(max: number, min: number) {
    const value = Math.random() * (max - min) + min;
    return Math.random() < 0.5 ? -value : value;
  }

  const [asteroidPosition, setAsteroidPosition] = useState([
    {
      id: 1,
      position: [randomValue(80, -80), 0, -300],
      rotation: [0, 0, 0],
      scale: 0.5,
    },
  ]);

  // Track current X position of spaceship for better asteroid spawning
  const [spaceshipX, setSpaceshipX] = useState(0);

  useEffect(() => {
    const positionInterval = setInterval(() => {
      if (spaceshipRef.current) {
        const position = spaceshipRef.current.translation();
        setSpaceshipX(position.x);
      }
    }, 100);

    return () => clearInterval(positionInterval);
  }, []);

  // Spawn asteroids
  useEffect(() => {
    const asteroidInterval = setInterval(() => {
      // Wider X range for distant asteroids
      const asteroidX = spaceshipX + randomValue(100, -100);

      // Much farther Z distance (-250 to -350)
      const asteroidZ = -250 - Math.random() * 100;

      // Variable scale to create depth perception
      const scale = 0.5 + Math.random() * 0.5;

      setAsteroidPosition((prev) => {
        const newAsteroids = [
          ...prev,
          {
            id: prev.length + 1,
            position: [asteroidX, 0, asteroidZ],
            rotation: [
              randomValue(-Math.random() / 2, Math.random() / 2),
              randomValue(-Math.random() / 2, Math.random() / 2),
              randomValue(-Math.random() / 2, Math.random() / 2),
            ],
            scale,
          },
        ];

        // Keep only the last 30 asteroids to prevent performance issues
        if (newAsteroids.length > 30) {
          return newAsteroids.slice(-30);
        }

        return newAsteroids;
      });
    }, 3000);

    return () => clearInterval(asteroidInterval);
  }, [spaceshipX]);

  const { pause } = useGame();

  return (
    <>
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <SettingsGame />
        <Canvas shadows>
          <Suspense fallback={null}>
            <Preload />
            <Camera />
            <Physics gravity={[0, 0, 0]} paused={pause}>
              {asteroidPosition.map((e) => (
                <Asteroid
                  scale={e.scale || 1.25}
                  key={e.id}
                  rotation={e.rotation as [number, number, number]}
                  position={e.position as [number, number, number]}
                />
              ))}

              <Spaceship spaceshipRef={spaceshipRef} />
            </Physics>

            <Ambience />
          </Suspense>
        </Canvas>
      </div>

      {showLoader && isLoading && (
        <div
          className={`transition-opacity duration-700 ${
            fadeOut ? "opacity-0" : ""
          } ${showLoader ? "opacity-100" : "opacity-0"}`}
        >
          <CustomLoader />
        </div>
      )}
    </>
  );
}
