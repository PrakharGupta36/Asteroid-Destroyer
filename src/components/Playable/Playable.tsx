import React, { useEffect, useRef, useState } from "react";
import Laser from "./components/Laser";
import Spaceship from "./components/Spaceship";
import useGame from "@/hooks/State";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RapierRigidBody } from "@react-three/rapier";

type LaserType = {
  id: number;
  ref: React.RefObject<RapierRigidBody | null>;
  direction: THREE.Vector3;
};

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const targetRotationX = useRef<number>(-Math.PI / 2);
  const targetRotationY = useRef<number>(0);
  const [lasers, setLasers] = useState<LaserType[]>([]);
  const nextLaserId = useRef(1);
  const raycaster = useRef(new THREE.Raycaster());
  const { camera } = useThree();
  const cursorPosition = useRef(new THREE.Vector2());

  const { pause } = useGame();

  useEffect(() => {
    if (pause) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && spaceshipRef.current) {
        // Get spaceship position
        const shipPos = spaceshipRef.current.translation();
        const shipPosition = new THREE.Vector3(shipPos.x, shipPos.y, shipPos.z);

        // Update raycaster with current mouse position
        raycaster.current.setFromCamera(cursorPosition.current, camera);

        // Calculate the point in 3D space (using a far plane)
        const targetPoint = new THREE.Vector3();
        raycaster.current.ray.at(1000, targetPoint);

        // Calculate direction from spaceship to target point
        const direction = new THREE.Vector3()
          .subVectors(targetPoint, shipPosition)
          .normalize();

        const newLaser = {
          id: nextLaserId.current,
          ref: React.createRef<RapierRigidBody>(),
          direction: direction,
        };

        setLasers((prev) => [...prev, newLaser]);
        nextLaserId.current += 1;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [pause, camera]);

  useFrame(({ pointer }) => {
    if (!spaceshipRef.current) return;

    // Store current pointer position for use in mouse down handler
    cursorPosition.current.set(pointer.x, pointer.y);

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

    // Clean up lasers that have gone too far
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
          direction={laser.direction}
          spaceshipRef={spaceshipRef}
        />
      ))}
      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
