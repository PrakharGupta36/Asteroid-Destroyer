import getLaserXPosition from "@/utils/getLaserXPosition";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import React, { useState } from "react";
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
}

export default function Laser({
  horizontalAxis,
  laserRef,
  ...props
}: LaserProps) {
  const { nodes, materials } = useGLTF("/models/Laser.glb") as unknown as GLTFResult;

  const [xPosition, setXPosition] = useState<number>(
    getLaserXPosition(horizontalAxis)
  );

  useFrame(() => {
    const targetX = getLaserXPosition(horizontalAxis);
    setXPosition((prev) => THREE.MathUtils.lerp(prev, targetX, 0.25));

    if (laserRef.current) {
      const speed = 50; // Speed of the laser
      
      const direction = new THREE.Vector3(
        Math.sin(xPosition/2) * speed,
        0,
        -100
      );

      laserRef.current.setLinvel(direction, true);

      // Lock all rotations
      laserRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      laserRef.current.lockRotations(true, true);
    }
  });

  return (
    <RigidBody
      ref={laserRef}
      {...props}
      type='kinematicVelocity'
      colliders='cuboid'
      position={[xPosition, 0, 0]}
      rotation={[0, horizontalAxis, 0]}
      scale={0.025}
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
