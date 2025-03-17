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
    setTimeout(() => setFadeOut(true), 2000);
    setTimeout(() => setIsIntroAnimationFinish(true), 2500);
  }, [setIsIntroAnimationFinish]);

  return (
    <motion.div
      className='flex gap-2 text-white italic text-4xl'
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
              initial={{ opacity: 0, y: -30, scale: 0.85 }}
              animate={
                fadeOut
                  ? { opacity: 0, y: 30, scale: 0.85 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              transition={{ delay: i * 0.4 + j * 0.05, duration: 0.6 }}
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
          <ButtonFancy variant='outline' onClick={() => setStart(true)}>
            Start
          </ButtonFancy>
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
