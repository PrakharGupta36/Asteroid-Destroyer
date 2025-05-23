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
  direction: THREE.Vector3;
};

export default function Playable() {
  const spaceshipRef = useRef<RapierRigidBody>(null!);
  const [lasers, setLasers] = useState<LaserType[]>([]);
  const nextLaserId = useRef(1);

  const cursorPosition = useRef(new THREE.Vector2());
  const targetPoint = useRef(new THREE.Vector3());

  const { pause, overlay, showStory } = useGame();

  const targetPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 100));

  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (pause) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && spaceshipRef.current && !showStory && !overlay) {
        // Get spaceship position
        const shipPos = spaceshipRef.current.translation();
        const shipPosition = new THREE.Vector3(shipPos.x, shipPos.y, shipPos.z);

        // Calculate direction from spaceship to target point
        const direction = new THREE.Vector3()
          .subVectors(targetPoint.current, shipPosition)
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
  }, [overlay, pause, showStory]);

  useFrame(({ pointer, camera }) => {
    if (!spaceshipRef.current) return;

    cursorPosition.current.set(pointer.x, pointer.y);

    raycaster.current.setFromCamera(cursorPosition.current, camera);

    raycaster.current.ray.intersectPlane(
      targetPlane.current,
      targetPoint.current
    );

    const shipPos = spaceshipRef.current.translation();
    const shipPosition = new THREE.Vector3(shipPos.x, shipPos.y, shipPos.z);

    const lookAtMatrix = new THREE.Matrix4();
    lookAtMatrix.lookAt(
      shipPosition,
      targetPoint.current,
      new THREE.Vector3(0, 1, 0)
    );

    const quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix(lookAtMatrix);

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
          direction={laser.direction}
          spaceshipRef={spaceshipRef}
          targetPoint={targetPoint.current}
        />
      ))}
      <Spaceship ref={spaceshipRef} />
    </group>
  );
}
