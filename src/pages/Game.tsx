"use client";

import { PerspectiveCamera, Preload, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, lazy, useRef, useEffect, memo } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";
import { motion } from "framer-motion";

const ModelPreloader = memo(() => {
  useEffect(() => {
    const models = [
      "/Asteroid.glb",
      "/Boosters.glb",
      "/Gas_Giant.glb",
      "/Laser.glb",
      "/Purple Planet.glb",
      "/Spaceship.glb",
    ];

    models.forEach((path) => {
      useGLTF.preload(path);
    });
  }, []);

  return null;
});

const SpawnAsteroids = lazy(() => import("@/components/Playable/Asteroids"));
const Playable = lazy(() => import("@/components/Playable/Playable"));
const Ambience = lazy(() => import("@/components/Ambience/Ambience"));
const GameUX = lazy(() => import("@/components/ux/GameUX"));
const Loader = lazy(() => import("@/components/ux/Loader"));

const Camera = memo(() => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const rotationY = useRef(0);

  useFrame(({ pointer, clock }) => {
    if (!cameraRef.current) return;

    if (Math.floor(clock.elapsedTime * 60) % 2 !== 0) return;

    rotationY.current = THREE.MathUtils.lerp(
      rotationY.current,
      -pointer.x / 2.75,
      0.05
    );

    cameraRef.current.rotation.y = rotationY.current;
  });

  return (
    <PerspectiveCamera
      position={[0, 3, 11]}
      makeDefault
      near={0.05}
      far={10000}
      ref={cameraRef}
    />
  );
});

const RendererConfig = memo(() => {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.setClearColor(0x000000, 0);

    gl.shadowMap.enabled = false;

    gl.info.autoReset = false;

    return () => {
      gl.info.autoReset = true;
    };
  }, [gl]);

  return null;
});

export default function Game() {
  const { pause } = useGame();

  return (
    <Suspense
      fallback={
        <div className='grid place-items-center h-[100dvh]'>
          <Loader />
        </div>
      }
    >
      <ModelPreloader />

      <motion.div
        className='absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <GameUX />

        <Canvas
          dpr={[0.8, 1.2]}
          frameloop='demand'
          gl={{
            antialias: false,
            stencil: false,
            depth: false,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: false,
          }}
          performance={{ min: 0.5 }}
          className='w-[100dvw] h-[100dvh]'
        >
          <RendererConfig />
          <Preload all />
          <Camera />
          <Physics
            gravity={[0, 0, 0]}
            paused={pause}
            timeStep={1 / 60}
            interpolate={false}
          >
            <SpawnAsteroids />
            <Playable />
          </Physics>
          <Ambience />
        </Canvas>
      </motion.div>
    </Suspense>
  );
}
