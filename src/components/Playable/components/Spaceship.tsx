import { useGLTF } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { forwardRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useGame from "@/hooks/State";
import Boosters from "./components/Boosters";

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

    const { settings, setSpaceshipHealth } = useGame();

    const lastCollisionTime = useRef(0);
    const modelRef = useRef<THREE.Group>(null);

    const [wobbleIntensity, setWobbleIntensity] = useState(0);

    const wobbleDecay = 5;
    const wobbleFrequency = 15;

    const wobbleRotation = useRef({
      x: 0,
      y: 0,
      z: 0,
    });

    useFrame((_, delta) => {
      if (!modelRef.current) return;

      // Smoothly reduce wobble intensity
      setWobbleIntensity((prev) =>
        THREE.MathUtils.lerp(prev, 0, delta * wobbleDecay)
      );

      wobbleRotation.current = {
        x:
          Math.sin((Date.now() / 100) * wobbleFrequency * 1.1) *
          wobbleIntensity *
          0.2,
        y:
          Math.sin((Date.now() / 100) * wobbleFrequency * 0.9) *
          wobbleIntensity *
          0.09,
        z:
          Math.sin((Date.now() / 100) * wobbleFrequency) *
          wobbleIntensity *
          0.13,
      };

      modelRef.current.rotation.x = wobbleRotation.current.x;
      modelRef.current.rotation.y = wobbleRotation.current.y;
      modelRef.current.rotation.z = wobbleRotation.current.z;
    });

    const handleCollision = () => {
      const now = Date.now();
      if (now - lastCollisionTime.current > 100) {
        setSpaceshipHealth();
        lastCollisionTime.current = now;

        setWobbleIntensity((prev) => Math.min(prev + 1, 2));
      }
    };

    return (
      <>
        <RigidBody
          name='spaceship'
          scale={0.0125 / 2.2}
          position={[0, 0, 0]}
          ref={spaceshipRef}
          colliders='trimesh'
          type='fixed'
          onCollisionEnter={handleCollision}
        >
          <group ref={modelRef} {...props} dispose={null}>
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
            {settings[2].value && <Boosters />}
          </group>
        </RigidBody>
      </>
    );
  }
);

Spaceship.displayName = "Spaceship"; // Required for forwardRef components

useGLTF.preload("/models/Spaceship.glb");

export default Spaceship;
