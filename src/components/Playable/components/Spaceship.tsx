import { useGLTF } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { forwardRef } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";

type GLTFResult = {
  nodes: {
    defaultMaterial: THREE.Mesh;
  };
  materials: {
    Base: THREE.Material;
  };
};

type SpaceshipProps = RigidBodyProps & {
  spaceshipRef?: React.RefObject<RapierRigidBody>;
};

const Spaceship = forwardRef<RapierRigidBody, SpaceshipProps>(
  (props, spaceshipRef) => {
    const { nodes, materials } = useGLTF(
      "/models/Spaceship.glb"
    ) as unknown as GLTFResult;

    const { setSpaceshipHealth } = useGame();

    return (
      <RigidBody
        scale={0.0125 / 2.2}
        position={[0, 0, 0]}
        ref={spaceshipRef}
        colliders='cuboid'
        type='fixed'
        onCollisionEnter={(e) => {
          setSpaceshipHealth();
          e.rigidBody?.sleep();

          setTimeout(() => {
            e.rigidBody?.wakeUp();
          }, 50);
        }}
      >
        <group {...props} dispose={null}>
          <group>
            <group rotation={[0, 0, 0]}>
              <mesh
                geometry={nodes.defaultMaterial.geometry}
                material={materials.Base}
                rotation={[-Math.PI/2, Math.PI, Math.PI]}
                scale={100}
              />
            </group>
          </group>
        </group>
      </RigidBody>
    );
  }
);

Spaceship.displayName = "Spaceship"; // Required for forwardRef components

useGLTF.preload("/models/Spaceship.glb");

export default Spaceship;
