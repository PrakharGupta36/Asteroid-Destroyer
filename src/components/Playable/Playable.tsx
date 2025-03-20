import React, { useEffect, useRef, useState, useMemo } from "react";
import Laser from "./components/Laser";
import Spaceship from "./components/Spaceship";
import useGame from "@/hooks/State";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RapierRigidBody } from "@react-three/rapier";

type LaserType = {
  id: number;
  ref: React.RefObject<RapierRigidBody | null>;
};

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const [key, setKey] = useState<string | null>(null);
  const [horizontalAxis, setHorizontalAxis] = useState<number>(-Math.PI / 2);
  const targetRotation = useRef<number>(-Math.PI / 2);
  const [laserCount, setLaserCount] = useState(0); // Track number of lasers

  const { pause } = useGame();

  const lasers = useMemo<LaserType[]>(
    () =>
      Array.from({ length: laserCount }, (_, i) => ({
        id: i + 1,
        ref: React.createRef<RapierRigidBody | null>(),
      })),
    [laserCount]
  );

  useEffect(() => {
    if (!pause) {
      const handleKeys = (e: KeyboardEvent) => {
        // Set the current key for movement
        if (e.key === "a" || e.key === "d") {
          setKey(e.key);
        }

        // Only spawn laser on spacebar
        if (e.key === " ") {
          setLaserCount((prev) => prev + 1);
        }
      };

      const keyUpListener = (e: KeyboardEvent) => {
        if (e.key === "a" || e.key === "d") {
          setKey(null);
        }
      };

      window.addEventListener("keydown", handleKeys);
      window.addEventListener("keyup", keyUpListener);

      return () => {
        window.removeEventListener("keydown", handleKeys);
        window.removeEventListener("keyup", keyUpListener);
      };
    }
  }, [pause]);

  useFrame(() => {
    if (!spaceshipRef.current) return;

    if (key === "a") {
      targetRotation.current = Math.min(-0.75, targetRotation.current + 0.1);
    } else if (key === "d") {
      targetRotation.current = Math.max(-2.75, targetRotation.current - 0.1);
    }

    setHorizontalAxis((prev) =>
      THREE.MathUtils.lerp(prev, targetRotation.current, 0.3)
    );

    spaceshipRef.current.setRotation(
      { x: -Math.PI / 2, y: 0, z: targetRotation.current, w: 0 },
      true
    );
  });

  return (
    <group>
      {lasers.map((laser) => (
        <Laser
          id={laser.id}
          key={laser.id}
          laserRef={laser.ref}
          horizontalAxis={horizontalAxis}
        />
      ))}

      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
