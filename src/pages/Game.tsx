import { PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, lazy, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";
import Spinner from "@/components/ui/spinner";

const SpawnAsteroids = lazy(() => import("@/components/Playable/Asteroids"));
const Playable = lazy(() => import("@/components/Playable/Playable"));
const Ambience = lazy(() => import("@/components/Ambience/Ambience"));
const GameUX = lazy(() => import("@/components/ux/GameUX"));
const CustomLoader = lazy(() => import("@/components/ux/CustomLoader"));

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
    <>
      <PerspectiveCamera
        position={[0, 3, 11]}
        makeDefault
        near={0.05}
        far={10000}
        ref={cameraRef}
      />
    </>
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
        <Suspense fallback={<Spinner size={"large"} />}>
          <GameUX />
        </Suspense>

        <Canvas className='w-[100dvw] h-[100dvh]'>
          <Suspense fallback={null}>
            <Preload />
            <Camera />
            <Physics gravity={[0, 0, 0]} paused={pause}>
              <Suspense fallback={null}>
                <SpawnAsteroids />
              </Suspense>
              <Suspense fallback={null}>
                <Playable />
              </Suspense>
            </Physics>
            <Suspense fallback={null}>
              <Ambience />
            </Suspense>
          </Suspense>
        </Canvas>
      </div>

      <Suspense fallback={null}>
        {isLoading && <CustomLoader setIsLoading={setIsLoading} />}
      </Suspense>
    </>
  );
}
