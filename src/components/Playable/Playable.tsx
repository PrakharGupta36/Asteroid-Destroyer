import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      setLaserCount((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    if (!pause) {
      const keyDownListener = (e: KeyboardEvent) => setKey(e.key);
      const keyUpListener = () => setKey(null);

      window.addEventListener("keydown", keyDownListener);
      window.addEventListener("keyup", keyUpListener);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", keyDownListener);
        window.removeEventListener("keyup", keyUpListener);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [pause, handleKeyDown]);

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
      { x: -Math.PI / 2, y: 0, z: targetRotation.current, w: 0 },
      true
    );
  });

  return (
    <group>
      {lasers.map((laser) => (
        <Laser
          key={laser.id}
          laserRef={laser.ref}
          horizontalAxis={horizontalAxis}
        />
      ))}

      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
