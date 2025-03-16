import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { useRef, useState } from "react";
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
}

export default function Laser({ horizontalAxis, ...props }: LaserProps) {
  const { nodes, materials } = useGLTF("/Laser.glb") as unknown as GLTFResult;
  const laserRef = useRef<RapierRigidBody>(null);
  const [xPosition, setXPosition] = useState<number>(horizontalAxis);

  useFrame(() => {
    let targetX = 0;

    if (horizontalAxis < -1.99) targetX = 2.5;
    else if (horizontalAxis < -1.95) targetX = 2.3;
    else if (horizontalAxis < -1.9) targetX = 2.1;
    else if (horizontalAxis < -1.85) targetX = 1.8;
    else if (horizontalAxis < -1.8) targetX = 1.6;
    else if (horizontalAxis < -1.75) targetX = 1.4;
    else if (horizontalAxis < -1.7) targetX = 1.2;
    else if (horizontalAxis < -1.65) targetX = 1.0;
    else if (horizontalAxis < -1.6) targetX = 0.75;
    else if (horizontalAxis < -1.55) targetX = 0.5;
    else if (horizontalAxis < -1.5) targetX = 0.25;
    else if (horizontalAxis < -1.45) targetX = 0.1;
    else if (horizontalAxis < -1.4) targetX = -0.1;
    else if (horizontalAxis < -1.35) targetX = -0.3;
    else if (horizontalAxis < -1.3) targetX = -0.5;
    else if (horizontalAxis < -1.25) targetX = -1.0;
    else if (horizontalAxis < -1.2) targetX = -1.5;
    else if (horizontalAxis < -1.15) targetX = -1.8;
    else if (horizontalAxis < -1.1) targetX = -2.0;
    else if (horizontalAxis < -1.05) targetX = -2.5;
    else if (horizontalAxis < -1.0) targetX = -2.9;

    setXPosition(targetX);
  });

  return (
    <RigidBody
      ref={laserRef}
      {...props}
      type='fixed'
      colliders='cuboid'
      position={[xPosition, 0, -5]}
      rotation={[0, horizontalAxis, 0]}
      scale={0.025 / 1.25}
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

useGLTF.preload("/Laser.glb");
