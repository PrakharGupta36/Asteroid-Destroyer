import React, { useEffect, useRef, useState } from "react";
import Laser from "./components/Laser";
import Spaceship from "./components/Spaceship";
import useGame from "@/hooks/State";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";

type LaserType = {
  id: number;
  ref: React.RefObject<RapierRigidBody | null>;
};

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const [key, setKey] = useState<string | null>(null);
  const targetRotation = useRef<number>(-Math.PI / 2);
  const [lasers, setLasers] = useState<LaserType[]>([]);
  const nextLaserId = useRef(1);

  const { horizontalAxis, setHorizontalAxis, pause } = useGame();

  // Handle keyboard input
  useEffect(() => {
    if (pause) return;

    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "d") {
        setKey(e.key);
      }

      if (e.key === " ") {
        // Create a new laser with a unique ID and ref
        const newLaser = {
          id: nextLaserId.current,
          ref: React.createRef<RapierRigidBody | null>(),
        };

        setLasers((prev) => [...prev, newLaser]);
        nextLaserId.current += 1;
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
  }, [pause]);

  useFrame(() => {
    if (!spaceshipRef.current) return;

    if (key === "a") {
      targetRotation.current = Math.min(-0.75, targetRotation.current + 0.1);
    } else if (key === "d") {
      targetRotation.current = Math.max(-2.75, targetRotation.current - 0.1);
    }

    setHorizontalAxis(
      THREE.MathUtils.lerp(horizontalAxis, targetRotation.current, 0.3)
    );

    spaceshipRef.current.setRotation(
      { x: -Math.PI / 2, y: 0, z: targetRotation.current, w: 0 },
      true
    );

    setLasers((prev) =>
      prev.filter((laser) => {
        if (!laser.ref.current) return true;

        const position = laser.ref.current.translation();
        // Remove if laser has gone too far in any direction
        return (
          Math.abs(position.x) < 250 &&
          Math.abs(position.y) < 250 &&
          Math.abs(position.z) < 250
        );
      })
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
