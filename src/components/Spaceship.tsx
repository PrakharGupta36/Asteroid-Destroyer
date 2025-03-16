import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Laser from "./Laser";

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

const Spaceship = forwardRef<RapierRigidBody, SpaceshipProps>((props, ref) => {
  const { nodes, materials } = useGLTF(
    "/Spaceship.glb"
  ) as unknown as GLTFResult;

  const localRef = useRef<RapierRigidBody>(null!);
  const spaceshipRef = (ref as React.RefObject<RapierRigidBody>) || localRef;

  const [key, setKey] = useState<string | null>(null);
  const [horizontalAxis, setHorizontalAxis] = useState<number>(-Math.PI / 2);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKey(e.key);
    const handleKeyUp = () => setKey(null);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (key === "w") {
      console.log("Tilting up...");
    }
    if (key === "a") {
      if (!(horizontalAxis > -1.01)) {
        setHorizontalAxis((prev) => prev + 0.07);
      }
    }
    if (key === "d") {
      if (!(horizontalAxis < -2.3)) {
        setHorizontalAxis((prev) => prev - 0.07);
      }
    }
    if (key === "s") {
      console.log("Tilting down...");
    }
    if (key === " ") {
      console.log("Space");
    }
  });

  return (
    <>
      <RigidBody
        scale={0.0125 / 2.2}
        position={[0, 0, 0]}
        ref={spaceshipRef}
        colliders='cuboid'
        type='fixed'
        rotation={[-Math.PI / 2, 0, horizontalAxis]}
      >
        <Laser />

        <group {...props} dispose={null}>
          <group>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.defaultMaterial.geometry}
                material={materials.Base}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
            </group>
          </group>
        </group>
      </RigidBody>
    </>
  );
});

Spaceship.displayName = "Spaceship"; // Required for forwardRef components

useGLTF.preload("/Spaceship.glb");

export default Spaceship;
