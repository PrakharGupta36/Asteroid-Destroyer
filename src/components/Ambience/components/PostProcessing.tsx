import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0} resolutionScale={0.75}>
      <Bloom
        luminanceThreshold={0}
        luminanceSmoothing={1.0}
        height={500}
        intensity={1.0}
      />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.1} darkness={0.45} />
    </EffectComposer>
  );
}