import { PerspectiveCamera, Preload, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Asteroid from "../components/Asteroid";
import Spaceship from "../components/Spaceship";
import Ambience from "@/components/Ambience/Ambience";
import * as THREE from "three";
import useGame from "@/hooks/State";
import CustomLoader from "@/components/CustomLoader";
import GameUI from "@/components/GameUI";

function Camera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(({ pointer }) => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraRef.current.rotation.y,
        -pointer.x / 2.75,
        0.05
      );
    }
  });

  return (
    <PerspectiveCamera
      position={[0, 3, 12.5]}
      makeDefault
      near={0.05}
      far={10000}
      ref={cameraRef}
    />
  );
}

export default function Game() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { progress } = useProgress();
  const [showLoader, setShowLoader] = useState(false);
  const { pause } = useGame();
  const spaceshipX = useRef(0);

  useEffect(() => {
    const showLoaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 300);

    return () => clearTimeout(showLoaderTimer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setFadeOut(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress]);

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
    if (!pause) {
      const asteroidInterval = setInterval(() => {
        const asteroidX = spaceshipX.current + randomValue(100, -100);
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
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <GameUI />
        <Canvas className='w-[100dvw] h-[100dvh]' shadows>
          <Suspense fallback={null}>
            <Preload />
            <Camera />
            <Physics gravity={[0, 0, 0]} paused={pause}>
              {asteroidRef.current.map((e) => (
                <Asteroid
                  key={e.id}
                  scale={e.scale}
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
