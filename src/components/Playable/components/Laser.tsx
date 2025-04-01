import useGame from "@/hooks/State";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import type React from "react";
import { useRef, useEffect, useState } from "react";
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
  targetPoint: THREE.Vector3;
}

export default function Laser({
  laserRef,
  id,
  direction,
  spaceshipRef,
  targetPoint,
  ...props
}: LaserProps) {
  const { nodes, materials } = useGLTF(
    "/models/Laser.glb"
  ) as unknown as GLTFResult;
  const initialized = useRef<boolean>(false);

  const { settings, overlay, showStory, pause, currentLevel } = useGame();
  const [speed, setSpeed] = useState<number>(100);

  useEffect(() => {
    if (currentLevel === 2) {
      setSpeed(150);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (settings[1].value && !showStory && !overlay && !pause) {
      laserSound.currentTime = 0;
      laserSound.play().catch((e) => console.log("Audio play failed:", e));
    }
  }, [overlay, pause, settings, showStory]);

  useFrame(() => {
    if (
      !laserRef.current ||
      !spaceshipRef.current ||
      showStory ||
      overlay ||
      pause
    )
      return;

    if (!initialized.current && !showStory && !overlay && !pause) {
      const shipPos = spaceshipRef.current.translation();
      const shipPosition = new THREE.Vector3(shipPos.x, shipPos.y, shipPos.z);

      const exactDirection = new THREE.Vector3()
        .subVectors(targetPoint, shipPosition)
        .normalize();

      const offset = exactDirection.clone().multiplyScalar(5);

      laserRef.current.setTranslation(
        {
          x: shipPos.x + offset.x,
          y: shipPos.y + offset.y,
          z: shipPos.z + offset.z,
        },
        true
      );

      const lookAtMatrix = new THREE.Matrix4();
      lookAtMatrix.lookAt(
        shipPosition,
        targetPoint,
        new THREE.Vector3(0, 1, 0)
      );

      const quaternion = new THREE.Quaternion();
      quaternion.setFromRotationMatrix(lookAtMatrix);

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

    const velocity = direction.clone().multiplyScalar(speed);
    laserRef.current.setLinvel(
      {
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      },
      true
    );

    laserRef.current.lockRotations(true, true);
  });

  return (
    <RigidBody
      name={`laser-${id}`}
      ref={laserRef}
      {...props}
      type='kinematicVelocity'
      colliders='cuboid'
      scale={0.025}
      rotation={[-Math.PI / 2, Math.PI, Math.PI / 2]}
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
