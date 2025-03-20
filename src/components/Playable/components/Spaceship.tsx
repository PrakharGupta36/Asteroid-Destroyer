import { useGLTF } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import useGame from "@/hooks/State";
// import Boosters from "./components/Boosters";

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
    const lastCollisionTime = useRef(0);

    return (
      <RigidBody
        name='spaceship'
        scale={0.0125 / 2.2}
        position={[0, 0, 0]}
        ref={spaceshipRef}
        colliders='trimesh'
        type='fixed'
        onCollisionEnter={() => {
          const now = Date.now();
          if (now - lastCollisionTime.current > 100) {
            setSpaceshipHealth();
            lastCollisionTime.current = now;
          }
        }}
      >
        <group {...props} dispose={null}>
          <group>
            <group rotation={[0, 0, 0]}>
              <mesh
                geometry={nodes.defaultMaterial.geometry}
                material={materials.Base}
                rotation={[-Math.PI / 2, Math.PI, Math.PI]}
                scale={100}
              />
            </group>
          </group>
        </group>
        {/* <Boosters /> */}
      </RigidBody>
    );
  }
);

Spaceship.displayName = "Spaceship"; // Required for forwardRef components

useGLTF.preload("/models/Spaceship.glb");

export default Spaceship;
