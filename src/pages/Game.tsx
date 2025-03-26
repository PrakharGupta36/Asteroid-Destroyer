import { lazy, Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Preload } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";

import useGame from "@/hooks/State";
import Cursor from "@/components/ux/Cursor";

// Lazy-loaded components
const SpawnAsteroids = lazy(() => import("@/components/Playable/Asteroids"));
const Playable = lazy(() => import("@/components/Playable/Playable"));
const Ambience = lazy(() => import("@/components/Ambience/Ambience"));
const GameUX = lazy(() => import("@/components/ux/GameUX"));
const CustomLoader = lazy(() => import("@/components/ux/CustomLoader"));

// Camera component with mouse-tracking rotation
const GameCamera = () => {
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
      ref={cameraRef}
      position={[0, 3, 11]}
      makeDefault
      near={0.05}
      far={10000}
    />
  );
};

export default function Game() {
  const [isLoading, setIsLoading] = useState(true);
  const { isOverAsteroid, pause } = useGame();

  return (
    <>
      {/* Game Canvas */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Game UI/UX (health, controls, etc.) */}
        <GameUX />

        {/* Crosshair Cursor */}
        {!pause && <Cursor isOverAsteroid={isOverAsteroid} />}

        {/* 3D Canvas */}
        <Canvas className='w-[100dvw] h-[100dvh]'>
          <Suspense fallback={null}>
            <Preload />
            <GameCamera />

            {/* Physics Environment */}
            <Physics gravity={[0, 0, 0]} paused={pause}>
              <SpawnAsteroids />
              <Playable />
            </Physics>

            <Ambience />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Screen */}
      {isLoading && <CustomLoader setIsLoading={setIsLoading} />}
    </>
  );
}
