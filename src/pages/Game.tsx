import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Preload } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";

import useGame from "@/hooks/State";
import Cursor from "@/components/ux/Cursor";
import Story from "./Story";
import Overlay from "@/utils/overlay";

// Lazy-loaded components
const SpawnAsteroids = lazy(() => import("@/components/Playable/Asteroids"));
const Playable = lazy(() => import("@/components/Playable/Playable"));
const Ambience = lazy(() => import("@/components/Ambience/Ambience"));
const GameUX = lazy(() => import("@/components/ux/GameUX"));
const CustomLoader = lazy(() => import("@/components/ux/CustomLoader"));

function GameCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lastPointerRotation = useRef(0);
  const { showStory, overlay } = useGame();

  useFrame(({ pointer }) => {
    if (!cameraRef.current) return;

    if (!showStory && !overlay) {
      cameraRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraRef.current.rotation.y,
        lastPointerRotation.current || -pointer.x / 2.75,
        0.05
      );

      lastPointerRotation.current = -pointer.x / 2.75;
    } else {
      cameraRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraRef.current.rotation.y,
        0,
        0.05
      );
      cameraRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraRef.current.rotation.x,
        0,
        0.05
      );
      cameraRef.current.rotation.z = THREE.MathUtils.lerp(
        cameraRef.current.rotation.z,
        0,
        0.05
      );

      lastPointerRotation.current = cameraRef.current.rotation.y;
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      position={[0, 3, 11]}
      rotation={[0, 0, 0]}
      makeDefault
      near={0.05}
      far={10000}
    />
  );
}

export default function Game() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    asteroidDestroyed,
    isOverAsteroid,
    showStory,
    pause,
    overlay,
    currentLevel,
    setCurrentLevel,
    setShowStory,
    setOverlay,
    setCountdown,
  } = useGame();

  useEffect(() => {
    if (asteroidDestroyed >= 30 && currentLevel === 1) {
      setTimeout(() => {
        setCurrentLevel(2);
        setShowStory(true);
        setCountdown(3);
        setOverlay(false);
      }, 150);
    }
  }, [
    asteroidDestroyed,
    currentLevel,
    setCountdown,
    setCurrentLevel,
    setOverlay,
    setShowStory,
  ]);

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
        {!pause && !showStory && !overlay && (
          <Cursor isOverAsteroid={isOverAsteroid} />
        )}

        {/* 3D Canvas */}
        <Canvas className='w-[100dvw] h-[100dvh]'>
          <Suspense fallback={null}>
            {showStory ? <Story /> : overlay && <Overlay />}
            <Preload />
            <GameCamera />

            {/* Physics Environment */}
            <Physics gravity={[0, 0, 0]} paused={showStory || overlay || pause}>
              {!showStory && !overlay && <SpawnAsteroids />}
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
