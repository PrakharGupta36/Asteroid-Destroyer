"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import type React from "react";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const laserSound = new Audio("/sounds/laserSound.mp3");
laserSound.preload = "auto";
laserSound.volume = 0.5;

type GLTFResult = {
  nodes: { imagetostl_mesh3: THREE.Mesh };
  materials: { mat3: THREE.Material };
};

interface LaserProps extends RigidBodyProps {
  laserRef: React.RefObject<RapierRigidBody | null>;
  id: number;
  direction: THREE.Vector3;
  spaceshipRef: React.RefObject<RapierRigidBody>;
}

export default function Laser({
  laserRef,
  id,
  direction,
  spaceshipRef,
  ...props
}: LaserProps) {
  const { nodes, materials } = useGLTF(
    "/models/Laser.glb"
  ) as unknown as GLTFResult;
  const initialized = useRef<boolean>(false);
  const speed = 100; // Laser speed

  useEffect(() => {
    // Play laser sound when component mounts
    laserSound.currentTime = 0;
    laserSound.play().catch((e) => console.log("Audio play failed:", e));
  }, []);

  useFrame(() => {
    if (!laserRef.current || !spaceshipRef.current) return;

    if (!initialized.current) {
      // Get spaceship position for initial laser position
      const shipPos = spaceshipRef.current.translation();

      // Set initial position slightly in front of the spaceship in the direction of fire
      const offset = direction.clone().multiplyScalar(4.5);

      laserRef.current.setTranslation(
        {
          x: shipPos.x + offset.x,
          y: shipPos.y + offset.y,
          z: shipPos.z + offset.z,
        },
        true
      );

      // Calculate rotation to face the direction
      const quaternion = new THREE.Quaternion();
      const up = new THREE.Vector3(0, 1, 0);
      const matrix = new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        direction,
        up
      );
      quaternion.setFromRotationMatrix(matrix);

      laserRef.current.setRotation(
        {
          x: quaternion.x,
          y: quaternion.y,
          z: quaternion.z,
          w: quaternion.w,
        },
        true
      );

      initialized.current = true;
    }

    // Apply velocity in the direction
    const velocity = direction.clone().multiplyScalar(speed);
    laserRef.current.setLinvel(
      {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      },
      true
    );

    // Lock rotations to prevent physics from affecting rotation
    laserRef.current.lockRotations(true, true);
  });

  return (
    <RigidBody
      name={`laser-${id}`}
      ref={laserRef}
      {...props}
      type='kinematicVelocity'
      colliders='cuboid'
      scale={0.025 / 1.5}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.imagetostl_mesh3.geometry}
          material={materials.mat3}
          rotation={[-Math.PI / 2, Math.PI, Math.PI / 2]}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/models/Laser.glb");
