import useGame from "@/hooks/State";
import { Stars, Environment, Grid } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import SpaceDust from "./SpaceDust";
import DistantPlanets from "./DistantPlanets";

function PostProcessing() {
  return (
    <EffectComposer multisampling={0} resolutionScale={0.5}>
      <Bloom
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        height={300}
        intensity={0.5}
      />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  );
}

// Optimized lighting setup - reduced number of lights
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={10}
        castShadow
        shadow-mapSize={1024}
      />
      <directionalLight
        position={[-10, 15, 10]}
        intensity={10}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={1.5}
        decay={2}
        distance={20}
        color='#4060ff'
      />
    </>
  );
}

// Background nebula that follows the camera
function SpaceBackground() {
  const { camera } = useThree();
  const nebulaMaterial = useRef<THREE.ShaderMaterial>(null);

  // Simple shader for a space nebula effect
  const shader = {
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color("#020224") },
      color2: { value: new THREE.Color("#1d1d1d") },
      color3: { value: new THREE.Color("#1e1e1e") },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;

      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        // Create a nebula-like pattern
        float n = noise(vUv * 5.0 + time * 0.05);
        float nebula = smoothstep(0.4, 0.6, n);

        // Mix colors based on position and noise
        vec3 color = mix(color1, color2, vUv.x);
        color = mix(color, color3, nebula * 0.7);

        gl_FragColor = vec4(color, 0.8);
      }
    `,
  };

  useFrame(({ clock }) => {
    if (nebulaMaterial.current) {
      nebulaMaterial.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  // Update sphere position to follow camera
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.position.copy(camera.position);
      sphereRef.current.position.z -= 100; // Keep behind the camera
    }
  });

  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={sphereRef} scale={[150, 150, 200]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={nebulaMaterial}
        args={[shader]}
        side={THREE.BackSide}
        transparent={true}
      />
    </mesh>
  );
}

export default function Ambience() {
  const { settings } = useGame();
  const starsRef = useRef<THREE.Points>(null);

  // Animate stars slightly
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <>
      <Stars
        ref={starsRef}
        radius={500}
        depth={50}
        count={3000}
        factor={4}
        speed={0.25}
      />
      <SpaceBackground />
      <Lighting />

      {/* Distant elements for depth */}
      <DistantPlanets />

      {/* Space dust particles for immersion */}
      <SpaceDust count={70} size={0.005} />

      <Grid
        infiniteGrid
        fadeDistance={300}
        fadeStrength={20}
        cellSize={1}
        cellThickness={0.3}
        cellColor='#1d4ed8'
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor='#3b82f6'
        position={[0, -2, -10]}
        followCamera
      />

      {/* Use a darker environment preset */}
      <Environment preset='night' />

      {/* Only render post-processing if enabled in settings */}
      {settings[2].value && <PostProcessing />}
    </>
  );
}
