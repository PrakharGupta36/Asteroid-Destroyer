import SettingsMenu from "@/components/Settings/components/SettingsMenu";
import { ButtonFancy } from "@/components/ui/buttonFancy";
import useGame from "@/hooks/State";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function IntroAnimation() {
  const { setIsIntroAnimationFinish } = useGame();
  const text = ["Asteroid", "Destroyer"];
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeOut(true), 2600);
    setTimeout(() => setIsIntroAnimationFinish(true), 3000);
  }, [setIsIntroAnimationFinish]);

  return (
    <motion.div
      className='gap-2 text-white italic text-4xl absolute inset-0 flex items-center justify-center'
      style={{
        background: "linear-gradient(to bottom right, #000000, #000000)",
        backdropFilter: "blur(50px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
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
    </motion.div>
  );
}

export default function Intro() {
  const { setStart, isIntroAnimationFinish } = useGame();

  return (
    <AnimatePresence mode='wait'>
      {!isIntroAnimationFinish ? (
        <motion.div key='intro-animation' className='grid gap-7'>
          <IntroAnimation />
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
