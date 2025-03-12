import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

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
    } else if (key === "a") {
      setHorizontalAxis((prev) => prev + 0.07);
    } else if (key === "d") {
      setHorizontalAxis((prev) => prev - 0.07);
    } else if (key === "s") {
      console.log("Tilting down...");
    } else if (key === " ") {
      console.log("Boosting...");
    }
  });

  return (
    <>
      <PerspectiveCamera
        position={[0, 3, 20]}
        makeDefault
        ref={cameraRef}
        rotation={[0, 0, 0]}
      />
      <RigidBody
        scale={0.0125 / 2}
        ref={spaceshipRef}
        colliders='cuboid'
        type='fixed'
        rotation={[-Math.PI / 2, 0, horizontalAxis]}
      >
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
