import React, { useEffect, useRef, useState } from "react";
import Laser from "./components/Laser";
import Spaceship from "./components/Spaceship";
import useGame from "@/hooks/State";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RapierRigidBody } from "@react-three/rapier";

type LaserType = {
  id: number;
  ref: React.RefObject<RapierRigidBody | null>;
  position: { x: number; y: number; z: number };
  quaternion: { x: number; y: number; z: number; w: number };
};

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const targetRotationX = useRef<number>(-Math.PI / 2);
  const targetRotationY = useRef<number>(0);
  const [lasers, setLasers] = useState<LaserType[]>([]);
  const nextLaserId = useRef(1);

  const { pause } = useGame();

  useEffect(() => {
    if (pause) return;

    const shootLaser = () => {
      if (!spaceshipRef.current) return;

      const spaceshipPos = spaceshipRef.current.translation(); // Get spaceship position
      const spaceshipRot = spaceshipRef.current.rotation(); // Get spaceship rotation

      const newLaser = {
        id: nextLaserId.current,
        ref: React.createRef<RapierRigidBody>(),
        position: { x: spaceshipPos.x, y: spaceshipPos.y, z: spaceshipPos.z },
        quaternion: spaceshipRot,
      };

      setLasers((prev) => [...prev, newLaser]);
      nextLaserId.current += 1;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        shootLaser();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [pause]);

  useFrame(({ pointer }) => {
    if (!spaceshipRef.current) return;

    const sensitivityX = 0.5;
    const sensitivityY = 0.5;

    targetRotationX.current = -Math.PI / 2 + pointer.y * sensitivityY;
    targetRotationY.current = pointer.x * sensitivityX;

    const euler = new THREE.Euler(
      targetRotationX.current,
      -targetRotationY.current,
      0,
      "YXZ"
    );

    const quaternion = new THREE.Quaternion().setFromEuler(euler);

    spaceshipRef.current.setRotation(
      {
        x: quaternion.x,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w,
      },
      true
    );

    setLasers((prev) =>
      prev.filter((laser) => {
        if (!laser.ref.current) return true;

        const position = laser.ref.current.translation();
        return (
          Math.abs(position.x) < 400 &&
          Math.abs(position.y) < 400 &&
          Math.abs(position.z) < 400
        );
      })
    );
  });

  return (
    <group>
      {lasers.map((laser) => (
        <Laser
          key={laser.id}
          id={laser.id}
          laserRef={laser.ref}
          targetRotationX={targetRotationX.current}
          targetRotationY={targetRotationY.current}
        />
      ))}
      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
