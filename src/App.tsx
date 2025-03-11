import { Canvas } from "@react-three/fiber";
import Asteroid from "./components/Asteroid";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <Stars fade={true} count={1000} />

      <Physics gravity={[0, 0, 0]}>
        <Asteroid position={[90, 90, 90]} />
      </Physics>

      <ambientLight />
      <OrbitControls />
    </Canvas>
  );
}
