import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  Glitch,
  HueSaturation,
  Noise,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import useGame from "@/hooks/State";
import { BlendFunction, GlitchMode } from "postprocessing";

export default function PostProcessing() {
  const { settings, isSpaceshipHit } = useGame();

  return (
    <EffectComposer multisampling={0} resolutionScale={0.5}>
      {settings[2].value ? (
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={2.0}
          height={300}
          intensity={0.7}
        />
      ) : (
        <></>
      )}

      {settings[3].value ? (
        <Noise premultiply opacity={0.3} blendFunction={BlendFunction.ADD} />
      ) : (
        <></>
      )}

      {settings[5].value ? (
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      ) : (
        <></>
      )}

      {settings[6].value ? (
        <BrightnessContrast brightness={-0.01} contrast={0.1} />
      ) : (
        <></>
      )}

      {settings[7].value ? (
        <HueSaturation
          blendFunction={BlendFunction.NORMAL}
          hue={0.05}
          saturation={0.2}
        />
      ) : (
        <></>
      )}

      {/* Spaceship hit effect 👇 */}

      {settings[8].value ? (
        <Glitch
          mode={GlitchMode.CONSTANT_WILD}
          active={isSpaceshipHit}
          ratio={0.1}
        />
      ) : (
        <></>
      )}

      {settings[9].value ? (
        <Scanline
          blendFunction={BlendFunction.OVERLAY}
          density={1.25}
          opacity={isSpaceshipHit ? 0.5 : 0}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
