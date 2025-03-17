import getLaserXPosition from "@/utils/getLaserXPosition";
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
  const [xPosition, setXPosition] = useState<number>(
    getLaserXPosition(horizontalAxis)
  );

  useFrame(() => {
    const targetX = getLaserXPosition(horizontalAxis);
    setXPosition((prev) => THREE.MathUtils.lerp(prev, targetX, 0.25));
  });

  return (
    <RigidBody
      ref={laserRef}
      {...props}
      type='fixed'
      colliders='cuboid'
      position={[xPosition, 0, -4.5]}
      rotation={[0, horizontalAxis, 0]}
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

useGLTF.preload("/Laser.glb");
