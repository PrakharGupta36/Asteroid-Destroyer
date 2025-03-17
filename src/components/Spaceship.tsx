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

const Spaceship = forwardRef<RapierRigidBody, SpaceshipProps>((props, ref) => {
  const { nodes, materials } = useGLTF(
    "/Spaceship.glb"
  ) as unknown as GLTFResult;

  const localRef = useRef<RapierRigidBody>(null!);
  const spaceshipRef = (ref as React.RefObject<RapierRigidBody>) || localRef;

  const [key, setKey] = useState<string | null>(null);
 const [horizontalAxis, setHorizontalAxis] = useState<number>(-Math.PI / 2);
 const targetRotation = useRef<number>(-Math.PI / 2);
  const { pause, setSpaceshipHealth } = useGame();

  useEffect(() => {
    if (!pause) {
      const handleKeyDown = (e: KeyboardEvent) => setKey(e.key);
      const handleKeyUp = () => setKey(null);

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [pause]);

  useFrame(() => {
    if (!spaceshipRef.current) return;

    if (key === "a") {
      targetRotation.current = Math.min(-1.2, targetRotation.current + 0.07);
    } else if (key === "d") {
      targetRotation.current = Math.max(-1.9, targetRotation.current - 0.07);
    }

    setHorizontalAxis((prev) =>
      THREE.MathUtils.lerp(prev, targetRotation.current, 0.2)
    );

    spaceshipRef.current.setRotation(
      {
        x: -Math.PI / 2,
        y: 0,
        z: horizontalAxis,
        w: 0,
      },
      true
    );
  });

  return (
    <group>
      <Laser horizontalAxis={horizontalAxis} />
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
                castShadow
                receiveShadow
                geometry={nodes.defaultMaterial.geometry}
                material={materials.Base}
                rotation={[-Math.PI / 2, Math.PI, Math.PI]}
                scale={100}
              />
            </group>
          </group>
        </group>
      </RigidBody>
    </group>
  );
});

Spaceship.displayName = "Spaceship"; // Required for forwardRef components

useGLTF.preload("/Spaceship.glb");

export default Spaceship;
