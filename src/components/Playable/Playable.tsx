import { useEffect, useRef, useState } from "react";
import Laser from "./components/Laser";
import Spaceship from "./components/Spaceship";
import useGame from "@/hooks/State";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RapierRigidBody } from "@react-three/rapier";

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);

  const [key, setKey] = useState<string | null>(null);
  const [horizontalAxis, setHorizontalAxis] = useState<number>(-Math.PI / 2);
  const targetRotation = useRef<number>(-Math.PI / 2);

  const { pause } = useGame();

  useEffect(() => {
    if (!pause) {
      const handleKeyDown = (e: KeyboardEvent) => setKey(e.key);
      const handleKeyUp = () => setKey(null);

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [pause]);

  useFrame(() => {
    if (!spaceshipRef.current) return;

    if (key === "a") {
      targetRotation.current = Math.min(-1.2, targetRotation.current + 0.07);
    } else if (key === "d") {
      targetRotation.current = Math.max(-1.9, targetRotation.current - 0.07);
    }

    setHorizontalAxis((prev) =>
      THREE.MathUtils.lerp(prev, targetRotation.current, 0.2)
    );

    spaceshipRef.current.setRotation(
      {
        x: -Math.PI / 2,
        y: 0,
        z: horizontalAxis,
        w: 0,
      },
      true
    );
  });

  return (
    <group>
      <Laser horizontalAxis={horizontalAxis} />
      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
