import { Button } from "@/components/ui/button";
import useGame from "@/hooks/State";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GameCompleted() {
  const [showGameOver, setShowGameOver] = useState(false);
  const { reset } = useGame();

  useEffect(() => {
    const timeout = setTimeout(() => setShowGameOver(true), 200); // Delay before showing
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {showGameOver && (
        <motion.main
          className='grid place-items-center w-[100dvw] h-[100dvh] bg-[#1d1d1d]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className='grid place-items-center gap-4'>
            <motion.h1
              className='text-white text-3xl'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Game Completed
            </motion.h1>
            <motion.h3
              className='text-white text-3xl italic'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Thanks for playing
            </motion.h3>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                variant='ghost'
                className='rainbow-button'
                onClick={() => {
                  reset();
                }}
              >
                Play Again
              </Button>
            </motion.div>
          </div>
          <div>
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
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
