import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { JSX, useEffect, useRef } from "react";
import * as THREE from "three";

type GLTFResult_GasGiant = {
  nodes: {
    gas_giant_gas_giant_mat_0: THREE.Mesh;
    gas_giant_rings_mat_0: THREE.Mesh;
  };
  materials: {
    gas_giant_mat: THREE.Material;
    rings_mat: THREE.Material;
  };
};

function GasGiant(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Gas_Giant.glb"
  ) as unknown as GLTFResult_GasGiant;

  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group
      {...props}
      dispose={null}
      position={[-2000, 1000, -2500]}
      scale={200}
      rotation={[0.0125, 2.2, 0]}
    >
      <group rotation={[-Math.PI / 2, -0.373, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              geometry={nodes.gas_giant_gas_giant_mat_0.geometry}
              material={materials.gas_giant_mat}
            />
            <mesh
              geometry={nodes.gas_giant_rings_mat_0.geometry}
              material={materials.rings_mat}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

type GLTFResult_PurplePlanet = {
  nodes: {
    Planet_0: THREE.Mesh;
    Clouds_0_0: THREE.Mesh;
    Clouds_1_0: THREE.Mesh;
  };
  materials: {
    PurplePlanet: THREE.Material;
    Clouds_0: THREE.Material;
    Clouds_1: THREE.Material;
  };
  animations: THREE.AnimationClip[];
};

function PurplePlanet(props: JSX.IntrinsicElements["group"]) {
  const group = useRef(null);
  const { nodes, materials, animations } = useGLTF(
    "/models/Purple Planet.glb"
  ) as unknown as GLTFResult_PurplePlanet;

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => action?.play()); // Play all animations
    }
  }, [actions]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      animations={animations}
      position={[6000, 4000, -5500]}
      scale={2100}
      rotation={[0.0125, 2.2, 0]}
    >
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]}>
          <group name='Root'>
            <group name='Planet' rotation={[0, 0, Math.PI / 2]}>
              <mesh
                name='Planet_0'
                geometry={nodes.Planet_0.geometry}
                material={materials.PurplePlanet}
              />
              <group
                name='Clouds_0'
                rotation={[0, 0, -Math.PI / 2]}
                scale={1.013}
              >
                <mesh
                  name='Clouds_0_0'
                  geometry={nodes.Clouds_0_0.geometry}
                  material={materials.Clouds_0}
                />
              </group>
            </group>
            <group name='Clouds_1' scale={1.019}>
              <mesh
                name='Clouds_1_0'
                geometry={nodes.Clouds_1_0.geometry}
                material={materials.Clouds_1}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function DistantPlanets() {
  return (
    <>
      <GasGiant />
      <PurplePlanet />
    </>
  );
}

useGLTF.preload("/models/Gas_Giant.glb");
useGLTF.preload("/models/Purple Planet.glb");
