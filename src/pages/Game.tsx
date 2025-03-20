import { PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

import useGame from "@/hooks/State";

import Playable from "@/components/playable/Playable";
import SpawnAsteroids from "@/components/playable/Asteroids";
import GameUI from "@/components/ux/GameUI";
import CustomLoader from "@/components/ux/CustomLoader";
import Ambience from "@/components/ambience/Ambience";

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
  const [isLoading, setIsLoading] = useState(true);
  const { pause } = useGame();

  return (
    <>
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <GameUI />
        <Canvas className='w-[100dvw] h-[100dvh]'>
          <Suspense fallback={null}>
            <Preload />
            <Camera />
            <Physics gravity={[0, 0, 0]} paused={pause}>
              <SpawnAsteroids />
              <Playable />
            </Physics>
            <Ambience />
          </Suspense>
        </Canvas>
      </div>
      {isLoading && <CustomLoader setIsLoading={setIsLoading} />}
    </>
  );
}
