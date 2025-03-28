import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const laserSound = new Audio("/sounds/laserSound.mp3");
laserSound.preload = "auto";
laserSound.volume = 0.5;

type GLTFResult = {
  nodes: { imagetostl_mesh3: THREE.Mesh };
  materials: { mat3: THREE.Material };
};

interface LaserProps extends Omit<RigidBodyProps, "position"> {
  laserRef: React.RefObject<RapierRigidBody | null>;
  id: number;
  targetRotationX: number;
  targetRotationY: number;
}

export default function Laser({
  laserRef,
  id,
  targetRotationX,
  targetRotationY,
  ...props
}: LaserProps) {
  const { nodes, materials } = useGLTF(
    "/models/Laser.glb"
  ) as unknown as GLTFResult;
  const laserDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const fired = useRef<boolean>(false);

  useEffect(() => {
    if (!fired.current && laserRef.current) {
      laserDirection.current
        .set(targetRotationX, targetRotationY, -100)
        .normalize()
        .multiplyScalar(100);

      fired.current = true;

      // Play laser sound
      laserSound.currentTime = 0;
      laserSound.play();
    }
  }, [laserRef, targetRotationX, targetRotationY]);

  useFrame(() => {
    if (laserRef.current) {
      laserRef.current.setLinvel(laserDirection.current, true);
      laserRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      laserRef.current.lockRotations(true, true);
    }
  });

  return (
    <RigidBody
      name={`laser-${id}`}
      ref={laserRef}
      {...props}
      type='kinematicVelocity'
      colliders='cuboid'
      position={[0, 0, -4.5]}
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
