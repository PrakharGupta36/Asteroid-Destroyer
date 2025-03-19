import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import useGame from "@/hooks/State";

export default function PostProcessing() {
  const { settings } = useGame();

  return (
    <EffectComposer multisampling={0} resolutionScale={0.2}>
      {settings[2].value ? (
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={1.0}
          height={300}
          intensity={0.25}
        />
      ) : (
        <></>
      )}

      {settings[3].value ? <Noise opacity={0.07} /> : <></>}

      {settings[3].value ? (
        <Vignette eskil={false} offset={0.1} darkness={0.35} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
