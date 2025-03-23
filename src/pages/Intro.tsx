import SettingsMenu from "@/components/Settings/components/SettingsMenu";
import { Button } from "@/components/ui/button";
import { ButtonFancy } from "@/components/ui/buttonFancy";
import useGame from "@/hooks/State";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function IntroAnimation({ onFinish }: { onFinish: () => void }) {
  const text = ["Asteroid", "Destroyer"];
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnterClick = () => {
    setFadeOut(true);
    setTimeout(onFinish, 500); // Ensure smooth transition before setting finished
  };

  return (
    <motion.div
      className='gap-2 text-white italic text-4xl absolute inset-0 flex flex-col items-center justify-center'
      style={{
        background: "linear-gradient(to bottom right, #0f0f0f, #101010)",
        backdropFilter: "blur(50px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className='flex gap-2'>
        {text.map((word, i) => (
          <motion.div key={i} className='flex'>
            {word.split("").map((char, j) => (
              <motion.span
                key={j}
                className='word'
                initial={{ opacity: 0, x: -10, scale: 1, textShadow: "none" }}
                animate={
                  fadeOut
                    ? { opacity: 0, x: 10, scale: 1, textShadow: "none" }
                    : {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        textShadow: "6px 3px 10px rgba(4, 89, 237, .75)",
                      }
                }
                transition={{ delay: i * 0.4 + j * 0.05, duration: 1 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        className='mt-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Button
          variant={"ghost"}
          className='rainbow-button'
          onClick={handleEnterClick}
        >
          Enter
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function Intro() {
  const { setStart, isIntroAnimationFinish, setIsIntroAnimationFinish } =
    useGame();

  return (
    <AnimatePresence mode='wait'>
      {!isIntroAnimationFinish ? (
        <motion.div key='intro-animation' className='grid gap-7'>
          <IntroAnimation onFinish={() => setIsIntroAnimationFinish(true)} />
        </motion.div>
      ) : (
        <motion.div
          key='intro-menu'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "anticipate" }}
          className='grid gap-7'
        >
          <ButtonFancy onClick={() => setStart(true)}>Start</ButtonFancy>
          <SettingsMenu />
          <a
            href='https://x.com/___prakhar'
            className='credit-1'
            target='__blank'
          >
            ~ Made by Prakhar ❤️
          </a>

          <a
            href='https://github.com/PrakharGupta36/Asteroid-Destroyer'
            className='credit-2'
            target='__blank'
          >
            Leave a star on Github ⭐️
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
