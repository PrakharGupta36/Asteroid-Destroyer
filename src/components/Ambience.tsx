import { Stars, Environment, Grid } from "@react-three/drei";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";

export default function Ambience() {
  function PostProcessing() {
    return (
      <EffectComposer multisampling={0} resolutionScale={0.5}>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
        <Noise opacity={0.05} />
      </EffectComposer>
    );
  }

  return (
    <>
      <Stars fade={true} count={500} speed={1} />
      <ambientLight intensity={1} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid
        infiniteGrid
        fadeDistance={200}
        fadeStrength={25}
        position={[0, -2, -10]}
      />
      <Environment preset='city' />
      <PostProcessing />
    </>
  );
}
