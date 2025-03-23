import getLaserXPosition from "@/utils/getLaserXPosition";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

type GLTFResult = {
  nodes: {
    imagetostl_mesh3: THREE.Mesh;
  };
  materials: {
    mat3: THREE.Material;
  };
};

interface LaserProps extends RigidBodyProps {
  horizontalAxis: number;
  laserRef: React.RefObject<RapierRigidBody | null>;
  id: number;
}

export default function Laser({
  horizontalAxis,
  laserRef,
  id,
  ...props
}: LaserProps) {
  const { nodes, materials } = useGLTF(
    "/models/Laser.glb"
  ) as unknown as GLTFResult;

  const initialPosition = useRef<number>(getLaserXPosition(horizontalAxis));
  const laserDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialRotation = useRef<number>(horizontalAxis);
  const fired = useRef<boolean>(false);

  useEffect(() => {
    if (!fired.current) {
      laserDirection.current
        .set(
          -Math.cos(initialRotation.current),
          0,
          Math.sin(initialRotation.current)
        )
        .normalize()
        .multiplyScalar(100);

      fired.current = true;
    }
  }, []);

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
      position={[initialPosition.current, 0, -4.5]}
      rotation={[0, initialRotation.current, 0]}
      scale={0.025 / 1.5}
    >
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.imagetostl_mesh3.geometry}
          material={materials.mat3}
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/models/Laser.glb");
