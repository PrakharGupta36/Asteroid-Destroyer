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
    <EffectComposer multisampling={0} resolutionScale={0.75}>
      {settings[2].value ? (
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={1.0}
          height={500}
          intensity={1.0}
        />
      ) : (
        <></>
      )}

      {settings[3].value ? <Noise opacity={0.09} /> : <></>}

      {settings[3].value ? (
        <Vignette eskil={false} offset={0.1} darkness={0.45} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
